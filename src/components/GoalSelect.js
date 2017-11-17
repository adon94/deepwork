import React, { Component } from 'react';
import {
    Dimensions,
    FlatList,
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
import Modal from 'react-native-modal';

import { colors } from '../constants';
import { database } from '../firebase';
import GoalCreate from './GoalCreate';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class GoalSelect extends Component {
    constructor(props) {
        super(props);
        const id = deviceInfo.getUniqueID();

        this.state = {
            id,
            goals: [],
            showAlert: false
        }
    }

    componentWillMount() {
        this.getGoals();
    }

    getGoals() {
        const userRef = database.ref('users/').child(this.state.id);
        
        userRef.child('goals').on('value', (snapshot) => {

            let goals = [];
            snapshot.forEach(childSnapshot => {
                let goal = childSnapshot.val();
                goal.key = childSnapshot.key;

                goals.push(goal);
            })

            this.setState({ goals })
        });
    }

    addGoal(goal) {
        const userRef = database.ref('users/').child(this.state.id).child('goals').push();
        userRef.set(goal);

        this.setState({showAlert: false})
    }

    selectGoal(goal) {
        this.props.goalSelect(goal)
    }

    _renderGoals = ({item}) => (
        <TouchableOpacity style={styles.item} onPress={() => this.selectGoal(item)}>
            <View style={styles.iconContainer}>
                <Icon name={item.iconName} size={50} color={colors.normalText} style={{marginHorizontal: 10}} />
            </View>
            <Text style={[styles.normalText, {marginHorizontal: 10}]}>{item.name}</Text>
        </TouchableOpacity>
    );

    _renderHeader = () => (
        <View>
        <TouchableOpacity style={styles.item} onPress={() => this.setState({showAlert: true})}>
            <View style={styles.iconContainer}>
                <Icon name='ios-add-circle-outline' size={50} color={colors.normalText} style={{marginHorizontal: 10}} />
            </View>
            <Text style={[styles.normalText, {marginHorizontal: 10}]}>New Goal</Text>
        </TouchableOpacity>
        <View style={{height: 1, width: Screen.width, backgroundColor: colors.subText, alignSelf: 'center', margin: 15}} />
        <TouchableOpacity style={styles.item} onPress={() => this.selectGoal(null)}>
            <View style={styles.iconContainer}>
                <Icon name={colors.noGoalIcon} size={50} color={colors.normalText} style={{marginHorizontal: 10}} />
            </View>
            <Text style={[styles.normalText, {marginHorizontal: 10}]}>None</Text>
        </TouchableOpacity>
        <View style={{height: 1, width: Screen.width, backgroundColor: colors.subText, alignSelf: 'center', margin: 15}} />
        </View>
    )

    _renderSeparator = () => (
        <View style={{height: 1, width: Screen.width-50, backgroundColor: colors.subText, margin: 15}} />
    )

    render() {
        return (
            <View style={[styles.alertBox]}>
                <FlatList
                    data={this.state.goals}
                    extraData={this.state}
                    renderItem={this._renderGoals}
                    keyExtractor={item => item.key}
                    ListHeaderComponent={this._renderHeader}
                    ItemSeparatorComponent={this._renderSeparator}
                    contentContainerStyle={{justifyContent: 'flex-start'}}
                    style={{maxHeight: Screen.height-150}}/>
                <Modal isVisible={this.state.showAlert}
                    onBackdropPress={() => this.setState({ showAlert: false })}
                    onBackButtonPress={() => this.setState({ showAlert: false })}
                    useNativeDriver={true}
                    style={{ justifyContent: 'flex-end' }}>
                    <GoalCreate addGoal={(goal) => this.addGoal(goal)} />
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    alertBox: {
        position: 'absolute',
        width: Screen.width-40,
        backgroundColor: 'white',
        elevation: 6,
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 15
    },
    addText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.tigerOrange,
        margin: 10,
        alignSelf: 'center'
    },
    normalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.normalText,
        alignSelf: 'center'
    },
    item: {
        width: Screen.width, 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        flexDirection: 'row'
    }, 
    iconContainer: {
        width: 70, 
        height: 70, 
        justifyContent: 'center'
    }
});