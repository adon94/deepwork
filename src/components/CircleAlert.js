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
            displayName: '',
            email: '',
            password: ''
        }
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    _go() {
        const user = {
            displayName: this.state.displayName,
            email: this.state.email,
            password: this.state.password
        }
        if (this.props.signup) {
            if (user.displayName != null && user.email != null && user.password.length > 5 && this.validateEmail(user.email)) {
                this.props.authorize(user);
            } else if (user.email == null || user.email === '') {
                console.log('Email');
                this.setState({errorMessage: 'Email is required to sign up'});
            } else if (user.password.length < 6) {
                console.log('password');
                this.setState({errorMessage: 'Password must contain 6 characters'});
            } else if (!this.validateEmail(user.email)) {
                console.log('invalid email');
                this.setState({errorMessage: 'Invalid email supplied'});
            } else if (user.displayName == null) {
                console.log('displayName');
                this.setState({errorMessage: 'A display name is required'});
            }
        } else {
            if (user.email != null && user.password.length > 5 && this.validateEmail(user.email)) {
                this.props.authorize(user);
            } else if (user.email == null || user.email === '') {
                console.log('Email');
                this.setState({errorMessage: 'Email is required to login'});
            } else if (!this.validateEmail(user.email)) {
                console.log('invalid email');
                this.setState({errorMessage: 'Invalid email'});
            } else if (user.password.length < 6) {
                console.log('password');
                this.setState({errorMessage: 'Password is required to login'});
            }
        }
    }

    render() {
        return (
            <View style={[styles.alertBox]}>
                <Text style={styles.subText}>Email</Text>
                <TextInput
                    ref='input'
                    style={[styles.addText, { width: 200, margin: 5 }]}
                    underlineColorAndroid='transparent'
                    placeholderTextColor={colors.subText}
                    placeholder='-'
                    autoFocus={true}
                    autoCapitalize='none'
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })} />
                <Text style={styles.subText}>Password</Text>
                <TextInput
                    ref='input'
                    style={[styles.addText, { width: 200, margin: 5 }]}
                    underlineColorAndroid='transparent'
                    placeholderTextColor={colors.subText}
                    placeholder='-'
                    autoCapitalize='none'
                    secureTextEntry={true}
                    maxLength={15}
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })} />
                    {this.props.signup ? <View>
                        <Text style={styles.subText}>Display Name</Text>
                    <TextInput
                        ref='input'
                        style={[styles.addText, { width: 200, margin: 5 }]}
                        underlineColorAndroid='transparent'
                        placeholderTextColor={colors.subText}
                        placeholder='-'
                        autoCapitalize='none'
                        value={this.state.displayName}
                        onChangeText={displayName => this.setState({ displayName })} /></View> : null}
                        {this.state.errorMessage != null ? <Text style={{color: 'red'}}>{this.state.errorMessage}</Text> : null}
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