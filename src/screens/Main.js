import React, { Component } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Interactable from 'react-native-interactable';

import { database } from '../firebase';
import { colors } from '../constants';
import Timeline from './Timeline';
import Team from './Team';
import History from './History';
import SessionTime from './SessionTime';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class MainView extends Component {
    constructor(props) {
        super(props);

        this._deltaX = new Animated.Value(-Screen.width);
        this._deltaY = new Animated.Value(Screen.height);
        this._animatedValue = new Animated.Value(0);

        this.state = {
            sessionPanel: null,
            playing: false
        }
    }

    componentWillMount() {
    }

    _openSession(sesh) {
        this.setState({ sessionPanel: <SessionTime session={sesh} blackout={() => this.blackout()} navigator={this.props.navigator} /> });
        this.refs['sessionPanel'].snapTo({ index: 0 })
    }

    blackout() {
        if(!this.state.playing) {
            Animated.timing(this._animatedValue, {
                toValue: 100,
                duration: 1000
            }).start(this.setState({playing: true}));
        } else {
            Animated.timing(this._animatedValue, {
                toValue: 0,
                duration: 2000
            }).start(this.setState({playing: false}));
        }
    }

    onSessionSnap(event) {
        const { id } = event.nativeEvent;
        if (id === 'bottom') {
            this.state.sessionPanel = null;
        }
    }

    render() {
        let animatedColor = this._animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: ['rgba(255,255,255, 0)', 'rgba(0,0,0, 1)']
        });

        return (
            <View style={styles.container}>
                <Animated.View style={[styles.container, {transform: [{
                                        scale: this._deltaY.interpolate({
                                            inputRange: [ 0, Screen.height],
                                            outputRange: [0.97, 1]
                                        }),
                                    }]}]}>
                    <Animated.View style={[styles.topBar]}>
                        <View style={{ flexDirection: 'row', width: Screen.width, justifyContent: 'center' }}>
                            <TouchableOpacity style={styles.titleButton} onPress={() => this.refs['tab'].snapTo({ index: 0 })}>
                                <Animated.Text style={[styles.title, {
                                    transform: [{
                                        scale: this._deltaX.interpolate({
                                            inputRange: [-Screen.width * 2, -Screen.width, 0],
                                            outputRange: [0.6, 0.6, 1]
                                        }),
                                    }]
                                }, {
                                    opacity: this._deltaX.interpolate({
                                        inputRange: [-Screen.width * 2, -Screen.width, 0],
                                        outputRange: [0.6, 0.6, 1]
                                    })
                                }]}>
                                    Overview
                            </Animated.Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.titleButton} onPress={() => this.refs['tab'].snapTo({ index: 1 })}>
                                <Animated.Text style={[styles.title, {
                                    transform: [{
                                        scale: this._deltaX.interpolate({
                                            inputRange: [-Screen.width * 2, -Screen.width, 0],
                                            outputRange: [0.6, 1, 0.6]
                                        }),
                                    }]
                                }, {
                                    opacity: this._deltaX.interpolate({
                                        inputRange: [-Screen.width * 2, -Screen.width, 0],
                                        outputRange: [0.6, 1, 0.6,]
                                    })
                                }]}>
                                    Today
                                </Animated.Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.titleButton} onPress={() => this.refs['tab'].snapTo({ index: 2 })}>
                                <Animated.Text style={[styles.title, {
                                    transform: [{
                                        scale: this._deltaX.interpolate({
                                            inputRange: [-Screen.width * 2, -Screen.width, 0],
                                            outputRange: [1, 0.6, 0.6]
                                        }),
                                    }]
                                }, {
                                    opacity: this._deltaX.interpolate({
                                        inputRange: [-Screen.width * 2, -Screen.width, 0],
                                        outputRange: [1, 0.6, 0.6,]
                                    })
                                }]}>
                                    Team
                            </Animated.Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                    <Interactable.View
                        ref='tab'
                        horizontalOnly={true}
                        snapPoints={[{ x: 0 }, { x: -Screen.width }, { x: -Screen.width * 2 }]}
                        initialPosition={{ x: -Screen.width }}
                        style={{ width: Screen.width * 3, flex: 1, flexDirection: 'row',
        elevation: 10 }}
                        animatedValueX={this._deltaX}
                        dragToss={0.1}>
                        <Animated.View style={[styles.viewContainer, {
                            transform: [{
                                scale: this._deltaX.interpolate({
                                    inputRange: [-Screen.width * 2, -Screen.width, 0],
                                    outputRange: [0.95, 0.95, 1]
                                }),
                            }]
                        }, {
                            opacity: this._deltaX.interpolate({
                                inputRange: [-Screen.width * 2, -Screen.width, 0],
                                outputRange: [0.6, 0.6, 1]
                            })
                        }]}>
                            <History />
                        </Animated.View>
                        <Animated.View style={[styles.viewContainer, {
                            transform: [{
                                scale: this._deltaX.interpolate({
                                    inputRange: [-Screen.width * 2, -Screen.width, 0],
                                    outputRange: [0.95, 1, 0.95]
                                }),
                            }]
                        }, {
                            opacity: this._deltaX.interpolate({
                                inputRange: [-Screen.width * 2, -Screen.width, 0],
                                outputRange: [0.6, 1, 0.6,]
                            })
                        }]}>
                            <Timeline openSession={(session) => this._openSession(session)} />
                        </Animated.View>
                        <Animated.View style={[styles.viewContainer, {
                            transform: [{
                                scale: this._deltaX.interpolate({
                                    inputRange: [-Screen.width * 2, -Screen.width, 0],
                                    outputRange: [1, 0.95, 0.95]
                                }),
                            }]
                        }, {
                            opacity: this._deltaX.interpolate({
                                inputRange: [-Screen.width * 2, -Screen.width, 0],
                                outputRange: [1, 0.6, 0.6,]
                            })
                        }]}>
                            <Team />
                        </Animated.View>
                    </Interactable.View>
                </Animated.View>
                <Interactable.View
                    ref='sessionPanel'
                    verticalOnly={true}
                    snapPoints={[
                        { y: 0 },
                        { y: Screen.height, id: 'bottom' }]}
                    initialPosition={{ y: Screen.height }}
                    animatedValueY={this._deltaY}
                    onSnap={this.onSessionSnap.bind(this)}
                    dragEnabled={!this.state.playing}
                    style={[styles.panelContainer, {backgroundColor: animatedColor}]} >
                    <View style={styles.panel}>
                        {this.state.sessionPanel}
                    </View>
                </Interactable.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tigerOrange
    },
    topBar: {
        height: 50,
        width: Screen.width,
        flexWrap: 'nowrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colors.tigerOrange
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    titleButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: 110,
    },
    viewContainer: {
        width: Screen.width,
        height: Screen.height - 50,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: 'white',
        padding: 15,
    },
    panelContainer: {
        backgroundColor: 'rgba(29,29,29, 1)',
        alignSelf: 'flex-end',
        height: Screen.height + 500,
        width: Screen.width,
        position: 'absolute',
        marginLeft: 15,
        borderTopWidth: 65,
    },
    panel: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: Screen.height + 500,
        width: Screen.width,
        elevation: 16,
        justifyContent: 'flex-start'
    }
});