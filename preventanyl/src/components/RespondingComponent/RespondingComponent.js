import React, { Component } from 'react';
import { AppRegistry, WebView } from 'react-native';

import Links from '../../utils/Links';

import WebPageComponent from '../WebPageComponent/WebPageComponent';

export default class RespondingComponent extends Component {

    render () {

        return (
            <WebPageComponent
                url = { Links.urls.OVERDOSE_RESPONSE } />
        )
        
    }

}

AppRegistry.registerComponent ('RespondingComponent', () => RespondingComponent);