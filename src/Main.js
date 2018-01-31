import React, { Component } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Interactable from 'react-native-interactable';

import { colors, Screen } from './constants';
import AnimatedTitle from './components/AnimatedTitle';
import FocusPanel from './components/FocusPanel';
import GoalPanel from './components/GoalPanel';

const topBarHeight = Platform.OS === 'ios' ? 60 : 50;

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _deltaX: new Animated.Value(0)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.container]}>

          <Animated.View style={[styles.topBar]}>
            <TouchableOpacity style={styles.titleButton} onPress={() => this.refs['tab'].snapTo({ index: 0 })}>
              <AnimatedTitle _deltaX={this.state._deltaX} title="Goals" position="start" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.titleButton} onPress={() => this.refs['tab'].snapTo({ index: 1 })}>
              <AnimatedTitle _deltaX={this.state._deltaX} title="Focus" position="middle" />
            </TouchableOpacity>
          </Animated.View>

          <Interactable.View
            ref='tab'
            horizontalOnly={true}
            snapPoints={[{ x: 0 }, { x: -Screen.width }]}
            initialPosition={{ x: 0 }}
            boundaries={{ right: 50, left: (-Screen.width) - 50, haptics: true }}
            style={{ width: Screen.width * 2, flex: 1, flexDirection: 'row', elevation: 10 }}
            animatedValueX={this.state._deltaX}
            dragToss={0.1}>

            <Animated.View style={[styles.viewContainer, {
              transform: [{
                scale: this.state._deltaX.interpolate({
                  inputRange: [-Screen.width, 0],
                  outputRange: [0.95, 1]
                })
              }]
            }]}>
              <GoalPanel />
            </Animated.View>

            <Animated.View style={[styles.viewContainer, {
              transform: [{
                scale: this.state._deltaX.interpolate({
                  inputRange: [-Screen.width, 0],
                  outputRange: [1, 0.95]
                })
              }]
            }]}>
              <FocusPanel />
            </Animated.View>

          </Interactable.View>

        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.behindColor
  },
  topBar: {
    height: topBarHeight,
    width: Screen.width,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  titleButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: (Screen.width*0.6) / 2,
  },
  viewContainer: {
    width: Screen.width,
    height: Screen.height - topBarHeight,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'white',
    elevation: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 0.5,
  },
});