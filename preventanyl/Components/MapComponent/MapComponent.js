import React, { Component } from 'react';
import { AppRegistry, Text, View, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

export default class MapComponent extends Component {

    constructor () {
        super ();
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
        }
    }

    getInitialState() {
        return {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
      }
      

    onRegionChange (region) {
        this.setState ({
            region
        })
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
                    style = { styles.map }
                    region = { this.state.region }
                    onRegionChange = { () => { this.onRegionChange } } >
                    { this.state.markers.map (marker => (
                        <MapView.Marker
                            coordinate  = { marker.latlng }
                            title       = { marker.title }
                            description = { marker.description } 
                            key         = { marker.latlng } />
                    ))}
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