import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';

import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';

export default class GenericPopupDialog extends Component {

    constructor (props) {
        super (props);
    }

    show () {
        this.popupDialog.show ();
    }

    render () {
        return (
            <PopupDialog
                dialogTitle = { <DialogTitle title = { this.props.title } /> }
                ref = { (popupDialog) => { this.popupDialog = popupDialog; }} 
                width = { 0.5 }
                height = { 0.5 } >
                <View>
                    <Text>{ this.props.message }</Text>
                </View>
            </PopupDialog>
        );
    }

}

AppRegistry.registerComponent ('GenericPopupDialog', () => GenericPopupDialog);