import React from 'react';
import { AppRegistry } from 'react-native';
import { TabNavigator } from 'react-navigation';

import TabNavigation from './Navigation/TabNavigation/TabNavigation';

export default class App extends React.Component {
  render() {
    return (
      <TabNavigation />
    );
  }
}

AppRegistry.registerComponent ('App', () => App);