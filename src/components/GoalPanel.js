import React, { Component } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Circle } from 'react-native-progress';
import Modal from 'react-native-modal';

import { colors, Screen, id, formatSeconds } from '../constants';
import { database } from '../firebase';
import Bubble from './Bubble';
import NewGoalModal from './NewGoalModal';

export default class GoalPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goals: [],
      showAlert: false,
      optionAlert: false,
      renameAlert: false,
      selectedGoal: null,
    }
  }

  componentDidMount() {
    this.getGoals();
  }

  _renderGoal = ({ item }) => (
    <TouchableOpacity onPress={() => this.openOptions(item)} style={{ padding: 10 }}>
      <Bubble item={item}>
        {!item.isAdd ?
          <Text style={[styles.normalText]}>{item.title}</Text>
          :
          <TouchableOpacity onPress={() => this.openAddGoal()} style={[styles.newGoal]}>
            <Text style={[styles.touchableText]}>New +</Text>
          </TouchableOpacity>}
        {item.totalSeconds ? <Text>{formatSeconds(item.totalSeconds)}</Text> : null}
      </Bubble>
    </TouchableOpacity>
  );

  openOptions(selectedGoal) {
    this.setState({ selectedGoal, optionAlert: true })
  }

  openAddGoal() {
    this.setState({ showAlert: true });
  }

  getGoals() {
    const goalRef = database.ref('goals').orderByChild('userId').equalTo(id);
    goalRef.on('value', (snapshot) => {
      let goals = [];
      snapshot.forEach(childSnapshot => {
        let goal = childSnapshot.val();
        goal.key = childSnapshot.key;
        goals.push(goal);
      });
      goals.push({ key: 0, isAdd: true });
      goals.reverse();
      this.setState({ goals })
    });
  }

  addGoal(goal) {
    const goalRef = database.ref('goals').push();
    goalRef.set(goal);
    this.setState({ showAlert: false })
  }

  deleteGoal() {
    const goalRef = database.ref('goals').child(this.state.selectedGoal.key);
    goalRef.remove();
    this.setState({ optionAlert: false, selectedGoal: null });
  }
  
  renameGoal(goal) {
    const goalRef = database.ref('goals').child(this.state.selectedGoal.key);
    goalRef.child('title').set(goal.title);
    this.setState({ renameAlert: false })
  }

  render() {

    return (
      <View style={[styles.container]}>
        <FlatList
          data={this.state.goals}
          renderItem={this._renderGoal}
          keyExtractor={item => item.key}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          contentContainerStyle={[{minHeight: Screen.height - 30}]} />
        <Modal isVisible={this.state.showAlert}
          onBackdropPress={() => this.setState({ showAlert: false })}
          onBackButtonPress={() => this.setState({ showAlert: false })}
          useNativeDriver={true}
          style={{ marginBottom: Screen.width * 0.45 }}>
          <NewGoalModal addGoal={(goal) => this.addGoal(goal)} />
        </Modal>
        <Modal isVisible={this.state.optionAlert}
          onBackdropPress={() => this.setState({ optionAlert: false })}
          onBackButtonPress={() => this.setState({ optionAlert: false })}
          useNativeDriver={true}>
          <View style={styles.optionAlert}>
            <TouchableOpacity onPress={() => this.setState({renameAlert: true})}>
              <Text style={styles.normalText}>Rename</Text>
            </TouchableOpacity>
            <View style={{ height: 1, width: Screen.width - 60, backgroundColor: colors.subText, opacity: 0.6, marginVertical: 15 }} />
            <TouchableOpacity onPress={() => this.deleteGoal()}>
              <Text style={[styles.normalText, { color: '#e74c3c' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        <Modal isVisible={this.state.renameAlert}
          onBackdropPress={() => this.setState({ renameAlert: false })}
          onBackButtonPress={() => this.setState({ renameAlert: false })}
          useNativeDriver={true}
          style={{ marginBottom: Screen.width * 0.45 }}>
          <NewGoalModal goal={this.state.selectedGoal} addGoal={(goal) => this.renameGoal(goal)} />
        </Modal>
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
  normalText: {
    color: colors.normalText,
    fontSize: 25,
    fontWeight: 'bold',
  },
  touchableText: {
    color: colors.touchableText,
    fontSize: 25,
    fontWeight: 'bold',
  },
  newGoal: {
    height: 135,
    width: 135,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionAlert: {
    position: 'absolute',
    width: Screen.width - 40,
    backgroundColor: 'white',
    elevation: 6,
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 15
  }
});
