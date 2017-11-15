import React, { Component } from 'react';
import {
    Alert,
    Animated,
    BackHandler,
    Dimensions,
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
import { database } from '../firebase';
import Interactable from 'react-native-interactable';
import { colors } from '../constants';
import NoTeam from '../components/NoTeam';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class Team extends Component {
    constructor(props) {
        super(props);

        const id = deviceInfo.getUniqueID();
    }

    componentWillMount() {
    }

    render() {
        return (
            <View style={styles.container}>
                <NoTeam />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});