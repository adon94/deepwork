import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';

import { colors } from '../constants';

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

export default class AnimatedTitle extends Component {

  render() {
    let changeable;

    if (this.props.position === 'start') {
      changeable = this.props._deltaX.interpolate({
        inputRange: [-Screen.width * 2, -Screen.width, 0],
        outputRange: [0.6, 0.6, 1]
      });
    } else if (this.props.position === 'middle') {
      changeable = this.props._deltaX.interpolate({
        inputRange: [-Screen.width * 2, -Screen.width, 0],
        outputRange: [0.6, 1, 0.6,]
      });
    } else {
      changeable = this.props._deltaX.interpolate({
        inputRange: [-Screen.width * 2, -Screen.width, 0],
        outputRange: [1, 0.6, 0.6,]
      });
    }

    return (
      <Animated.Text style={[styles.title, { transform: [{ scale: changeable }] }, { opacity: changeable }]}>
        {this.props.title}
      </Animated.Text>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: colors.behindText,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
});
