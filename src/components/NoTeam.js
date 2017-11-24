import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants';
// import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import { auth } from '../firebase';

export default class NoTeam extends Component {
    constructor(props) {
        super(props);
    }

    _signIn() {
        auth.signInWithPhoneNumber('+353866692603')
        .then(confirmResult => {
            console.log(confirmResult)
        })// save confirm result to use with the manual verification code)
        .catch(error => console.log(error));
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 140 }}>
                <Icon name='ios-people' size={50} color={colors.normalText} style={{ alignSelf: 'center', marginHorizontal: 1 }} />
                <Text style={styles.teamExplain}>Add your friends and colleagues to your Circle to decrease interruptions and synchronize your Deep Work</Text>
                <View style={styles.actionButtonsContainer}>
                    {/* <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>Create a team</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>Join a team</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => this._signIn()} style={styles.actionButton}>
                        <Text style={styles.actionText}>Sign in</Text>
                    </TouchableOpacity>
                    {/* <GoogleSigninButton
                        style={{width: 48, height: 48}}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Light}
                        onPress={() => this._signIn()}/> */}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    actionText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.normalText,
        alignSelf: 'center'
    },
    actionButton: {
        borderWidth: 1,
        borderColor: colors.tigerOrange,
        borderRadius: 10,
        padding: 10,
        margin: 10
    },
    teamExplain: {
        fontSize: 20,
        color: colors.normalText,
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: 10
    },
    actionButtonsContainer: {
        marginHorizontal: 20,
        marginVertical: 10
    }
});