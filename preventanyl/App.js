import React from 'react';
import { AppRegistry, AppState, Platform, View, StyleSheet } from 'react-native';

import { AppLoading } from 'expo';

import TabNavigation from './src/navigation/TabNavigation/TabNavigation';

import StatusBarBackground from './src/subcomponents/StatusBarBackground/StatusBarBackground';

export default class App extends React.Component {

    state = {
        isReady  : false,
        appState : AppState.currentState
    };

    static pauseFuncs  = [];
    static resumeFuncs = [];

    componentDidMount() {
      AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            App.resumeFuncs.map ( func => {
                func ();
            })
        } else {
            console.log('App has gone to the background!')
            App.pauseFuncs.map ( func => {
                func ();
            })
        }

        this.setState (
            { 
                appState: nextAppState
            }
        );
    }

    static addPauseFunction (func) {
        App.pauseFuncs.push (func);
    }

    static addResumeFunction (func) {
        App.resumeFuncs.push (func);
    }

    static emptyPauseFunctions () {
        App.pauseFuncs = [];
    }

    static emptyResumeFunctions () {
        App.resumeFuncs = [];
    }

    render() {
      if (this.state.isReady)
          return (
            <View style = { styles.container }>
                { Platform.OS === 'ios' && 
                  <StatusBarBackground style = { 
                    {
                      backgroundColor : '#3498db'
                    }
                  } />
                }
                <TabNavigation />
            </View>
          );
      else
        return (
            <AppLoading
                startAsync = { () => {} }
                onFinish = { () => {
                    this.setState (
                            {
                                isReady : true
                            }
                        )
                    }
                }
                onError = { (error) => {
                        console.warn (error)
                    }
                } />
        );
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
})

AppRegistry.registerComponent ('App', () => App);