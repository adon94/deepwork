import React, { Component } from 'react';
import {
    Animated,
    AppState,
    Dimensions,
    StyleSheet,
    Slider,
    Text,
    TouchableOpacity,
    TimePickerAndroid,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import deviceInfo from 'react-native-device-info';
import { Circle, Bar } from 'react-native-progress';
import Modal from 'react-native-modal';

import { colors, formatSeconds } from '../constants';
import { database } from '../firebase';
import FocusBoost from '../components/FocusBoost';
import GoalSelect from '../components/GoalSelect';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class SessionTime extends Component {

    constructor(props) {
        super(props);
        const id = deviceInfo.getUniqueID();

        const end = new Date(props.session.plannedEnd);
        const start = new Date(props.session.plannedStart);

        const countUp = (props.session.plannedEnd == props.session.plannedStart);

        const duration = (end - start) / 1000;

        let timeLogged = 0;

        if (props.session.logging) {
            timeLogged = (new Date() - new Date(props.session.realStart)) / 1000;
        } else if (props.session.realEnd != null) {
            timeLogged = (new Date(props.session.realEnd) - new Date(props.session.realStart)) / 1000;
        }

        const completedTime = duration < timeLogged;

        this._animatedValue = new Animated.Value(0);
        this.alertToShow = <FocusBoost enable={(focusMinutes) => this.enableFocusBoost(focusMinutes)} maxDuration={!countUp ? duration : 3600} />

        this.state = {
            id,
            duration,
            timeLogged,
            completedTime,
            countUp,
            pauseDuration: 0,
            focusTimeLost: 0,
            timer: !completedTime ? (duration - timeLogged) : (timeLogged - duration),
            session: props.session,
            playing: false,
            interval: null,
            focusMinutes: null,
            focusLogged: null,
            appState: AppState.currentState,
            lostFocus: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            const end = new Date(nextProps.session.plannedEnd);
            const start = new Date(nextProps.session.plannedStart);
            console.log('you got past end and start')
            const countUp = (nextProps.session.plannedEnd == nextProps.session.plannedStart);
            console.log('you got countUp')

            const duration = (end - start) / 1000;

            let timeLogged = 0;

            if (nextProps.session.logging) {
                timeLogged = (new Date() - new Date(nextProps.session.realStart)) / 1000;
            } else if (nextProps.session.realEnd != null) {
                timeLogged = (new Date(nextProps.session.realEnd) - new Date(nextProps.session.realStart)) / 1000; //todo - nextProps.pauseDuration
            }

            const completedTime = duration < timeLogged;

            this.alertToShow = <FocusBoost enable={(focusMinutes) => this.enableFocusBoost(focusMinutes)} maxDuration={!countUp ? duration : 3600} />

            this.setState({
                duration,
                timeLogged,
                completedTime,
                countUp,
                timer: !completedTime ? (duration - timeLogged) : (timeLogged - duration),
                session: nextProps.session,
                pauseDuration: 0,
                focusTimeLost: 0,
                playing: false,
                interval: null,
                focusMinutes: null,
                focusLogged: null,
                appState: AppState.currentState,
                lostFocus: false
            });
        }
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        // console.log(nextAppState);
        // if(nextAppState === 'inactive' && this.state.playing) {
        //     console.log(nextAppState);
        // }

        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active' && this.state.paused) {
          console.log('App has come to the foreground!')
          this.props.blackout(false);
          Animated.timing(this._animatedValue, {
              toValue: 0,
              duration: 2000
          }).start();

          if (this.state.lostFocus) {
              const lostFocusTime = new Date() - new Date(this.state.pausedAt);
            //   const secondsLost = (lostFocusTime/1000);
              this.state.focusTimeLost = this.state.focusTimeLost + (lostFocusTime*10);
              console.log('lost ', formatSeconds(this.state.focusLogged/1000))
          }

          this.setState({appState: nextAppState, lostFocus: false});
        //   this.pauseSession();
        } else if (nextAppState === 'background' && this.state.playing) {
            clearInterval(this.state.interval);
            console.log('focus boost: ', this.state.focusMinutes > this.state.focusLogged)
            this.setState({ 
                lostFocus: this.state.focusMinutes > this.state.focusLogged,
                appState: nextAppState,
                playing: false,
                paused: true,
                pausedAt: new Date().toISOString()
            });
        } else {
            console.log('oops')
            this.setState({appState: nextAppState});
        }
    }

    enableFocusBoost(focusMinutes) {
        if (focusMinutes != 0) {
            this.setState({ focusMinutes, focusLogged: 0, showAlert: false });
        } else {
            this.setState({ focusMinutes: null, focusLogged: null, showAlert: false });
        }
    }

    _onStartPress() {
        if (!this.state.paused) {
            this.blackout();
        } else {
            this.resume()
        }

        this.state.playing = !this.state.playing;
    }

    resume() {
        const userRef = database.ref('users');
        userRef.child(this.state.session.userKey).child('playing').set(true)
        const resumedAt = new Date();
        pauseDuration = resumedAt - new Date(this.state.pausedAt);
        this.state.pauseDuration = pauseDuration + this.state.pauseDuration;
        this.state.paused = false;
        this.props.blackout(true);
        Animated.timing(this._animatedValue, {
            toValue: 100,
            duration: 1000
        }).start(this.startTimer());
    }

    blackout() {
        if (!this.state.playing) {
            this.props.blackout(true);
            Animated.timing(this._animatedValue, {
                toValue: 100,
                duration: 1000
            }).start(this.beginSession());
        } else {
            this.props.blackout(false);
            Animated.timing(this._animatedValue, {
                toValue: 0,
                duration: 2000
            }).start(this.endSession());
        }
    }

    startTimer() {
        this.setState({ playing: true })
        this.state.interval = setInterval(() => {

            let timeLogged = ((new Date() - new Date(this.state.session.realStart) - this.state.pauseDuration - this.state.focusTimeLost) / 1000);
            
            if (timeLogged < 0) {
                timeLogged = 0;
            }

            let timer = (this.state.duration - timeLogged);

            const focusLogged = timeLogged; // <- this is bad

            // let completedTime = false;
            let completedFocus = false;
            if (this.state.duration < timeLogged || this.state.countUp) {
                this.state.completedTime = true
                timer = timeLogged - this.state.duration;
            }
            // if (this.state.completedTime) {
            // }
            if (this.state.focusLogged >= this.state.focusMinutes && this.state.focusMinutes != null) {
                completedFocus = true
            }
            this.setState({ timer, timeLogged, focusLogged, completedFocus })
        }, 1000);
    }

    beginSession() {
        if (!this.state.paused) {
            const realStart = new Date().toISOString();
            this.state.session.realStart = realStart;
            this.state.resumeStart = realStart;

            const sessionsRef = database.ref('sessions');

            if (this.state.session.key != null) {
                sessionsRef.child(this.state.session.key).child('realStart').set(realStart);
            } else {
                const keyRef = sessionsRef.push();
                keyRef.set(this.state.session);
                this.state.session.key = keyRef.key
            }
            const userRef = database.ref('users');
            userRef.child(this.state.session.userKey).child('playing').set(true);
            userRef.child(this.state.session.userKey).child('currentSession').set(this.state.session.key);
            userRef.child(this.state.session.userKey).child('startedAt').set(realStart);
            userRef.child(this.state.session.userKey).child('duration').set(this.state.duration);
        }
        this.startTimer()
    }

    pauseSession() {
        clearInterval(this.state.interval);
        this.props.blackout(false);
        Animated.timing(this._animatedValue, {
            toValue: 0,
            duration: 2000
        }).start();

        const userRef = database.ref('users');
        userRef.child(this.state.session.userKey).child('playing').set(false)

        // const userRef = database.ref('users/').child(this.state.id);
        // userRef.child('sessions').child(this.state.session.key).child('pausedAt').set(session.realStart);
        this.setState({ playing: false, paused: true, pausedAt: new Date().toISOString() })
    }

    endSession() {
        clearInterval(this.state.interval);
        const realEnd = new Date().toISOString();

        // const userRef = database.ref('users/').child(this.state.id);
        // const goalTimeRef = userRef.child('goals').child(this.state.session.goalKey).child('totalMinutes');
        const sessionRef = database.ref('sessions');
        const goalTimeRef = database.ref('goals').child(this.state.session.goalKey).child('totalMinutes');
        goalTimeRef.once('value', (snapshot) => {
            if (snapshot.val() == null) {
                goalTimeRef.set(Math.round(this.state.timeLogged / 60))
            } else {
                const totalMinutes = snapshot.val() + (Math.round(this.state.timeLogged / 60));
                goalTimeRef.set(totalMinutes)
            }
        });
        const userRef = database.ref('users');
        userRef.child(this.state.session.userKey).child('playing').set(false);
        userRef.child(this.state.session.userKey).child('currentSession').set(null);
        userRef.child(this.state.session.userKey).child('startedAt').set(null);
        userRef.child(this.state.session.userKey).child('duration').set(null);
        userRef.child(this.state.session.userKey).child('totalMinutes').once('value', (snapshot) => {
            if (snapshot.val() == null) {
                userRef.child(this.state.session.userKey).child('totalMinutes').set(Math.round(this.state.timeLogged / 60));
            } else {
                const totalMinutes = snapshot.val() + (Math.round(this.state.timeLogged / 60));
                userRef.child(this.state.session.userKey).child('totalMinutes').set(totalMinutes);
            }
        });
        sessionRef.child(this.state.session.key).child('realEnd').set(realEnd);
        sessionRef.child(this.state.session.key).child('timeLogged').set(this.state.timeLogged);
        this.state.session.realEnd = realEnd;
        let session = this.state.session;
        session.realEnd = realEnd;
        this.setState({ session, playing: false });
    }

    _reset() {
        let session = this.state.session;
        session.realEnd = null;
        session.realStart = null;
        const userRef = database.ref('users/').child(this.state.id);
        //if you use reset again, update the refs below
        userRef.child('sessions').child(this.state.session.key).child('realStart').set(session.realStart);
        userRef.child('sessions').child(this.state.session.key).child('realEnd').set(session.realEnd);
        this.setState({
            session,
            timer: this.state.duration,
            resumeStart: null,
            focusLogged: null,
            focusMinutes: null,
            completedTime: false,
            paused: false,
            pausedAt: null,
            pauseDuration: 0
        })
    }

    changeGoal() {
        this.alertToShow = <GoalSelect goalSelect={(goal) => this.goalSelected(goal)} />
        this.setState({ showAlert: true })
    }

    goalSelected(goal) {
        if (goal != null) {
            this.state.session.iconName = goal.iconName;
            this.state.session.goalKey = goal.key;
            if (this.state.session.key != null) {
                const sessionRef = database.ref('sessions').child(this.state.session.key);
                sessionRef.child('iconName').set(goal.iconName);
                sessionRef.child('goalKey').set(goal.key);
            }
        } else {
            this.state.session.iconName = null;
            this.state.session.goalKey = null;
            if (this.state.session.key != null) {
                const sessionRef = database.ref('sessions').child(this.state.session.key);
                sessionRef.child('iconName').set(null);
                sessionRef.child('goalKey').set(null);
            }
        }
        this.setState({ showAlert: false })
    }

    _openFocusBoost() {
        this.alertToShow = <FocusBoost enable={(focusMinutes) => this.enableFocusBoost(focusMinutes)} maxDuration={!this.state.countUp ? this.state.duration : 3600} />
        this.setState({ showAlert: true });
    }

    closeAlert() {
        this.setState({ showAlert: false });
    }

    render() {
        const backgroundColorAnim = this._animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: ['rgba(255,255,255, 1)', 'rgba(0,0,0, 1)']
        });
        const textColorAnim = this._animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: ['rgba(68, 68, 68, 1)', colors.tigerRGB]
        });
        const buttonColorAnim = this._animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: [colors.tigerRGB, 'rgba(211, 84, 0, 0)']
        });
        const startAnim = this._animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0]
        });
        const endAnim = this._animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1]
        });
        const AnimatedIcon = Animated.createAnimatedComponent(Icon);
        const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

        return (
            <Animated.View style={[styles.container, {
                backgroundColor: backgroundColorAnim
            }]}>
                <Circle color={colors.tigerOrange}
                    size={250}
                    thickness={1}
                    progress={!this.state.countUp ? (this.state.timeLogged / this.state.duration) : 1}
                    borderWidth={0}
                    strokeCap='round'
                    style={{ marginTop: 30 }} />

                {this.state.session != null ? <TouchableOpacity style={styles.insideCircle} disabled={this.state.playing} onPress={() => this.changeGoal()}>
                    <AnimatedIcon name={this.state.session.iconName != null ? this.state.session.iconName : colors.noGoalIcon}
                        size={100} style={{ color: textColorAnim }} />
                    {this.state.session.seshName != null ?
                        <Animated.Text style={[styles.normalText, { color: textColorAnim }]}>{this.state.session.seshName}</Animated.Text>
                        : null}
                </TouchableOpacity> : null}

                <Animated.Text style={[styles.normalText, { color: textColorAnim, marginTop: 15 }]}>
                    {this.state.completedTime && !this.state.countUp ? '+' : null}{formatSeconds(this.state.timer)}</Animated.Text>
                {/* {this.state.completedTime ? <Animated.Text style={[styles.normalText, { color: textColorAnim, marginTop: 0 }]}>(overtime)</Animated.Text> : null} */}

                {this.state.playing ? <TouchableOpacity disabled={this.state.focusMinutes > this.state.focusLogged} onPress={() => this.pauseSession()} 
                    style={[styles.actionButton]}>
                    {this.state.playing && this.state.focusMinutes <= this.state.focusLogged ? <Text style={[styles.normalText, {color: colors.tigerOrange}]}>Pause</Text> : 
                    <Text style={[styles.normalText, {color: colors.tigerOrange}]}>No Pausing</Text> }
                </TouchableOpacity> : null}
                {this.state.session.realEnd == null ?
                    <View style={{ alignItems: 'center' }}>
                        <AnimatedTouchable onPress={() => this._onStartPress()} style={[styles.actionButton, { backgroundColor: buttonColorAnim }]}>
                            <Animated.Text style={[styles.normalText, { color: 'white', position: 'absolute', opacity: startAnim }]}>
                                {!this.state.paused && this.state.pauseDuration == 0 ? 'Start' : 'Resume'}</Animated.Text>
                            <Animated.Text style={[styles.normalText, { color: colors.tigerOrange, position: 'absolute', opacity: endAnim }]}>
                                End</Animated.Text>
                        </AnimatedTouchable>
                        <TouchableOpacity disabled={this.state.playing} onPress={() => this._openFocusBoost()}>
                            {this.state.focusMinutes == null ?

                                <Text style={[styles.normalText, { color: colors.tigerOrange }]}>
                                    {!this.state.playing ? 'Focus Boost' : null}
                                </Text>
                                :
                                <Text style={[styles.normalText, { color: colors.tigerOrange }]}>
                                    Focus Boost: {this.state.focusMinutes > this.state.focusLogged ? formatSeconds(this.state.focusMinutes - this.state.focusLogged) : 'Complete'}
                                </Text>}
                        </TouchableOpacity>
                        {this.state.focusMinutes != null ?
                            <Bar width={300}
                                height={1}
                                borderWidth={0}
                                progress={this.state.focusLogged / this.state.focusMinutes}
                                color={colors.tigerOrange} /> : null
                        }
                    </View>
                    :
                    <View>
                        <Text style={[styles.normalText, { marginBottom: 0 }]}>
                            Started at {moment(this.state.session.realStart).format('HH:mm')}
                        </Text>
                        <Text style={[styles.normalText, { marginTop: 0 }]}>
                            Ended at {moment(this.state.session.realEnd).format('HH:mm')}
                        </Text>
                        {/* <TouchableOpacity onPress={() => this._reset()}>
                            <Text style={[styles.normalText, { color: colors.tigerOrange }]}>Reset</Text>
                        </TouchableOpacity> */}
                    </View>}

                <Modal isVisible={this.state.showAlert}
                    onBackdropPress={() => this.setState({ showAlert: false })}
                    onBackButtonPress={() => this.setState({ showAlert: false })}
                    useNativeDriver={true}
                    style={{ justifyContent: 'flex-end' }}>
                    {this.alertToShow}
                </Modal>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: Screen.height,
        width: Screen.width,
        alignItems: 'center',
        padding: 15,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    normalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.normalText,
        margin: 10,
        alignSelf: 'center'
    },
    actionButton: {
        borderColor: colors.tigerOrange,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 10,
        width: 150,
        height: 50
    },
    insideCircle: {
        height: 250,
        width: 250,
        borderRadius: 125,
        marginTop: 45,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'pink',
        // opacity: 0.5
    }
});