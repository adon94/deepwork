import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants';

export default class EmptyTimeline extends Component {
    constructor(props) {
        super(props);

        this.add = <Icon name='ios-add-outline' size={20} color={colors.normalText}/>;
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
                Tap {this.add} under the menu in the bottom right corner to schedule a session or tap {this.flash} to start one right away
                </Text>
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
    }
});