import React, { Component } from 'react';
import {
    Animated,
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

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class SessionTime extends Component {

    constructor(props) {
        super(props);
        const id = deviceInfo.getUniqueID();

        const end = new Date(this.props.session.plannedEnd);
        const start = new Date(this.props.session.plannedStart);

        const duration = (end - start) / 1000;

        let timeLogged = 0;

        if (this.props.session.logging) {
            timeLogged = (new Date() - new Date(this.props.session.realStart)) / 1000;
        } else if (props.session.realEnd != null) {
            timeLogged = (new Date(props.session.realEnd) - new Date(props.session.realStart)) / 1000;
        }

        this._animatedValue = new Animated.Value(0);
        this.alertToShow = <FocusBoost enable={(focusMinutes) => this.enableFocusBoost(focusMinutes)} maxDuration={duration} />

        this.state = {
            id,
            duration,
            timeLogged,
            timer: (duration - timeLogged),
            session: props.session,
            playing: false,
            interval: null
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            const end = new Date(nextProps.session.plannedEnd);
            const start = new Date(nextProps.session.plannedStart);

            const duration = (end - start) / 1000;

            let timeLogged = 0;

            if (nextProps.session.logging) {
                timeLogged = (new Date() - new Date(nextProps.session.realStart)) / 1000;
            } else if (nextProps.session.realEnd != null) {
                timeLogged = (new Date(nextProps.session.realEnd) - new Date(nextProps.session.realStart)) / 1000;
            }

            this.alertToShow = <FocusBoost enable={(focusMinutes) => this.enableFocusBoost(focusMinutes)} maxDuration={duration} />

            this.setState({
                duration,
                timeLogged,
                timer: (duration - timeLogged),
                session: nextProps.session,
            });
        }
    }

    enableFocusBoost(focusMinutes) {
        this.setState({focusMinutes, focusLogged: 0, showAlert: false})
    }

    _onStartPress() {
        this.blackout();

        this.state.playing = !this.state.playing;
    }

    blackout() {
        this.props.blackout();
        if (!this.state.playing) {
            this.props.navigator.setStyle({
                statusBarHidden: true
            });
            Animated.timing(this._animatedValue, {
                toValue: 100,
                duration: 1000
            }).start(this.beginSession());
        } else {
            this.props.navigator.setStyle({
                statusBarHidden: false
            });
            Animated.timing(this._animatedValue, {
                toValue: 0,
                duration: 2000
            }).start(this.endSession());
        }
    }

    startTimer() {
        this.setState({playing: true})
        this.state.interval = setInterval(() => {
            const timeLogged = (new Date() - new Date(this.state.session.realStart)) / 1000;
            const timer = (this.state.duration - timeLogged);

            const focusLogged = timeLogged;

            let completedTime = false;
            let completedFocus = false;
            if (this.state.timer == 0) {
                completedTime = true
            }
            if (this.state.focusLogged >= this.state.focusMinutes && this.state.focusMinutes != null) {
                completedFocus = true
            }
            this.setState({ timer, timeLogged, completedTime, focusLogged, completedFocus })
        }, 1000);
    }

    beginSession() {
        const realStart = new Date().toISOString();
        this.state.session.realStart = realStart;
        let userRef = database.ref('users/').child(this.state.id).child('sessions').child(this.state.session.key);
        userRef.child('realStart').set(realStart);

        this.startTimer()
    }
    
    endSession() {
        clearInterval(this.state.interval);
        const realEnd = new Date().toISOString();

        const userRef = database.ref('users/').child(this.state.id);
        const goalTimeRef = userRef.child('goals').child(this.state.session.goalKey).child('totalMinutes');

        goalTimeRef.once('value', (snapshot) => {
            if (snapshot.val() == null) {
                goalTimeRef.set(Math.round(this.state.timeLogged/60))
            } else {
                const totalMinutes = snapshot.val() + (Math.round(this.state.timeLogged/60));
                goalTimeRef.set(totalMinutes)
            }
        })

        userRef.child('sessions').child(this.state.session.key).child('realEnd').set(realEnd);
        this.state.session.realEnd = realEnd;
        let session = this.state.session;
        session.realEnd = realEnd;
        this.setState({session, playing: false})
    }

    _reset() {
        let session = this.state.session;
        session.realEnd = null;
        session.realStart = null;
        const userRef = database.ref('users/').child(this.state.id);
        userRef.child('sessions').child(this.state.session.key).child('realStart').set(session.realStart);
        userRef.child('sessions').child(this.state.session.key).child('realEnd').set(session.realEnd);
        this.setState({session, timer: this.state.duration, focusLogged: null, focusMinutes: null})
    }

    _openFocusBoost() {
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
                    size={300}
                    thickness={1}
                    progress={this.state.timeLogged / this.state.duration}
                    borderWidth={0}
                    strokeCap='round'
                    style={{ marginTop: 30 }} />

                {this.state.session != null ? <View style={styles.insideCircle}>
                    <AnimatedIcon name={this.state.session.iconName != null ? this.state.session.iconName : 'ios-paw-outline'}
                        size={100} style={{ color: textColorAnim }} />
                </View> : null}
                <Animated.Text style={[styles.normalText, { color: textColorAnim }]}>{formatSeconds(this.state.timer)}</Animated.Text>
                {this.state.session.realEnd == null ? 
                <View style={{alignItems: 'center'}}>
                    <AnimatedTouchable onPress={() => this._onStartPress()} style={[styles.actionButton, { backgroundColor: buttonColorAnim }]}>
                        <Animated.Text style={[styles.normalText, { color: 'white', position: 'absolute', opacity: startAnim }]}>
                            Start</Animated.Text>
                        <Animated.Text style={[styles.normalText, { color: colors.tigerOrange, position: 'absolute', opacity: endAnim }]}>
                            End</Animated.Text>
                    </AnimatedTouchable>
                    <TouchableOpacity disabled={this.state.playing} onPress={() => this._openFocusBoost()}>
                        {this.state.focusMinutes == null ?
                        <Text style={[styles.normalText]}>
                            Focus Boost?
                        </Text> 
                        :
                        <Text style={[styles.normalText, {color: colors.tigerOrange}]}>
                            Focus Boost: {formatSeconds(this.state.focusMinutes-this.state.focusLogged)}
                        </Text>}
                    </TouchableOpacity>
                    {this.state.focusMinutes != null ? 
                        <Bar width={300} 
                            height={1} 
                            borderWidth={0} 
                            progress={this.state.focusLogged/this.state.focusMinutes} 
                            color={colors.tigerOrange} /> : null
                    }
                </View>
                : 
                <TouchableOpacity onPress={() => this._reset()}>
                    <Text style={[styles.normalText, {color: colors.tigerOrange}]}>Reset</Text>
                </TouchableOpacity>}

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

//15 + 50 + 150

const styles = StyleSheet.create({
    container: {
        height: Screen.height,
        width: Screen.width,
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'pink',
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
        marginTop: 20,
        marginBottom: 10,
        width: 150,
        height: 50
    },
    insideCircle: {
        height: 300,
        width: 300,
        marginTop: 45,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    }
});