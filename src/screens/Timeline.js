import React, { Component } from 'react';
import {
    Animated,
    BackHandler,
    Dimensions,
    Easing,
    Keyboard,
    FlatList,
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
import moment from 'moment';
import Modal from 'react-native-modal';

import { auth, database } from '../firebase';
import { colors } from '../constants';
import EmptyTimeline from '../components/EmptyTimeline';
import TigerAlert from '../components/TigerAlert';
import Bubble from '../components/Bubble';
import Options from '../components/Options';
import { getUserByDeviceID } from '../controllers/UserController';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class Timeline extends Component {
    constructor(props) {
        super(props);

        const id = deviceInfo.getUniqueID();

        let today = new Date().toDateString();
        today = today.slice(0, -4);

        this.state = {
            today,
            id,
            data: [],
            showAlert: false
        }

        this.alertToShow = <TigerAlert addSlot={(session) => this.addSlot(session)} />
        this.alertScale = new Animated.Value(0);
        this._deltaY = new Animated.Value(1);
        this._animatedValue = new Animated.Value(0);
        this.closed = true;
    }

    componentDidMount() {
        // const user = getUserByDeviceID();
        // console.log(user);
        auth.onAuthStateChanged((user) => {
            this.getTodaysData();
        });
    }

    getTodaysData() {
        if (auth.currentUser != null) {
            const userKey = auth.currentUser.uid;
            const today = new Date().toDateString();
            const seshRef = database.ref('sessions').orderByChild('date').equalTo(today+'_'+userKey);
            seshRef.on('value', (snapshot) => {
            // const userRef = database.ref('users/').child(this.state.id);
            // userRef.child('sessions').orderByChild('date').equalTo(today).on('value', (snapshot) => {
                let data = [];
                snapshot.forEach(childSnapshot => {
                    let session = childSnapshot.val();
                    session.key = childSnapshot.key;

                    data.push(session);
                })
                data.sort((a, b) => {
                    const startA = new Date(a.plannedStart).toLocaleTimeString();
                    const startB = new Date(b.plannedStart).toLocaleTimeString();

                    if (startA < startB) {
                        return -1;
                    }
                    if (startA > startB) {
                        return 1;
                    }

                    return 0;
                });
                this.setState({ data })
            });
        }
    }

    addSlot(session) {
        // const userRef = database.ref('users').child(this.state.id).child('sessions').push();
        // userRef.set(session);

        const seshRef = database.ref('sessions').push();
        seshRef.set(session);
        this.closeAlert();
    }

    closeAlert() {
        this.setState({ showAlert: false });
    }

    _renderSession = ({ item }) => (
        <Bubble key={item.key}
            item={item}
            showOptions={() => this._showSessionOptions(item)}
            openItem={() => this._openSession(item)}
            size={150} />
    );

    _renderSeparator = ({ item }) => (
        <View key={Math.random() * (1000 - 0)} style={{ width: 1, height: 20, backgroundColor: colors.tigerOrange, alignSelf: 'center' }} />
    );

    _renderFooter = ({ item }) => (
        <View>
            <View key={Math.random() * (1000 - 0)} style={{ width: 1, height: 20, backgroundColor: colors.tigerOrange, alignSelf: 'center' }} />
            <TouchableOpacity onPress={() => this._flashPress()}
            style={[styles.iconContainer, {height: 80, width: 80, borderRadius: 40, padding: 5}]}>
                <Text style={[{textAlign: 'center', fontWeight: 'bold', color: colors.normalText}]}>
                Start Now</Text>
            </TouchableOpacity>
        </View>
    );

    _showSessionOptions(session) {
        this.alertToShow = <Options item={session} closeAlert={() => this.closeAlert()} />;
        this.setState({ showAlert: true })
    }

    _addPress() {
        this.alertToShow = <TigerAlert addSlot={(session) => this.addSlot(session)} />;
        this._expandMenu();
        this.setState({ showAlert: true });
    }

    _flashPress() {
        const now = new Date();
        let userKey = null; 
        if (auth.currentUser != null) {
            userKey= auth.currentUser.uid
        }

        const session = {
            userKey,
            goalKey: userKey,
            date: now.toDateString()+'_'+userKey,
            plannedStart: now.toISOString(),
            plannedEnd: now.toISOString()
        }

        this._openSession(session);
        this._expandMenu();
    }

    _openSession(session) {
        this.props.openSession(session);
    }

    _expandMenu() {
        if (this.closed) {
            Animated.timing(this._animatedValue, {
                toValue: 100,
                duration: 100
            }).start();
        } else {
            Animated.timing(this._animatedValue, {
                toValue: 0,
                duration: 100
            }).start();
        }
        this.closed = !this.closed
    }

    render() {
        const moveAdd = this._animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: [0, -70],
            easing: Easing.linear
        });
        const moveFlash = this._animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: [0, -140]
        });
        const rotateMenu = this._animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: ['0deg', '180deg']
        });
        const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
        const AnimatedIcon = Animated.createAnimatedComponent(Icon);

        return (
            <View style={styles.container}>
                <View style={styles.topRow}>
                    <Text style={styles.dateText}>{this.state.today}</Text>
                </View>
                {this.state.data.length > 0 ?
                    <View style={{ flex: 1, padding: 15 }}>
                        <FlatList
                            data={this.state.data}
                            renderItem={this._renderSession}
                            keyExtractor={item => item.key}
                            showsVerticalScrollIndicator={false}
                            style={{ alignSelf: 'center', maxHeight: (this.state.data.length * 170) - 20 + 100, width: Screen.width }}
                            contentContainerStyle={{ alignItems: 'center' }}
                            ItemSeparatorComponent={this._renderSeparator}
                            ListFooterComponent={this._renderFooter} />
                    </View> :
                    <EmptyTimeline flashPress={() => this._flashPress()} />}
                <TouchableOpacity onPress={() => this._addPress()}
                    style={[styles.iconContainer, { position: 'absolute', alignSelf: 'flex-end', bottom: Platform.OS === 'ios'? 0:25, zIndex: 10 }]}>
                    <Icon name='ios-time-outline' size={35} color={colors.normalText} />
                </TouchableOpacity>

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
    dateText: {
        fontSize: 25,
        color: colors.normalText,
        fontWeight: 'bold'
    },
    iconContainer: {
        borderColor: colors.tigerOrange,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 30,
        height: 60,
        width: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    topButtonsContainer: {
        flexDirection: 'row',
        width: 110,
        justifyContent: 'flex-end'
    },
    alertBox: {
        position: 'absolute',
        width: Screen.width - 40,
        backgroundColor: 'white',
        elevation: 6,
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 15
    }
});