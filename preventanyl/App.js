import React from 'react';
import { AppRegistry, Text, View, Image, StyleSheet} from 'react-native';
import { TabNavigator } from 'react-navigation';

import MapComponent from './Components/MapComponent/MapComponent'
import ProfileComponent from './Components/ProfileComponent/ProfileComponent'
import RegisterComponent from './Components/RegisterComponent/RegisterComponent'

const RootNavigator = TabNavigator ({
  Map : {
    screen : MapComponent,
    navigationOptions : {
      tabBarLabel : 'Home',
      tabBarIcon  : ({ tintColor }) => (
        <Image 
          source = { require ('./assets/map.imageset/map.png') }
          style  = { [styles.icon, { tintColor : tintColor }]}
        />
      )
    },
  },
  Profile : {
    screen : ProfileComponent,
    navigationOptions : {
      tabBarLabel : 'Profile',
      tabBarIcon  : ({ tintColor }) => (
        <Image 
          source = { require ('./assets/profile.imageset/user_male.png') }
          style  = { [styles.icon, { tintColor : tintColor }]}
        />
      )
    },
  },
  Register : {
    screen : RegisterComponent,
    navigationOptions : {
      tabBarLabel : 'Register',
      tabBarIcon  : ({ tintColor }) => (
        <Image 
          source = { require ('./assets/address-book.imageset/address_book.png') }
          style  = { [styles.icon, { tintColor : tintColor }]}
        />
      )
    },
  }
}, {
  tabBarPosition: 'top',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
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