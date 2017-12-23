import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Text, View, Image, StyleSheet } from 'react-native';

import MapComponent from '../../Components/MapComponent/MapComponent'
import ProfileComponent from '../../Components/ProfileComponent/ProfileComponent'
import RegisterComponent from '../../Components/RegisterComponent/RegisterComponent'

const TabNavigation = TabNavigator ({
  Map : {
    screen : MapComponent,
    navigationOptions : {
      tabBarLabel : 'Home',
      tabBarIcon  : ({ tintColor }) => (
        <Image 
          source = { require ('../../assets/map.imageset/map.png') }
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
          source = { require ('../../assets/profile.imageset/user_male.png') }
          style  = { [styles.icon, { tintColor : tintColor }]}
        />
      )
    },
  },
  Register : {
    screen : RegisterComponent,
    navigationOptions : {
      tabBarLabel : 'Register',
      tabBarIcon  : (
        { 
          tintColor 
        }
        ) => (
        <Image 
          source = { require ('../../assets/address-book.imageset/address_book.png') }
          style  = { [styles.icon, { tintColor : tintColor }]}
        />
      )
    },
  }
}, {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
});

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});

export default TabNavigation;