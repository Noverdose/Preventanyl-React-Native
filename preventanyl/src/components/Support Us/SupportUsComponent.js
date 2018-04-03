import React, { Component } from 'react';
import { AppRegistry, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import DismissKeyboard from 'dismissKeyboard';
import {WebView, Linking} from 'react-native';


export default class SupportUsComponent extends Component {

  render () {
      const uri = 'https://www.paypal.me/preventanylApp';

      return (
          <WebView
              ref={(ref) => { this.webview = ref; }}
              source={{ uri }}
              onNavigationStateChange={(event) => {
                  if (event.url !== uri) {
                      this.webview.stopLoading();
                      Linking.openURL(event.url);
                  }
              }}
          />
       // <View style = { styles.container } >
       //     <Text>SupportUsComponent</Text>
       // </View>
    );
  }

}

const styles = StyleSheet.create ({
  container : {
      flex : 1,
      backgroundColor : '#3498db'
  },
  title : {
    color : '#FFF',
    marginTop : 10,
    width : 160,
    textAlign : 'center',
    opacity : 0.9
  }
});

AppRegistry.registerComponent ('RegisterKitComponent', () => RegisterKitComponent);