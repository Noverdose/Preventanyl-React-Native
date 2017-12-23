import React from 'react';
import { AppRegistry, Text, View, Image, StyleSheet} from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';

import MapComponent from './Components/MapComponent/MapComponent'
import ProfileComponent from './Components/ProfileComponent/ProfileComponent'
import RegisterComponent from './Components/RegisterComponent/RegisterComponent'

const RootNavigator = StackNavigator ({
    Map : {
        screen : MapComponent,
        navigationOptions : {
            drawer: () => ({
                label: 'Map',
            }),
        }
    },
    Profile : {
        screen : ProfileComponent,
        navigationOptions : {
            drawer: () => ({
                label: 'Profile',
            }),
        }
    },
    Register : {
        screen : RegisterComponent,
        navigationOptions : {
            drawer: () => ({
                label: 'Register',
            }),
        }
    }
});

export default class App extends React.Component {

  render() {
    return (
        <RootNavigator />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});

AppRegistry.registerComponent ('App', () => App);