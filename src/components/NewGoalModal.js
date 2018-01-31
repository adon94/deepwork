import React, { Component } from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import { colors, Screen, id } from '../constants';

export default class NewGoalModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: props.goal ? props.goal.title : '',
        }
    }

    _go() {
        const goal = {
            title: this.state.title,
            userId: id,
        }
        this.props.addGoal(goal);
    }

    render() {
        return (
            <View style={[styles.alertBox]}>
                <Text style={styles.subText}>Goal Name:</Text>
                <TextInput
                    ref='input'
                    style={[styles.addText, { width: 200, margin: 5 }]}
                    underlineColorAndroid='transparent'
                    autoCapitalize='words'
                    autoFocus={true}
                    placeholderTextColor={colors.tigerOrange}
                    placeholder=''
                    maxLength={15}
                    value={this.state.title}
                    onChangeText={title => this.setState({ title })} />
                <TouchableOpacity style={styles.actionButton} onPress={() => this._go()}>
                    <Text style={[styles.normalText, { color: 'white' }]}>Ok</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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