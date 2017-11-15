import React, { Component } from 'react';
import {
    Dimensions,
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

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class FocusBoost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.maxDuration/3600,
            startHour: 18,
            startMinute: 30,
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

    _valueChange(value) {
        this.setState({ value: value })
        // console.log(moment.duration(this.state.value, 'hours'));
    }

    _go() {
        const focusMinutes = Math.round(this.state.value*3600);
        this.props.enable(focusMinutes);
    }

    render() {
        return (
            <View style={[styles.alertBox]}>
                <View style={{ width: 250, marginVertical: 10 }}>
                    <Text style={styles.normalText}>Enable Focus Boost?</Text>
                    <Text style={styles.subText}>
                        During a Focus Boost period, for every minute you spend outside of Tiger Time, you will lose one minute of your recorded time.
                    </Text>
                    <Text style={styles.normalText}>{this.formatDuration(parseFloat(this.state.value).toFixed(3))}</Text>
                    <Slider minimumValue={0.0833333}
                        step={0.0833333}
                        maximumValue={this.props.maxDuration/3600}
                        thumbTintColor={colors.tigerOrange}
                        thumbStyle={{height: 20}}
                        minimumTrackTintColor={colors.tigerOrange}
                        maximumTrackTintColor={colors.subText}
                        value={this.state.value}
                        onValueChange={(value) => this._valueChange(value)} />
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={() => this._go()}>
                    <Text style={[styles.normalText, {color: 'white'}]}>Go</Text>
                </TouchableOpacity>
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
        alignSelf: 'center'
    },
    subText: { 
        alignSelf: 'center', 
        textAlign: 'center',
        marginBottom: 10, 
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