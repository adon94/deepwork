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
import { auth, database } from '../firebase';
import Modal from 'react-native-modal';
import CircleAlert from './CircleAlert';
import firebase from 'react-native-firebase';
import deviceInfo from 'react-native-device-info';

export default class NoTeam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: deviceInfo.getUniqueID(),
            showAlert: false
        }
    }

    _signIn() {
        auth.signInWithEmailAndPassword('adam@tigertime.io', 'password').then(() => {
            this.props.auth();
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
        });
    }

    _signUpPress() {
        this.setState({ showAlert: true });
    }

    _signUp(user) {
        const userRef = database.ref('users').child(auth.currentUser.uid);
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, user.password);
        auth.currentUser.linkWithCredential(credential).then((fuser) => {
            userRef.child('displayName').set(user.displayName);
            userRef.child('email').set(user.email);
            this.props.auth();
          }, (error) => {
            console.log("Error upgrading anonymous account", error);
          });

        // auth.createUserWithEmailAndPassword(user.email, user.password)//.then(() => {
            //none of the below is happening. not sure why
            // this.props.auth(user);
            // console.log("Did stuff")
            // const actionCodeSettings = {
            //     url: 'https://www.deepwork-648e0.firebaseapp.com' + auth.currentUser.email,
            //     iOS: {
            //         bundleId: 'org.reactjs.native.example.deepwork'
            //     },
            //     android: {
            //         packageName: 'com.deepwork',
            //         installApp: true,
            //         minimumVersion: '12'
            //     },
            //     handleCodeInApp: true
            // };
            // auth.currentUser.sendEmailVerification(actionCodeSettings)
            //     .catch((error) => {
            //         // Error occurred. Inspect error.code.
            //         console.log(error)
            //     });

        //})
        // .catch(error => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        // });

        // console.log(cred);
        this.setState({ showAlert: false });
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
                        <Text style={styles.actionText}>Log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._signUpPress()} style={styles.actionButton}>
                        <Text style={styles.actionText}>Sign up</Text>
                    </TouchableOpacity>
                    {/* <View style={styles.actionButton}>
                        <Text style={styles.actionText}>Coming soon</Text>
                    </View> */}

                    <Modal isVisible={this.state.showAlert}
                        onBackdropPress={() => this.setState({ showAlert: false })}
                        onBackButtonPress={() => this.setState({ showAlert: false })}
                        useNativeDriver={true}
                        style={{ justifyContent: 'flex-end' }}>
                        <CircleAlert authorize={(user) => this._signUp(user)} />
                    </Modal>
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