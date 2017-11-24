import React, { Component } from 'react';
import {
    DatePickerIOS,
    Dimensions,
    Platform,
    StyleSheet,
    Slider,
    Text,
    TextInput,
    TouchableOpacity,
    TimePickerAndroid,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Modal from 'react-native-modal';

import { colors } from '../constants';
import GoalSelect from './GoalSelect';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class TigerAlert extends Component {
    constructor(props) {
        super(props);

        let now = moment();
        const remainder = 15 - now.minute() % 15;
        const rounded = moment(now).add(remainder, 'minutes');

        this.state = {
            date: new Date(),
            value: 1,
            startHour: rounded.hour(),
            startMinute: rounded.minute(),
            showAlert: false,
            goal: null,
            name: ''
        }
    }

    goalSelected(goal) {
        this.setState({ goal, showAlert: false});
    }

    formatDuration(hours) {
        let h = 0,
            m = 0;

        if (hours > 0.99) {
            h = Math.floor(hours);
            m = (hours - h) * 60;

            m = Math.round(m);

            if (h > 1 && m > 0) {
                return h + ' hours ' + m + ' minutes'
            } else if (h == 1 && m > 0) {
                return h + ' hour ' + m + ' minutes'
            } else if (h > 1 && m == 0) {
                return h + ' hours'
            } else if (h == 1 && m == 0) {
                return h + ' hour'
            }

        } else {
            m = hours * 60
            m = Math.round(m);

            return m + ' minutes'
        }
    }

    async _openTimePicker() {
        if (Platform.OS === 'android') {
            try {
                const { action, hour, minute } = await TimePickerAndroid.open({
                    hour: this.state.startHour,
                    minute: this.state.startMinute,
                    is24Hour: true, // Will display '14:00'
                });
                if (action !== TimePickerAndroid.dismissedAction) {
                    // Selected hour (0-23), minute (0-59)
                    this.setState({
                        startHour: hour,
                        startMinute: minute
                    })
                }
            } catch ({ code, message }) {
                console.warn('Cannot open time picker', message);
            }
        }
    }

    _valueChange(value) {
        this.setState({ value: value })
        // console.log(moment.duration(this.state.value, 'hours'));
    }


    _dateChange = (date) => {
        this.setState({
            date,
            startHour: date.getHours(),
            startMinute: date.getMinutes()
        })
    }

    _go() {
        let plannedStart = Platform.OS === 'android' ? new Date() : this.state.date;
        if (Platform.OS === 'android') {
            plannedStart.setHours(this.state.startHour);
            plannedStart.setMinutes(this.state.startMinute);
        }

        let plannedEnd = new Date(plannedStart);
        plannedEnd = moment(plannedEnd).add(this.state.value, 'h').toDate();
        let goalKey = null;
        let iconName = null;
        if (this.state.goal != null) {
            goalKey = this.state.goal.key;
            iconName = this.state.goal.iconName;
        }

        const session = {
            plannedStart,
            plannedEnd,
            goalKey,
            iconName,
            seshName: this.state.name,
            date: new Date().toDateString()
        }

        this.props.addSlot(session);
    }

    render() {
        return (
            <View style={[styles.alertBox]}>
                <View style={{ width: 250, marginVertical: 10 }}>
                    <Text style={styles.normalText}>
                        {this.state.value == 0 ? 'No set duration' : this.formatDuration(parseFloat(this.state.value).toFixed(3))}
                    </Text>
                    <Slider minimumValue={0}
                        step={0.0833333}
                        maximumValue={7}
                        thumbTintColor={colors.tigerOrange}
                        minimumTrackTintColor={colors.tigerOrange}
                        maximumTrackTintColor={colors.subText}
                        value={this.state.value}
                        onValueChange={(value) => this._valueChange(value)} />
                </View>
                <TouchableOpacity onPress={() => this._openTimePicker()}>
                    <Text style={styles.subText}>Starting at</Text>
                    {Platform.OS === 'ios' ? 
                    <DatePickerIOS
                        style={{width: Screen.width*.6}}
                        date={this.state.date}
                        mode="time"
                        onDateChange={(date) => this._dateChange(date)}
                        /> :
                    <Text style={styles.addText}>
                        {this.state.startHour > 9 ? this.state.startHour : '0' + this.state.startHour}:
                    {this.state.startMinute > 9 ? this.state.startMinute : '0' + this.state.startMinute}
                    </Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({showAlert: true})}>
                    <Text style={styles.subText}>Towards goal</Text>
                    <Text style={styles.addText}>{this.state.goal == null ? 'None' : this.state.goal.name}</Text>
                </TouchableOpacity>
                <Text style={styles.subText}>Session title</Text>
                <TextInput
                    ref='input'
                    style={[styles.addText, {width: 200, margin: 5}]}
                    underlineColorAndroid='transparent'
                    autoCapitalize='words'
                    placeholderTextColor={colors.tigerOrange}
                    placeholder='None'
                    maxLength={15}
                    value={this.state.name}
                    onChangeText={name => this.setState({name})}/>
                <TouchableOpacity style={styles.actionButton} onPress={() => this._go()}>
                    <Text style={[styles.normalText, {color: 'white'}]}>Ok</Text>
                </TouchableOpacity>
                <Modal isVisible={this.state.showAlert}
                    onBackdropPress={() => this.setState({ showAlert: false })}
                    onBackButtonPress={() => this.setState({ showAlert: false })}
                    useNativeDriver={true}
                    style={{ justifyContent: 'flex-end' }}>
                    <GoalSelect goalSelect={(goal) => this.goalSelected(goal)} />
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
        alignSelf: 'center',
        textAlign: 'center'
    },
    normalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.normalText,
        margin: 10,
        alignSelf: 'center',
        textAlign: 'center'
    },
    subText: { 
        alignSelf: 'center', 
        margin: 10, 
        color: colors.subText 
    },
    actionButton: {
        backgroundColor: colors.tigerOrange,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 10,
        width: 150
    }
});