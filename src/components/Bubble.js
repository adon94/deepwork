import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, formatSeconds } from '../constants';
import moment from 'moment';
import Modal from 'react-native-modal';
import deviceInfo from 'react-native-device-info';
import { database } from '../firebase';

export default class Bubble extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.props.openItem()}
                    onLongPress={() => this.props.showOptions()}
                    style={[styles.container, {height: this.props.size, width: this.props.size}]}>
                    <Icon name={this.props.item.iconName != null ? this.props.item.iconName : 'ios-paw-outline'}
                        size={80}
                        color={colors.normalText} />
                    {this.props.item.seshName != null ? <Text style={styles.normalText}>
                        {this.props.item.seshName}
                    </Text> : null}
                    {this.props.item.plannedStart != null ? <Text style={styles.subText}>
                        {moment(this.props.item.plannedStart).format('HH:mm')}-{moment(this.props.item.plannedEnd).format('HH:mm')}
                    </Text> : null}
                    {this.props.item.totalMinutes != null ? <Text style={styles.subText}>
                        {formatSeconds(this.props.item.totalMinutes)}</Text> : null}
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.tigerOrange,
        borderRadius: 75,
        alignItems: 'center',
        justifyContent: 'center'
    },
    normalText: {
        color: colors.normalText
    },
    subText: {
        color: colors.subText
    }
});