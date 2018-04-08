import React, { Component } from 'react';
import { AppRegistry, WebView } from 'react-native';

import Links from '../../utils/Links';

import WebPage from '../../subcomponents/WebPage/WebPage';

export default class SupportUsComponent extends Component {

    render () {

        return (
            <WebPage
                url = { Links.urls.PAYPAL_ME } />
        );

    }

}

AppRegistry.registerComponent ('SupportUsComponent', () => SupportUsComponent);