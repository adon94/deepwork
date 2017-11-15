import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants';

export default class NoHistory extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ flex: 1, marginTop: 80 }}>
                <Icon name='ios-analytics' size={50} color={colors.normalText} style={{ alignSelf: 'center', marginHorizontal: 1 }} />
                <Text style={styles.noDataText}>No data yet</Text>
                <Text style={styles.historyExplain}>Here you can see an overview of your previous Deep Work sessions and how they align with your goals</Text>
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
        marginVertical: 10
    },
    historyExplain: {
        fontSize: 20,
        color: colors.normalText,
        alignSelf: 'center',
        textAlign: 'center',
    }
});