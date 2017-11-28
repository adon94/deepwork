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
import Modal from 'react-native-modal';
import { auth } from '../firebase';

import { colors } from '../constants';
import GoalSelect from './GoalSelect';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class CircleAlert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayName: 'Adam',
            email: 'adam@tigertime.io',
            password: 'password'
        }
    }

    _go() {
        const user = {
            displayName: this.state.displayName,
            email: this.state.email,
            password: this.state.password
        }

        this.props.authorize(user);
    }

    render() {
        return (
            <View style={[styles.alertBox]}>
                <Text style={styles.subText}>Display Name</Text>
                <TextInput
                    ref='input'
                    style={[styles.addText, { width: 200, margin: 5 }]}
                    underlineColorAndroid='transparent'
                    placeholderTextColor={colors.subText}
                    placeholder='Email'
                    autoCapitalize='none'
                    value={this.state.displayName}
                    onChangeText={displayName => this.setState({ displayName })} />
                <Text style={styles.subText}>Email</Text>
                <TextInput
                    ref='input'
                    style={[styles.addText, { width: 200, margin: 5 }]}
                    underlineColorAndroid='transparent'
                    placeholderTextColor={colors.subText}
                    placeholder='Email'
                    autoCapitalize='none'
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })} />
                <Text style={styles.subText}>Password</Text>
                <TextInput
                    ref='input'
                    style={[styles.addText, { width: 200, margin: 5 }]}
                    underlineColorAndroid='transparent'
                    placeholderTextColor={colors.subText}
                    placeholder='Password'
                    autoCapitalize='none'
                    secureTextEntry={true}
                    maxLength={15}
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })} />
                <TouchableOpacity style={styles.actionButton} onPress={() => this._go()}>
                    <Text style={[styles.normalText, { color: 'white' }]}>Sign up</Text>
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