import React, { Component } from 'react';
import {
    Animated,
    BackHandler,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Interactable from 'react-native-interactable';
import Icon from 'react-native-vector-icons/Ionicons';

import { auth, database } from '../firebase';
import { colors } from '../constants';
import Timeline from './Timeline';
import Team from './Team';
import History from './History';
import SessionTime from './SessionTime';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

const topBarHeight = Platform.OS === 'ios' ? 60 : 50;

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
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.playing) {
                return true;
            } else if(this.state.sessionPanel != null) {
                this.closeSession();
                return true;
            }

            return false;
        });

        this.setState({ sessionPanel: <SessionTime session={sesh} blackout={(black) => this.blackout(black)} /> });
        this.refs['sessionPanel'].snapTo({ index: 0 })
    }

    closeSession() {
        this.refs['sessionPanel'].snapTo({ index: 1 })
    }

    blackout(black) {
        if(!this.state.playing && black) {
            Animated.timing(this._animatedValue, {
                toValue: 100,
                duration: 1000
            }).start(this.setState({playing: true}));
            this.props.navigator.setStyle({
                statusBarHidden: true
            });
        } else {
            Animated.timing(this._animatedValue, {
                toValue: 0,
                duration: 2000
            }).start(this.setState({playing: false}));
            this.props.navigator.setStyle({
                statusBarHidden: false
            });
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
                        <View style={{ flexDirection: 'row', width: Screen.width, justifyContent: 'center', alignItems: 'flex-end' }}>
                            <View style={styles.iconContainer}>
                                {/* <Icon name='ios-search' size={20} color='white' style={{alignSelf: 'center'}} /> */}
                            </View>
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
                                    Circle
                            </Animated.Text>
                            </TouchableOpacity>
                            <View style={styles.iconContainer}>
                                {/* <Icon name='ios-settings' size={20} color='white' style={{alignSelf: 'center'}} /> */}
                            </View>
                        </View>
                    </Animated.View>
                    <Interactable.View
                        ref='tab'
                        horizontalOnly={true}
                        snapPoints={[{ x: 0 }, { x: -Screen.width }, { x: -Screen.width * 2 }]}
                        initialPosition={{ x: -Screen.width }}
                        boundaries={{right: 50, left: (-Screen.width * 2)-50, haptics: true}}
                        style={{ width: Screen.width * 3, flex: 1, flexDirection: 'row', elevation: 10 }}
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
                            // opacity: this._deltaX.interpolate({
                            //     inputRange: [-Screen.width * 2, -Screen.width, 0],
                            //     outputRange: [0.6, 0.6, 1]
                            // })
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
                            // opacity: this._deltaX.interpolate({
                            //     inputRange: [-Screen.width * 2, -Screen.width, 0],
                            //     outputRange: [0.6, 1, 0.6,]
                            // })
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
                            // opacity: this._deltaX.interpolate({
                            //     inputRange: [-Screen.width * 2, -Screen.width, 0],
                            //     outputRange: [1, 0.6, 0.6,]
                            // })
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
        height: topBarHeight,
        width: Screen.width,
        flexWrap: 'nowrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colors.tigerOrange
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    titleButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: (Screen.width-80)/3,
        // borderWidth: 1,
        // borderColor: 'black'
    },
    viewContainer: {
        width: Screen.width,
        height: Screen.height - topBarHeight,
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
        borderTopWidth: topBarHeight + 15,
    },
    panel: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: Screen.height + 500,
        width: Screen.width,
        elevation: 16,
        shadowOffset:{width: 0,  height: 0},
        shadowColor: 'black',
        shadowOpacity: 0.25,
        justifyContent: 'flex-start'
    },
    iconContainer: {
        width: 40, 
        height: Screen.height, 
        justifyContent: 'center', 
        alignItems: 'center'}
});