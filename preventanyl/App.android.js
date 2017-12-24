import React from 'react';
import { AppRegistry, Text, View, Image, StyleSheet, StatusBar } from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';

import createStore from './Redux'

// We're going to use navigation with redux
import ReduxNavigation from './Navigation/ReduxNavigation'

// create our store
const store = createStore()


export default class App extends React.Component {
  render() {
    return (
      <Provider store = { store }>
        <View style = { styles.container }>
          <StatusBar barStyle='light-content' />
          <ReduxNavigation />
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
})

AppRegistry.registerComponent ('App', () => App);