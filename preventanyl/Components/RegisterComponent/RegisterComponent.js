import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';

export default class RegisterComponent extends Component {

  render () {
    return (
      <View>
          <Text>Register Component</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent ('RegisterComponent', () => RegisterComponent);