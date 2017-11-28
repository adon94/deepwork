import React, { Component } from 'react';
import {
    Dimensions,
    FlatList,
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
import { database } from '../firebase';

import { colors } from '../constants';
import GoalSelect from './GoalSelect';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class AddToCircle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchVal: '',
            data: []
        }
    }

    _addUser(user) {
        this.props.add(user);
    }

    searchForUsers(searchVal) {
        const userRef = database.ref('users');
        
        userRef.once('value', (snapshot) => {
            let data = [];
            snapshot.forEach(childSnapshot => {
                if(childSnapshot.val().displayName.toLowerCase().includes(searchVal.toLowerCase())
                    && childSnapshot.val().email != this.props.user.email) {
                    let user = childSnapshot.val();
                    user.key = childSnapshot.key;
                    data.push(user)
                }
            }); 
            this.setState({data});
        });

        this.setState({searchVal})
    }

    _renderUser = ({ item }) => (
        <TouchableOpacity style={styles.userStyle} onPress={() => this._addUser(item)}>
            <Text style={styles.nameText}>{item.displayName}</Text>
            <Text>{item.email}</Text>
        </TouchableOpacity>
    );

    render() {
        return (
            <View style={[styles.alertBox]}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Icon name='ios-search-outline' size={30} color={colors.normalText} />
                    <TextInput
                        ref='input'
                        style={[styles.addText, { width: 200, margin: 5 }]}
                        underlineColorAndroid='transparent'
                        placeholderTextColor={colors.subText}
                        autoFocus={true}
                        placeholder='Search'
                        autoCapitalize='none'
                        value={this.state.searchVal}
                        onChangeText={searchVal => this.searchForUsers(searchVal)} />
                </View>
                <View style={{ 
                            flex: 1,
                            height: Platform.OS === 'ios' ? Screen.height * 0.5 : null }}>
                    <FlatList data={this.state.data}
                        keyExtractor={item => item.key}
                        renderItem={this._renderUser}
                        showsVerticalScrollIndicator={false}
                        style={[styles.flatList]}
                        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} />
                </View>
                <TouchableOpacity onPress={() => this.props.cancel()}>
                    <Text style={[styles.normalText, { color: colors.tigerOrange }]}>Cancel</Text>
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
        marginHorizontal: 20,
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
    },
    nameText: {
        fontSize: 18,
        color: colors.normalText,
        fontWeight: 'bold'
    },
    userStyle: {
        width: Screen.width-100,
        height: 80
    },
    flatList: {
        alignSelf: 'center',
        width: Screen.width-60,
    },
});