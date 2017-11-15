import React, { Component } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
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

export default class GoalCreate extends Component {
    constructor(props) {
        super(props);
        const id = deviceInfo.getUniqueID();

        this.state = {
            id,
            name: '',
            iconName: '',
            iconNames: [
                { name: 'ios-eye-outline', selected: true},
                { name: 'ios-briefcase-outline', selected: false},
                { name: 'ios-brush-outline', selected: false},
                { name: 'ios-cloudy-outline', selected: false},
                { name: 'ios-code-working', selected: false},
                { name: 'ios-flame-outline', selected: false},
                { name: 'ios-hammer-outline', selected: false},
                { name: 'ios-ice-cream-outline', selected: false},
                { name: 'ios-ionitron-outline', selected: false},
                { name: 'ios-jet-outline', selected: false},
                { name: 'ios-leaf-outline', selected: false},
                { name: 'ios-moon-outline', selected: false},
                { name: 'ios-nuclear-outline', selected: false},
                { name: 'ios-planet-outline', selected: false},
                { name: 'ios-rose-outline', selected: false},
                { name: 'ios-school-outline', selected: false},
                { name: 'ios-snow-outline', selected: false},
                { name: 'ios-umbrella-outline', selected: false},
                { name: 'logo-android', selected: false},
                { name: 'logo-angular', selected: false},
                { name: 'logo-apple', selected: false},
                { name: 'logo-buffer', selected: false},
                { name: 'logo-css3', selected: false},
                { name: 'logo-github', selected: false},
                { name: 'logo-html5', selected: false},
                { name: 'logo-nodejs', selected: false},
                { name: 'logo-python', selected: false},
                { name: 'logo-css3', selected: false}
            ],
            update: false
        }
    }

    addToGoal(item) {
        this.state.iconNames.forEach(element => {
            element.selected = false;
        })
        item.selected = !item.selected,
        this.setState({iconName: item.name});
        console.log(this.state.iconNames);
    }

    _renderIconAdd = ({item}) => (
        <TouchableOpacity style={styles.iconContainer} onPress={() => this.addToGoal(item)}>
            <Icon name={item.name} size={50} color={item.selected ? colors.tigerOrange : colors.normalText} />
        </TouchableOpacity>
    )

    _donePress() {
        const goal = {
            name: this.state.name,
            iconName: this.state.iconName
        }

        this.props.addGoal(goal);
    }

    render() {
        return (
            <View style={[styles.alertBox]}>
                <Text style={styles.normalText}>Pick an icon</Text>
                <FlatList
                    data={this.state.iconNames}
                    extraData={this.state}
                    renderItem={this._renderIconAdd}
                    keyExtractor={item => item.name}
                    numColumns={4}
                    style={{alignSelf: 'center', height: 320}}
                    contentContainerStyle={{justifyContent: 'center'}}/>
                    <View style={{margin: 15}}>
                    {/* <Text style={styles.normalText}>Enter a name</Text> */}
            <TextInput
                ref='input'
                style={styles.blockText}
                underlineColorAndroid='transparent'
                autoCapitalize='words'
                placeholder='Enter a name...'
                maxLength={15}
                value={this.state.name}
                onChangeText={name => this.setState({name})}
            />
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={() => this._donePress()}>
                <Text style={[styles.normalText, {color: 'white'}]}>Done</Text>
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
        alignSelf: 'center'
    },
    normalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.normalText,
        alignSelf: 'center'
    },
    item: {
        width: Screen.width,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 60,
        flexDirection: 'row'
    },
    blockText: {
        color: colors.normalText,
        fontSize: 18,
        textAlign: 'center',
        marginHorizontal: 5,
        width: 180
    },
    actionButton: {
        backgroundColor: colors.tigerOrange,
        borderRadius: 10,
        margin: 10,
        padding: 10,
        width: 150
    },
    iconContainer: {
        width:60,
        height:60,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center'
    }
});