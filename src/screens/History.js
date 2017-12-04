import React, { Component } from 'react';
import {
    Alert,
    Animated,
    BackHandler,
    Dimensions,
    FlatList,
    Keyboard,
    ListView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import deviceInfo from 'react-native-device-info';
import Interactable from 'react-native-interactable';
import Modal from 'react-native-modal';

import Level from '../components/Level';
import { colors, formatMinutes } from '../constants';
import { auth, database } from '../firebase';
import NoHistory from '../components/NoHistory';
import Bubble from '../components/Bubble';
import Options from '../components/Options';
import levels from '../data/levels';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class History extends Component {
    constructor(props) {
        super(props);

        const id = deviceInfo.getUniqueID();

        this.state = {
            id,
            goals: [],
            totalMinutes: 0,
            showAlert: false,
            days: [],
            level: levels[0],
            progress: 0
        }
        this.userRef = database.ref('users/').child(id);
        this.alertToShow = <Options />;
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user != null) {
                const userKey = user.uid;
                this.getUserMinutes(userKey)
                this.getGoalData(userKey);
                this.getDays(userKey);
            }
        });
    }

    getUserMinutes(userKey) {
        const userMinutesRef = database.ref('users').child(userKey).child('totalMinutes');

        userMinutesRef.on('value', (snapshot) => {
            const totalMinutes = snapshot.val();
            if(totalMinutes != null) {
                const levelMinutes = (totalMinutes/60);
                let level = levels[0];
                let progress = 0;
                levels.every((element, index) => {
                    if (element.minutes > levelMinutes) {
                        level = levels[index-1];

                        progress = (levelMinutes-level.minutes)/(element.minutes-level.minutes)
                        console.log(progress);
                        return false;
                    } else {
                        return true;
                    }
                    
                })
                this.setState({level, totalMinutes, progress})
            }
        });
    }

    getGoalData(userKey) {
        const goalRef = database.ref('goals').orderByChild('userKey').equalTo(userKey);

        goalRef.on('value', (snapshot) => {
            let goals = [];
            snapshot.forEach(childSnapshot => {
                let goal = childSnapshot.val();
                goal.key = childSnapshot.key;

                goals.push(goal);
            })

            goals.reverse();

            this.setState({ goals })
        });
    }

    getDays(userKey) {
        let days = [];
        // this.userRef.child('sessions').orderByChild('realEnd').on('value', (snapshot) => {

        const sessionsRef = database.ref('sessions').orderByChild('userKey').equalTo(userKey);
        
        sessionsRef.on('value', (snapshot) => {
            let data = [];
            snapshot.forEach(childSnapshot => {
                let session = childSnapshot.val();
                session.key = childSnapshot.key;

                if (session.realEnd != null) {
                    data.push(session);
                }
            })
            data.sort((a, b) => {
                const endA = new Date(a.realEnd).toISOString();
                const endB = new Date(b.realEnd).toISOString();
                if (endA < endB) {
                    return -1;
                }
                if (endA > endB) {
                    return 1;
                }
                return 0;
            });

            let day = {key: null, date: null, time: 0, sessions: []}
            days = [];
            data.forEach(childSnapshot => {
                if (childSnapshot.timeLogged != null) {
                    const realEndDate = new Date(childSnapshot.realEnd);
                    const date = realEndDate.toDateString();

                    const time = childSnapshot.timeLogged;

                    let session = childSnapshot;
                    session.key = childSnapshot.key;

                    if (day.date == null) {
                        day.key = Math.random() * (1000 - 0);
                        day.date = date;
                        day.sessions.push(session);
                        day.time = time;
                    } else if (day.date == date) {
                        day.sessions.push(session);
                        day.time = day.time + time;
                    } else {
                        days.push(day);
                        day = {};
                        day.key = Math.random() * (1000 - 0);
                        day.date = date;
                        day.time = time;
                        day.sessions = [];
                        day.sessions.push(session);
                    }
                }
            });
            if (day.key != null) {
                days.push(day);
            }
            days.reverse();
            this.setState({days});
        });
    }

    _showOptions(goal) {
        this.alertToShow = <Options item={goal} closeAlert={() => this.closeAlert()} />;
        this.setState({ showAlert: true })
    }

    _openItem() {

    }

    closeAlert() {
        this.setState({ showAlert: false });
    }

    _renderGoal = ({ item }) => (
        <View style={{ padding: 10, alignItems: 'center' }}>
            <Bubble item={item}
                showOptions={() => this._showOptions(item)}
                openItem={() => this._openItem(item)} size={120} />
            <Text style={{ color: colors.subText, fontSize: 14 }}>{item.name}</Text>
        </View>
    );

    _renderDay = ({ item }) => (
        <View style={styles.dayStyle}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text>{item.sessions.length} sessions</Text>
            <Text>{formatMinutes((item.time))} hours total</Text>
        </View>
    );

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <Level level={this.state.level} progress={this.state.progress} />
                    <View style={styles.loggedBox}>
                        <Text style={{ color: colors.tigerOrange, fontWeight: 'bold', fontSize: 18, marginRight: 2 }}>
                            {formatMinutes(this.state.totalMinutes)}
                        </Text>
                        <Text style={{ color: colors.normalText, fontWeight: 'bold', fontSize: 18, marginLeft: 2 }}>Hours</Text>
                    </View>
                </View>
                {this.state.goals.length > 0 ?
                <View>
                    <FlatList
                        data={this.state.goals}
                        renderItem={this._renderGoal}
                        horizontal={true}
                        keyExtractor={item => item.key}
                        showsVerticalScrollIndicator={false}
                        style={[styles.flatList, {
                            height: 170
                        }]}
                        contentContainerStyle={{ justifyContent: 'center' }} />
                    <FlatList
                        data={this.state.days}
                        keyExtractor={item => item.key}
                        renderItem={this._renderDay}
                        showsVerticalScrollIndicator={false}
                        style={[styles.flatList, {maxHeight: Screen.height - 170 - 115}]}
                        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} />
                    </View>

                    : <NoHistory />}

                <Modal isVisible={this.state.showAlert}
                    onBackdropPress={() => this.setState({ showAlert: false })}
                    onBackButtonPress={() => this.setState({ showAlert: false })}
                    useNativeDriver={true}
                    style={{ justifyContent: 'flex-end' }}>
                    {this.alertToShow}
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    loggedBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.tigerOrange,
        borderRadius: 10,
        padding: 10
    },
    flatList: {
        alignSelf: 'center',
        width: Screen.width-30,
    },
    dateText: {
        fontSize: 18,
        color: colors.normalText,
        fontWeight: 'bold'
    },
    dayStyle: {
        width: Screen.width-30,
        height: 80
    }
});