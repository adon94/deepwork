import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { colors } from '../constants';

export default class Bubble extends Component {

    render() {
        return (
            <View style={[styles.container]}>
              {this.props.children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 8,
        borderColor: colors.tigerOrange,
        borderRadius: 75,
        height: 150,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
});