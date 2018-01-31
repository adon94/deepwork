import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Circle } from 'react-native-progress';
import Modal from 'react-native-modal';

import SelectGoal from './SelectGoal';
import { colors, formatSeconds } from '../constants';
import { database } from '../firebase';

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

export default class FocusPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goal: null,
      showAlert: false,
      timer: 0,
      playing: false,
    }
  }

  selectGoal(goal) {
    this.setState({ goal, showAlert: false });
  }

  startTimer() {
    this.setState({ playing: true, startedAt: new Date() })
    this.state.interval = setInterval(() => {
      let timer = (new Date() - this.state.startedAt) / 1000;
      this.setState({ timer })
    }, 1000);
  }

  stopTimer() {
    this.setState({ playing: false, timer: 0, })
    clearInterval(this.state.interval);
    this.saveToFirebase();
  }

  saveToFirebase() {
    const totalSeconds = Math.round((new Date() - this.state.startedAt) / 1000);
    const goalRef = database.ref('goals').child(this.state.goal.key);
    goalRef.child('totalSeconds').once('value', (snapshot) => {
      if (snapshot.val() == null) {
        goalRef.child('totalSeconds').set(totalSeconds)
      } else {
        const total = snapshot.val() + totalSeconds;
        goalRef.child('totalSeconds').set(total)
      }
    });
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Circle color={colors.tigerOrange}
          size={250}
          thickness={15}
          progress={1}
          borderWidth={0}
          strokeCap='round'
          style={{ marginVertical: 30 }} />

        <TouchableOpacity style={[styles.insideCircle]} onPress={() => this.setState({ showAlert: true })}>
          {this.state.goal == null ?
            <Text style={[styles.normalText, styles.touchableText]}>Select Goal</Text>
            :
            <Text style={[styles.normalText]}>{this.state.goal.title}</Text>}
        </TouchableOpacity>
        <Text style={[styles.normalText]}>{formatSeconds(this.state.timer)}</Text>
        {this.state.playing ?
          <TouchableOpacity style={[styles.startButton]} onPress={() => this.stopTimer()}>
            <Text style={[styles.normalText, styles.whiteText]}>Stop</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity disabled={this.state.goal == null} style={[styles.startButton]} onPress={() => this.startTimer()}>
            <Text style={[styles.normalText, styles.whiteText]}>Start</Text>
          </TouchableOpacity>}
        <Modal isVisible={this.state.showAlert}
          onBackdropPress={() => this.setState({ showAlert: false })}
          onBackButtonPress={() => this.setState({ showAlert: false })}
          useNativeDriver={true}>
          <SelectGoal selectGoal={(goal) => this.selectGoal(goal)} />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Screen.height,
    width: Screen.width,
    alignItems: 'center',
    padding: 15,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  insideCircle: {
    marginTop: 155,
    position: 'absolute',
  },
  normalText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.normalText,
  },
  touchableText: {
    color: colors.touchableText,
    alignSelf: 'center'
  },
  whiteText: {
    color: 'white',
    alignSelf: 'center'
  },
  startButton: {
    width: 250,
    height: 60,
    borderRadius: 10,
    backgroundColor: colors.tigerOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
});
