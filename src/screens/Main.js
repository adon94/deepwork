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

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class MainView extends Component {
    constructor(props) {
        super(props);

        const id = deviceInfo.getUniqueID();
    }

    componentWillMount() {
    }

    render() {
        return (
            <View style={styles.container}>
            <Interactable.View
                        ref='tab'
                        horizontalOnly={true}
                        snapPoints={[{ x: 0 }, { x: -Screen.width }, { x: -Screen.width*2 }]}
                        initialPosition={{ x: -Screen.width }}
                        style={{ width: Screen.width * 3, flex: 1, flexDirection: 'row' }}>
                        <View style={{width: Screen.width, height: Screen.height, backgroundColor: '#d35400'}}></View>
                        <View style={{width: Screen.width, height: Screen.height, backgroundColor: 'pink'}}></View>
                        <View style={{width: Screen.width, height: Screen.height, backgroundColor: 'blue'}}></View>
                </Interactable.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});