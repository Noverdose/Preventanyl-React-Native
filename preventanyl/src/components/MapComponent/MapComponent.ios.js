import React, { Component } from 'react';
import { AppRegistry, Text, View, Button, TouchableOpacity, Alert, AlertIOS, StyleSheet, Linking, Image } from 'react-native';

import MapView, { AnimatedRegion, Animated } from 'react-native-maps';
import Timestamp from 'react-timestamp';
import PopupDialog from 'react-native-popup-dialog';
import * as firebase from 'firebase';

import Database from '../../database/Database'
import { getCurrentLocation } from '../../utils/location';

export default class MapComponent extends Component {

    constructor () {
        super ();

        this.getInitialView ();

        this.state = {
            region : this.getInitialState (),
            staticKits : [],
            overdoses : [],
            userLocation : {
                latlng : {
                    latitude  : null,
                    longitude : null,
                },
                error : null,
            },
            userLoaded    : false,
            initialView   : false,
            isLoading     : false,
            notifyTitle   : 'notififying in 5 seconds',
            notifySeconds : 5,
            notifyTimer   : null
        }

        this.findMe = this.findMe.bind (this);
        this.helpMe = this.helpMe.bind (this);
        this.getInitialView = this.getInitialView.bind(this);
    }

    getInitialView () {

        firebase.auth ().onAuthStateChanged ( (user) => {
            let initialView = user ? "Home" : "Login";

            this.setState ({
                userLoaded  : true,
                initialView : initialView
            })
        })

    }

    componentDidMount () {
        this.watchId = navigator.geolocation.watchPosition (
            (position) => {
                console.log (position)
;                this.setState ({
                    userLocation : {
                        latlng : {
                            latitude  : position.coords.latitude,
                            longitude : position.coords.longitude,
                        },
                        error     : null,
                    }
                });
            },
            (error) => this.setState ( {
                error : error.message
            }),
            { 
                enableHighAccuracy : true,
                timeout : 20000,
                maximumAge : 1000,
                distanceFilter : 10
            }
        );

        Database.listenForItems (Database.staticKitsRef, (kits) => {
            let staticKits = [];
            for (let kit of kits) {
                staticKits.push ({
                    title : kit.displayName,
                    description : kit.comments,
                    latlng : {
                        latitude : kit.coordinates.lat,
                        longitude : kit.coordinates.long,
                    },
                    id : kit.id,
                    key : kit.id
                })
            }
            
            this.setState ({
                staticKits : staticKits
            });
        });

        Database.listenForItems (Database.overdosesRef, (items) => {
            let overdoses = [];
            for (let overdose of items) {
                overdoses.push ({
                    date : overdose.date,
                    id   : overdose.id,
                    key  : overdose.id,
                    latlng : {
                        latitude  : overdose.latitude,
                        longitude : overdose.longitude
                    },
                    region    : overdose.region,
                    timestamp : overdose.timestamp,
                });

                this.setState ({
                    overdoses : overdoses
                })
            }
        });

    }

    componentWillUnmount () {
        navigator.geolocation.clearWatch (this.watchId);
    }

    getInitialState() {
        return {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
      }

    helpMe () {

        if (this.state.notifyTimer != null) {
            clearInterval (this.state.notifyTimer);
        }

        this.setState ({
            notifySeconds : 5
        })

        this.popupDialog.show();

        let notifyTimer = setInterval (() => {
            if (this.state.notifySeconds > 0)
                this.setState ({
                    notifySeconds : this.state.notifySeconds - 1,
                    notifyTitle   : `Notifying in ${ this.state.notifySeconds }`
                })
            else {

            }
        }, 1000);

        this.setState ({
            notifyTimer : notifyTimer
        })
        
    }

    findMe () {
        /*
        console.log ("USER POSITION : ");
        getCurrentLocation ().then (result => {
            console.log (result);
            this.setState ({
                userLocation : result
            })
        }).catch (error => {
            console.log (error);
        }) */

        if (this.state.userLocation.latlng.latitude != null && this.state.userLocation.latlng.longitude != null) {
            // console.log (this.map);
            // Center on user position

            console.log (this.state.userLocation.latlng.latitude);

            let region = {
                latitude       : parseFloat (this.state.userLocation.latlng.latitude),
                longitude      : parseFloat (this.state.userLocation.latlng.longitude),
                latitudeDelta  : 0.005,
                longitudeDelta : 0.005
            }

            this.setState ({
                region : region
            })

            // region.start ();

            /*

            region.timing ({
                latitude       : this.state.userLocation.latlng.latitude,
                longitude      : this.state.userLocation.latlng.longitude,
            }).start (); */

            
            this.map.animateToRegion ({
                latitude       : this.state.userLocation.latlng.latitude,
                longitude      : this.state.userLocation.latlng.longitude,
                latitudeDelta  : 0.005,
                longitudeDelta : 0.005
            })
        }
    }

    render () {
        return (
            <View style = { styles.container }>
                <TouchableOpacity
                    styles = { styles.findMeBtn }
                    onPress = { this.findMe } 
                    underlayColor = '#fff'>
                    <Image 
                        source = {
                            require('../../../assets/location.imageset/define_location.png')
                        }
                    />

                </TouchableOpacity>
                <PopupDialog
                    ref = { (popupDialog) => { this.popupDialog = popupDialog; }} >
                    <View>
                        <Text>{ this.state.notifyTitle }</Text>
                    </View>
                </PopupDialog>
                <MapView 
                    style = { styles.map }
                    initialRegion = { this.state.region }
                    ref   = { map => { 
                        this.map = map 
                        }
                    } >
                    { this.state.userLocation.latlng.latitude != null && this.state.userLocation.latlng.longitude != null &&
                        <MapView.Marker 
                            coordinate  = { this.state.userLocation.latlng } 
                            title       = "Current position"
                            description = "You are here" />
                    }

                    {
                        this.state.staticKits.length > 0 &&
                        this.state.staticKits.map ((marker, index) => (
                            <MapView.Marker
                                key         = { index }
                                coordinate  = { marker.latlng }
                                title       = { marker.title }
                                description = { marker.description } >
                                <MapView.Callout>
                                    <Text>{ marker.title }</Text>
                                    <Text>{ marker.description }</Text>
                                    <TouchableOpacity onPress = { () => {
                                        let url = `http://maps.apple.com/?saddr=${ this.state.userLocation.latlng.latitude },${ this.state.userLocation.latlng.longitude }&daddr=${ marker.latlng.latitude },${ marker.latlng.longitude }`;
                                        console.log (url);
                                        if (Linking.canOpenURL (url))
                                            Linking.openURL (url);
                                     } } style={ [ styles.bubble, styles.button ] }>
                                        <Image
                                            source = {
                                                require('../../../assets/Car.imageset/car.png')
                                            }
                                        />
                                    </TouchableOpacity>
                                </MapView.Callout>
                            </MapView.Marker>
                        ))
                    }
                    {
                        this.state.overdoses.length > 0 && 
                        this.state.overdoses.map ((marker, index) => (
                            <MapView.Marker
                                key         = { marker.key }
                                coordinate  = { marker.latlng }
                                title       = ''
                                description = ''
                                image       = {
                                    require('../../../assets/key.imageset/key.png')
                                }>
                                <MapView.Callout>
                                    <Text>
                                        Reported Overdose at <Timestamp time = { marker.timestamp } component = { Text } />
                                    </Text>
                                    
                                </MapView.Callout>
                            </MapView.Marker>
                        ))
                    }
                </MapView>
                <TouchableOpacity
                    style = { styles.helpMeBtn }
                    onPress = { this.helpMe.bind (this) }
                    underlayColor = '#fff'>
                    <Text style = { styles.helpMeText }>Help Me</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create ({
    container : {
        flex : 1,
        backgroundColor : '#F5FCFF',
        flexDirection : 'column',
    },
    map : {
        flex : 12,
    },
    helpMeBtn : {
        flex : 1,
        backgroundColor : '#8b0000',
    },
    helpMeText : {
        color:'#fff',
        textAlign:'center',
        fontWeight: 'bold',
        paddingLeft : 10,
        paddingRight : 10,
        paddingTop : 10,
        paddingBottom : 10
    }
})

AppRegistry.registerComponent ('MapComponent', () => MapComponent);