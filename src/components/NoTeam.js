import React, { Component } from 'react';
import {
    Dimensions,
    Platform,
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

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class NoTeam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: deviceInfo.getUniqueID(),
            showAlert: false,
            alertToShow: <CircleAlert signup={true} authorize={(user) => this._signUp(user)} />
        }
    }

    _signInPress() {
        this.state.alertToShow = <CircleAlert signup={false} authorize={(user) => this._signIn(user)} />
        this.setState({showAlert:true});
    }

    _signIn(user) {
        auth.signInWithEmailAndPassword(user.email, user.password).then(() => {
            this.props.auth();
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });
        this.setState({ showAlert: false });
    }

    _signUpPress() {
        this.state.alertToShow = <CircleAlert signup={true} authorize={(user) => this._signUp(user)} />
        this.setState({ showAlert: true });
    }

    _signUp(user) {

        if (auth.currentUser != null) {
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, user.password);
            auth.currentUser.linkWithCredential(credential).then((fuser) => {
                userRef.child('displayName').set(user.displayName);
                userRef.child('email').set(user.email);
                this.props.auth();
              }, (error) => {
                console.log("Error upgrading anonymous account", error);
              });
        } else {
            auth.createUserWithEmailAndPassword(user.email, user.password).then((response) => {
                console.log(response)
                const userRef = database.ref('users').child(response.uid);
                userRef.child('displayName').set(user.displayName);
                userRef.child('email').set(user.email);
                this.props.auth();
            });
        }

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
                    <TouchableOpacity onPress={() => this._signInPress()} style={styles.actionButton}>
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
                        style={{ justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: Platform.OS === 'ios' ? Screen.height*0.28 : 0}}>
                        {this.state.alertToShow}
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