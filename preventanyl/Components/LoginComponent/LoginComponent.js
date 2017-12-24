import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';

export default class LoginComponent extends Component {

  async signup(email, pass) {
    try {
      await firebase.auth().
                createUsserWithEmailAndPassword (email, pass);

      console.log ("Account created");

      // Navigate to home page, user is auto logged in
    } catch (error) {
        console.log (error.toString ());
    }
  }

  async login (email, pass) {
      try {
        await firebase.auth().
                signInWithEmailAndPassword (email, pass);

        console.log ("Logged in");

        // Navigate to home page, after login
      } catch (error) {
          console.log (error.toString ());
      }
  }

  async logout () {
    try {
      await firebase.auth ().signOut();
      
      // Navigate to login component
    } catch (error) {
      console.log (error.toString ());
    }
  }

  render () {
    return (
      <View>
          <Text>Login Component</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent ('LoginComponent', () => LoginComponent);