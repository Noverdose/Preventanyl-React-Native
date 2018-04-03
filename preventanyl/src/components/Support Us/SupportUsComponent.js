import React, { Component } from 'react';
import { AppRegistry, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, WebView } from 'react-native';

import DismissKeyboard from 'dismissKeyboard';

import { openWebPage } from '../../utils/linkingUrls';

export default class SupportUsComponent extends Component {

    render () {
        const uri = 'https://www.paypal.me/preventanylApp';

        return (
            <WebView
                ref = { (ref) => 
                    { 
                        this.webview = ref; 
                    }
                }

                source = { 
                    {
                        uri 
                    }
                }

                onNavigationStateChange = { (event) => 
                    {
                        if (event.url !== uri) {
                            this.webview.stopLoading();
                            openWebPage (event.url);
                        }
                    }
                } />
        );
    }

}

AppRegistry.registerComponent ('SupportUsComponent', () => SupportUsComponent);