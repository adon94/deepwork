import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants';
import { Bar } from 'react-native-progress';

export default class Level extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <View style={styles.container}>
                    <View style={styles.levelContainer}>
                        <Text style={styles.levelText}>1</Text>
                    </View>
                    <View style={{ flexDirection: 'column', alignSelf: 'flex-end' }}>
                        <Text style={styles.rankText}>Zen Rookie</Text>
                        <Bar progress={this.props.progress} width={100} color={colors.tigerOrange} style={styles.bar} />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    levelContainer: {
        height: 35,
        width: 35,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.tigerOrange,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        zIndex: 5
    },
    levelText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: colors.normalText
    },
    bar: {
        left: -15
    },
    rankText: {
        fontWeight: 'bold',
        color: colors.normalText,
        marginLeft: 5,
        marginBottom: 2
    }
});