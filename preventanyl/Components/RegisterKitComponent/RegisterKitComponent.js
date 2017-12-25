import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';

export default class RegisterKitComponent extends Component {

  render () {
    return (
      <View>
          <Text>Register Kit Component</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent ('RegisterKitComponent', () => RegisterKitComponent);