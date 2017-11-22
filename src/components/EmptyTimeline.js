import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants';

export default class EmptyTimeline extends Component {
    constructor(props) {
        super(props);

        this.add = <Icon name='ios-time-outline' size={20} color={colors.normalText}/>;
        this.flash = <Icon name='ios-flash-outline' size={20} color={colors.normalText}/>;
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 100 }}>
                <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                    <Icon name='ios-eye' size={50} color={colors.normalText} style={{ alignSelf: 'center', marginHorizontal: 1 }} />
                    <Icon name='ios-eye' size={50} color={colors.normalText} style={{ alignSelf: 'center', marginHorizontal: 1 }} />
                </View>
                <Text style={styles.noDataText}>Nothing to see here</Text>
                <Text style={styles.syncText}>
                Tap {this.add} in the bottom right corner to schedule a session or tap below to start one right away
                </Text>
                <TouchableOpacity onPress={() => this.props.flashPress()}
                    style={[styles.iconContainer]}>
                    <Text style={[styles.syncText, {textAlign: 'center', fontWeight: 'bold'}]}>
                    Start Now</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    noDataText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.normalText,
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: 10
    },
    syncText: {
        fontSize: 20,
        color: colors.normalText,
        alignSelf: 'center',
        textAlign: 'center',
    },
    iconContainer: {
        borderColor: colors.tigerOrange,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 60,
        height: 120,
        width: 120,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 30,
        padding: 4
    },
});