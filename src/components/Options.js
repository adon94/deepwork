import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    Slider,
    Text,
    TouchableOpacity,
    TimePickerAndroid,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import deviceInfo from 'react-native-device-info';

import { colors } from '../constants';
import { database } from '../firebase';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class Options extends Component {
    constructor(props) {
        super(props);
        const id = deviceInfo.getUniqueID();

        this.state = {
            id
        }
    }

    deleteItem() {
        let itemRef = database.ref('users').child(this.state.id);
        if (this.props.item.date != null) {
            itemRef.child('sessions').child(this.props.item.key).remove();
        } else {
            itemRef.child('goals').child(this.props.item.key).remove();
        }
        this.props.closeAlert();
    }

    render() {
        return (
            <View style={[styles.alertBox]}>
                {/* <TouchableOpacity style={{width: Screen.width, alignItems: 'center'}}>
                    <Text style={styles.normalText}>Edit</Text>
                </TouchableOpacity> */}
                {/* <View style={{height: 1, width: Screen.width-50, backgroundColor: colors.subText, margin: 15}} /> */}
                <TouchableOpacity onPress={() => this.deleteItem()} style={{width: Screen.width, alignItems: 'center'}}>
                    <Text style={styles.normalText}>Delete</Text>
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
        alignSelf: 'center'
    },
    normalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.normalText,
        alignSelf: 'center'
    }
});