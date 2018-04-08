import React, { Component } from 'react';
import { AppRegistry, WebView } from 'react-native';

import Links from '../../utils/Links';

import WebPageComponent from '../WebPageComponent/WebPageComponent';

export default class SupportUsComponent extends Component {

    render () {

        return (
            <WebPageComponent
                url = { Links.urls.PAYPAL_ME } />
        );

    }

}

AppRegistry.registerComponent ('SupportUsComponent', () => SupportUsComponent);