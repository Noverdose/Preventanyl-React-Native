import React, { Component } from 'react';
import { AppRegistry, Text, View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

export default class MapComponent extends Component {

    constructor () {
        super ();
        this.state = {
            region : this.getInitialState (),
            markers : {},
        }

        console.log (this.state);
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
                            description = { marker.description } />
                    ))}
                </MapView>
            </View>
        );
    }
}


const styles = StyleSheet.create ({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : '#F5FCFF'
    },
    map : {
        position : 'absolute',
        top    : 0,
        left   : 0,
        right  : 0,
        bottom : 0
    }
})

AppRegistry.registerComponent ('MapComponent', () => MapComponent);