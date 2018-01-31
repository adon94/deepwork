import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TimePickerAndroid,
  View
} from 'react-native';
import moment from 'moment';
import Modal from 'react-native-modal';

import { colors, id, Screen } from '../constants';
import { database } from '../firebase';
import NewGoalModal from './NewGoalModal';

export default class SelectGoal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      goals: [],
      showAlert: false
    }
  }

  componentWillMount() {
    this.getGoals();
  }

  getGoals() {
    const goalRef = database.ref('goals').orderByChild('userId').equalTo(id);
    goalRef.once('value', (snapshot) => {
      let goals = [];
      snapshot.forEach(childSnapshot => {
        let goal = childSnapshot.val();
        goal.key = childSnapshot.key;
        goals.push(goal);
      });
      goals.reverse();
      this.setState({ goals })
    });
  }

  addGoal(goal) {
    const goalRef = database.ref('goals').push();
    goalRef.set(goal)

    this.setState({ showAlert: false })
    this.getGoals();
  }

  selectGoal(goal) {
    this.props.selectGoal(goal)
  }

  _renderGoals = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => this.selectGoal(item)}>
      <Text style={[styles.normalText, { marginHorizontal: 10 }]}>{item.title}</Text>
    </TouchableOpacity>
  );

  _renderHeader = () => (
    <View>
      <TouchableOpacity style={styles.item} onPress={() => this.setState({ showAlert: true })}>
        <Text style={[styles.normalText, { marginHorizontal: 10 }]}>New Goal +</Text>
      </TouchableOpacity>
      <View style={{ height: 1, width: Screen.width-80, backgroundColor: colors.subText, marginVertical: 15 }} />
    </View>
  );

  _renderSeparator = () => (
    <View style={{ height: 1, width: Screen.width-80, backgroundColor: colors.subText, marginVertical: 15 }} />
  );

  render() {
    return (
      <View style={[styles.alertBox]}>
        <Text style={[styles.normalText, { textAlign: 'center' }]}>Select a Goal</Text>
        <View style={{ height: 1, width: Screen.width - 40, backgroundColor: colors.subText, alignSelf: 'center', margin: 15 }} />
        <FlatList
          data={this.state.goals}
          extraData={this.state}
          renderItem={this._renderGoals}
          keyExtractor={item => item.key}
          ListHeaderComponent={this._renderHeader}
          ItemSeparatorComponent={this._renderSeparator}
          contentContainerStyle={{ justifyContent: 'flex-start' }}
          style={{ maxHeight: Screen.height - 150 }} />
        <Modal isVisible={this.state.showAlert}
          onBackdropPress={() => this.setState({ showAlert: false })}
          onBackButtonPress={() => this.setState({ showAlert: false })}
          useNativeDriver={true}
          style={{ marginBottom: Screen.width*0.45 }}>
          <NewGoalModal addGoal={(goal) => this.addGoal(goal)} />
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  alertBox: {
    position: 'absolute',
    width: Screen.width - 40,
    backgroundColor: 'white',
    elevation: 6,
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 15
  },
  addText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.tigerOrange,
    margin: 10,
    alignSelf: 'center'
  },
  normalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.normalText,
    alignSelf: 'center'
  },
  item: {
    width: Screen.width,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  iconContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center'
  }
});