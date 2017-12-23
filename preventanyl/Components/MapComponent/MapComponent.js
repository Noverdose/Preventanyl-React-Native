import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';

export default class MapComponent extends Component {

  render () {
    return (
      <View>
          <Text>Map Component</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent ('MapComponent', () => MapComponent);