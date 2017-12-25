import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';

export default class LoginComponent extends Component {

  render () {
    return (
      <View>
          <Text>Login Component</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent ('LoginComponent', () => LoginComponent);