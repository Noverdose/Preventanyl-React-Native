import React, { Component } from 'react';
import { AppRegistry, Button, Text, View } from 'react-native';

import PopupDialog from 'react-native-popup-dialog';

export default class RegisterKitComponent extends Component {

  constructor () {
    super ();
    this.state = {
      alertText : "ABC"
    }
  }

  render () {
    return (
      <View>
        <Button
          title="Show Dialog"
          onPress={() => {
            this.popupDialog.show();
          }} />
        <PopupDialog
          ref={(popupDialog) => { this.popupDialog = popupDialog; }}
        >
      <View>
        <Text>{ this.state.alertText }</Text>
        <Button
          title="Change text"
          onPress={() => {
            this.setState ({
              alertText : "123"
            })
          }} />
      </View>
      </PopupDialog>
          <Text>Register Kit Component</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent ('RegisterKitComponent', () => RegisterKitComponent);