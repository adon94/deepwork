import React, { Component } from 'react';
import {
    Alert,
    Animated,
    BackHandler,
    Dimensions,
    FlatList,
    Keyboard,
    ListView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import deviceInfo from 'react-native-device-info';
import { auth, database } from '../firebase';
import Interactable from 'react-native-interactable';
import { colors } from '../constants';
import NoTeam from '../components/NoTeam';
import firebase from 'react-native-firebase';
import Modal from 'react-native-modal';
import AddToCircle from '../components/AddToCircle';
import moment from 'moment';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class Team extends Component {
    constructor(props) {
        super(props);

        const id = deviceInfo.getUniqueID();

        this.state = {
            id,
            showAlert: false,
            user: null,
            friends: [],
            requested: [],
            pending: []
        }
    }

    componentWillMount() {
        // auth.signOut();
        this._checkUser();
        auth.onAuthStateChanged((user) => {
            this._checkUser();
        });
    }

    _checkUser() {
        const user = auth.currentUser
        if (user!=null) {
            this.setState({ user });
            this.getRelationships(user);
        } else {
            this.setState({ user: null })
        }
    }

    _addUser(user) {
        const relationship = {
            userA: this.state.user.email,
            userB: user.email,
            pending: user.email
        }
        console.log(user)

        const relationshipRef = database.ref('relationships').push();
        relationshipRef.set(relationship);

        this.setState({ showAlert: false })
    }

    getRelationships(user) {
        this.state.friends = [];
        this.state.requested = [];
        this.state.pending = [];

        let friendEmails = [];
        let friends = [];
        let pendingEmails = []; // user can accept them
        let requestedEmails = []; // user requested them
        const relationshipRef = database.ref('relationships');
        relationshipRef.orderByChild('userA').equalTo(user.email).once('value', (snapshot) => {
            snapshot.forEach(childSnapshot => {
                const friendEmail = { 
                    email: childSnapshot.val().userB,
                    key: childSnapshot.key
                };
                const pending = childSnapshot.val().pending;
                if (pending == null) {
                    friendEmails.push(friendEmail);
                } else if (pending == friendEmail) {
                    requestedEmails.push(friendEmail);
                } else {
                    pendingEmails.push(friendEmail);
                }
            });
            relationshipRef.orderByChild('userB').equalTo(user.email).once('value', (snapshot) => {
                snapshot.forEach(childSnapshot => {
                    const friendEmail = { 
                        email: childSnapshot.val().userA,
                        key: childSnapshot.key
                    };
                    const pending = childSnapshot.val().pending;
                    if (pending == null) {
                        friendEmails.push(friendEmail);
                    } else if (pending == friendEmail) {
                        requestedEmails.push(friendEmail);
                    } else {
                        pendingEmails.push(friendEmail);
                    }
                    this.getFriendsByEmails(friendEmails, this.state.friends);
                    this.getFriendsByEmails(requestedEmails, this.state.requested);
                    this.getFriendsByEmails(pendingEmails, this.state.pending);
                });
            })
        });
    }

    getFriendsByEmails(emails, arr) {
        let friends = [];
        emails.forEach(element => {
            console.log(element)
            const userRef = database.ref('users');
            userRef.orderByChild('email').equalTo(element.email).on('value', (snapshot) => { //just gets one user 
                snapshot.forEach(childSnapshot => {
                    let friend = childSnapshot.val();
                    friend.key = childSnapshot.key;
                    friend.relKey = element.key
                    console.log(friend)
                    // friends.push(friend);
                    this.updateUserInList(friend, arr);
                });
                this.setState(this.state)
            });
        });
    }

    updateUserInList(friend, arr) {
        if (arr.length > 0) {
            let found = false
            arr.forEach((element, index, array) => {
                if (element.key == friend.key) {
                    arr[index] = friend;
                    this.setState(this.state)
                    found = true
                }
            });
            if (!found) {
                arr.push(friend)
            }
        } else {
            arr.push(friend)
        }
    }

    acceptPendingRequest(user) {
        console.log(user)
        const relationshipRef = database.ref('relationships');
        relationshipRef.child(user.relKey).child('pending').set(null);
        this.getRelationships(this.state.user);
    }

    deleteRelationship(user) {
        const relationshipRef = database.ref('relationships');
        relationshipRef.child(user.relKey).remove();
        this.getRelationships(this.state.user);
    }

    renderFooter = () => (
        <TouchableOpacity style={styles.addUser} onPress={() => this.setState({ showAlert: true })}>
            <Icon name='ios-add-circle-outline' size={30} color={colors.normalText} />
            <Text style={[styles.normalText, { marginLeft: 10 }]}>Add</Text>
        </TouchableOpacity>
    )
    
    _renderUser = (item) => (
        <View key={item.item.key} style={[styles.listItem, {justifyContent: 'space-between'}]}>
            <Text style={[styles.normalText, { marginLeft: 10 }]}>
                {item.item.displayName}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {item.item.playing ? <Text style={[styles.normalText, {fontSize: 14}]}>
                    {moment(item.item.startedAt).format('HH:mm')}-
                    {item.item.duration > 0 ? moment(item.item.startedAt).add(item.item.duration, 'minutes').format('HH:mm') : null}
                    </Text>:null}
                <TouchableOpacity style={{
                    height: 40,
                    width: 40,
                    alignItems: 'center',
                    justifyContent: 'center'}} onPress={() => console.log(item)}>
                    <Icon name='ios-flash' color={item.item.playing ? colors.tigerOrange : 'green'} size={40} />
                </TouchableOpacity>
            </View>
        </View>
    )
    
    _renderPendingUser = (item) => (
        <View key={item.key} style={[styles.listItem, {justifyContent: 'space-between'}]} onPress={() => console.log(item)}>
            <Text style={[styles.normalText, { marginLeft: 10 }]}>
                {item.item.displayName}
            </Text>
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => this.acceptPendingRequest(item.item)}>
                    <Icon name='ios-checkmark-circle-outline' color='green' size={40} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.deleteRelationship(item.item)} style={{marginLeft:15}} >
                    <Icon name='ios-close-circle-outline' color='red' size={40}  />
                </TouchableOpacity>
            </View>
        </View>
    )
        
    _renderRequestedUser = (item) => (
        <View key={item.key} style={styles.listItem} onPress={() => console.log(item)}>
            <Text style={[styles.normalText, { marginLeft: 10 }]}>
                {item.item.displayName}
            </Text>
        </View>
    )

    _renderSeparator = () => (
        <View style={{width: Screen.width-30, height: 1, backgroundColor: colors.tigerOrange}} />
    )
    
    _renderPendingHeader = () => (
        <View style={styles.listItem}>
            <Text style={[styles.normalText, {fontWeight: 'bold'}]}>Pending</Text>
        </View>
    )
    
    _renderRequestedHeader = () => (
        <View style={styles.listItem}>
            <Text style={[styles.normalText, {fontWeight: 'bold'}]}>Requested</Text>
        </View>
    )
    
    _renderCircleHeader = () => (
        <View style={styles.listItem}>
            <Text style={[styles.normalText, {fontWeight: 'bold'}]}>Your Circle</Text>
        </View>
    )

    render() {
        return (
            <View style={styles.container}>
                {this.state.user == null || this.state.user.email == null ? <NoTeam auth={(user) => this._checkUser(user)} /> :
                    <View style={{ flex: 1 }}>
                        <Text style={styles.normalText}>Signed in as {this.state.user.email}</Text>
                        <View style={{ flex: 1, marginTop: 15 }}>
                        <FlatList data={this.state.friends}
                            keyExtractor={item => item.key}
                            renderItem={this._renderUser}
                            ListHeaderComponent={this._renderCircleHeader}
                            ListFooterComponent={this.renderFooter}
                            ItemSeparatorComponent={this._renderSeparator}                         
                            showsVerticalScrollIndicator={false}
                            style={[styles.flatList]}
                            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} />
                        {this.state.pending.length > 0 ? 
                        <FlatList data={this.state.pending}
                            keyExtractor={item => item.key}
                            renderItem={this._renderPendingUser}
                            ListHeaderComponent={this._renderPendingHeader}
                            showsVerticalScrollIndicator={false}
                            style={[styles.flatList]}
                            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} /> : null}
                        {this.state.requested.length > 0 ? 
                        <FlatList data={this.state.requested}
                            keyExtractor={item => item.key}
                            renderItem={this._renderRequestedUser}
                            ListHeaderComponent={this._renderRequestedHeader}
                            showsVerticalScrollIndicator={false}
                            style={[styles.flatList]}
                            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} /> : null}
                        </View>
                    </View>}
                <Modal isVisible={this.state.showAlert}
                    onBackdropPress={() => this.setState({ showAlert: false })}
                    onBackButtonPress={() => this.setState({ showAlert: false })}
                    useNativeDriver={true}
                    style={{ justifyContent: 'flex-end' }}>
                    <AddToCircle
                        cancel={() => this.setState({ showAlert: false })}
                        add={(user) => this._addUser(user)}
                        user={this.state.user} />
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    normalText: {
        fontSize: 20,
        color: colors.normalText,
    },
    addUser: {
        width: Screen.width - 30,
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 15,
        flexDirection: 'row',
        borderColor: colors.tigerOrange,
        borderWidth: 1,
        borderRadius: 15
    },
    listItem: {
        width: Screen.width - 30,
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 15,
        flexDirection: 'row',
    }
});