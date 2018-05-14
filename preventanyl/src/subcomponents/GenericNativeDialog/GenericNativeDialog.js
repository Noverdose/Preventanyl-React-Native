import React, { Component } from 'react';
import { AppRegistry, Platform, Text, View } from 'react-native';

import Dialog from "react-native-dialog";

const DIALOG_LEFT_BUTTON_TEXT = "CANCEL";

/*
    Declerations to use shorthand by removing . when using subcomponents
*/
const Button      = Dialog.Button;
const Container   = Dialog.Container;
const Description = Dialog.Description;
const Title       = Dialog.Title;

export default class GenericNativeDialog extends Component {

    constructor (props) {
        super (props);

        this.state = {
            dialogVisible : false
        }
    
    }

    show () {
        this.setState (
            {
                dialogVisible : true
            }
        )
    }

    dismiss () {
        this.setState (
            {
                dialogVisible : false
            }
        )
    }

    render () {

        return (
            <View>

                <Container visible = { this.state.dialogVisible } >
                    <Title>{ this.props.title }</Title>
                    <Description>
                        { this.props.message }
                    </Description>

                    <Button label = { DIALOG_LEFT_BUTTON_TEXT } onPress = { () => {
                            if (this.props.cancelFunction)
                                this.props.cancelFunction ()
                                
                            this.dismiss () 
                        }
                    } />
                     
                    <Button label = { this.props.actionButtonText } onPress = { () => this.props.actionFunction () }/>
                </Container>

              </View>
        );

    }

}

AppRegistry.registerComponent ('GenericNativeDialog', () => GenericNativeDialog);