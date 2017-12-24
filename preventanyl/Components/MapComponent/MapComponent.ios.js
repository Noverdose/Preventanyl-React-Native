import React, { Component } from 'react';
import { AppRegistry, Text, View, Button, TouchableOpacity, Alert, StyleSheet, Linking } from 'react-native';
import MapView from 'react-native-maps';
import * as firebase from 'firebase';

import Database from '../../Database/Database'

export default class MapComponent extends Component {

    constructor () {
        super ();

        this.getInitialView ();

        this.state = {
            region : this.getInitialState (),
            markers : [
                {
                    latlng : {
                        latitude: 37.78825,
                        longitude: -122.4324,
                    },
                    title : "Marker",
                    description : "Marker",
                }
            ],
            userLocation : { 
                latlng : {
                    latitude  : null,
                    longitude : null,
                },
                error : null,
            },
            userLoaded  : false,
            initialView : false,
        }

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
                this.setState ({
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

        Database.listenStaticKits ((kits) => {
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
                markers : staticKits
            });

            console.log (staticKits);
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
        Alert.alert (
            'Title',
            'Message',
            [
                {
                    text : 'Notify Angels', onPress : () => console.log ('Notifying Angels')
                },
            ],
            { 
                cancelable : false
            }
        );
    }

    render () {
        return (
            <View style = { styles.container }>
                <MapView 
                    style = { styles.map } >
                    { this.state.userLocation.latlng.latitude != null && this.state.userLocation.latlng.longitude != null &&
                        <MapView.Marker 
                            coordinate  = { this.state.userLocation.latlng } 
                            title       = "Current position"
                            description = "You are here" />
                    }

                    {
                        this.state.markers &&
                        this.state.markers.map ((marker, index) => (
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
                                      <Text>Directions</Text>
                                    </TouchableOpacity>
                                </MapView.Callout>
                            </MapView.Marker>
                        ))
                    }
                </MapView>
                <TouchableOpacity
                    style = { styles.helpme }
                    onPress = { this.helpMe }
                    underlayColor = '#fff'>
                    <Text style = { styles.helpmeText }>Help Me</Text>
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
    helpme : {
        flex : 1,
        backgroundColor : '#8b0000',
    },
    helpmeText : {
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