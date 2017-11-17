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
import { colors, formatSeconds } from '../constants';
import { database } from '../firebase';
import NoHistory from '../components/NoHistory';
import Bubble from '../components/Bubble';
import Options from '../components/Options';

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
            showAlert: false
        }
        this.alertToShow = <Options />;
    }

    componentWillMount() {
        this.getGoalData();
    }

    getGoalData() {
        const userRef = database.ref('users/').child(this.state.id);

        userRef.child('goals').on('value', (snapshot) => {

            let goals = [];
            let totalMinutes = 0
            snapshot.forEach(childSnapshot => {
                let goal = childSnapshot.val();
                goal.key = childSnapshot.key;
                if (childSnapshot.val().totalMinutes != null) {
                    totalMinutes = childSnapshot.val().totalMinutes + totalMinutes
                }

                goals.push(goal);
            })

            goals.reverse();

            this.setState({ goals, totalMinutes })
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

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                    {/* <Level progress={0} /> */}
                    <View style={styles.loggedBox}>
                        <Text style={{ color: colors.tigerOrange, fontWeight: 'bold', fontSize: 18, marginRight: 2 }}>
                            {formatSeconds(this.state.totalMinutes)}
                        </Text>
                        <Text style={{ color: colors.normalText, fontWeight: 'bold', fontSize: 18, marginLeft: 2 }}>Hours</Text>
                    </View>
                </View>
                {this.state.goals.length > 0 ?
                    <FlatList
                        data={this.state.goals}
                        renderItem={this._renderGoal}
                        numColumns={2}
                        keyExtractor={item => item.key}
                        showsVerticalScrollIndicator={false}
                        style={[styles.flatList, {
                            maxHeight: this.state.goals.length < 7 ? 159 * Math.round(this.state.goals.length/2) : 159 * 3
                        }]}
                        contentContainerStyle={{ justifyContent: 'center' }} />
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
    }
});