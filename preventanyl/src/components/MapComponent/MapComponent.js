import React, { Component } from 'react';
import { AppRegistry, Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';

import MapView, { AnimatedRegion, Animated } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';

import Database from '../../database/Database'
import PreventanylNotifications from '../../pushnotifications/PreventanylNotifications';

import { convertLocationToLatitudeLongitude, getCurrentLocation, getCurrentLocationAsync, setupLocation } from '../../utils/location';
import { formatDateTime, compareDiffHoursNow, getMomentNow, getMomentNowSubtractHours } from '../../utils/localTimeHelper';
import { formatAddressObjectForMarker } from '../../utils/strings';
import { genericErrorAlert, genericDisclaimerAlert, notifyHelpErrorAlert } from '../../utils/genericAlerts';
import { generateAppleMapsUrl } from '../../utils/linkingUrls';

import Network from '../../utils/Network';
import Colours from '../../utils/Colours';
import Storage from '../../utils/Storage';

import GenericNativeDialog from '../../subcomponents/GenericNativeDialog/GenericNativeDialog';
import MapCallout from '../../subcomponents/MapCallout/MapCallout';

import StaticKit from '../../objects/StaticKit';

import App from '../../../App';

const notifyTitle                  = "Notify Help";

const HELP_COOL_DOWN               = 0.166667;
const HELP_COOL_DOWN_ERROR_MESSAGE = `Please wait ${ Math.round (HELP_COOL_DOWN * 60) } minutes before asking for help again`;

const USER_POSITION_TITLE          = "Current position";
const USER_POSITION_MESSAGE        = "You are here";

const HELP_ME_BUTTON_TITLE         = "Help Me"

const SPINNER_MESSAGE              = "Loading...";


/*
    Declerations to use shorthand by removing . when using subcomponents
*/
const Marker = MapView.Marker;

export default class MapComponent extends Component {

    watchId                        = undefined;
    static spinnerFunctionsLoading = 0;

    constructor () {
        super ();

        this.state = {
            region : null,
            staticKits : [],
            userLocation : {
                latlng : {
                    latitude  : null,
                    longitude : null,
                },
                error : null,
            },
            isLoading       : false,
            notifyMessage   : '5', // 'Notifying in 5 seconds',
            notifySeconds   : 5,
            notifyTimer     : null,
            notifyTimestamp : getMomentNowSubtractHours (2)
        }

        this.setInitialRegionState ();

        this.findMe = this.findMe.bind (this);
        this.helpMe = this.helpMe.bind (this);
        // PushNotifications.setup ();
    }

    watchLocation () {
        this.stopFollowingUserLocation ();
        this.watchId = navigator.geolocation.watchPosition (
            async (position) => {
                // console.log (position)

                this.setState (
                    {
                        userLocation : {
                            latlng : {
                                latitude  : position.coords.latitude,
                                longitude : position.coords.longitude,
                            },
                            error     : null,
                        }
                    }
                );

            },
            (error) => this.setState ( 
                {
                    error : error.message
                }
            ),
            { 
                enableHighAccuracy : true,
                timeout            : 20000,
                maximumAge         : 1000,
                distanceFilter     : 10
            }
        );
    }

    stopFollowingUserLocation () {
        navigator.geolocation.clearWatch (this.watchId);
    }

    async componentDidMount () {
        this.mounted = true;

        // If in future, add multiple disclaimer values, 
        // adjust code to see all options in Storage values object.
        Storage.getDisclaimerData ( (data) => 
            {
                console.log ("DATA", data);
            }, (error) => {
                genericDisclaimerAlert ( () => 
                    {
                        Storage.setDisclaimerData (Storage.values.DISCLAIMER_CLIENT.VALID.ACCEPTED, () => 
                            {
                                console.log (Storage.values.DISCLAIMER_CLIENT.VALID.ACCEPTED);
                            }
                        ,(error) => 
                            {
                                console.log ("ERROR", error);
                            }
                        )
                    }
                )
            }
        )

        this.setState (
            {
                isLoading : true
            }
        );

        Network.setupNetworkConnection ();

        this.watchLocation ();

        // Could clear by adding to pauseFunctions however it is being cleared in componentWillUnmount
        App.addResumeFunction ( () => 
            {

                setupLocation ( (result) => {

                    this.convertLocationMount (result, (location) => 
                        {
                            console.log ('location ,', location);
                        }
                    )
                    
                    this.watchLocation ();
                }, (error) => 
                    {
                        console.log (error);
                    }
                )

            }
        );

        App.addResumeFunction ( () => 
            {

                Network.changeNetworkStatus    ();
                Network.setupNetworkConnection ();
                
            }
        )

        App.addPauseFunction ( () => 
            {
                Network.genericRemoveAllListeners (Network.eventTypes.CONNECTION_CHANGE);
            }
        )


        // For Future, do this on load, and afterwards check for change for efficency
        Database.listenForItems (Database.firebaseRefs.staticKitsRef, async (kits) => {

            await this.simpleLoadingFunction ( async () => {
                let staticKits = [];

                staticKits = kits.map ( (kit) => 
                    {
                        return StaticKit.generateStaticKitFromSnapshot (kit);
                    }
                )
                    
                this.setState (
                    {
                        staticKits : staticKits
                    }
                );
                
            })

        });

    }

    async componentWillUnmount () {
        this.stopFollowingUserLocation ();
        this.mounted = false;
    }

    // PRECONDITION : isLoading must be true before function call
    simpleLoadingFunction = async (func) => {

        try {

            ++MapComponent.spinnerFunctionsLoading;
            await func ();

        } catch (error) {

            console.warn ("ERROR", error);
            // genericErrorAlert (error);

        } finally {

            --MapComponent.spinnerFunctionsLoading;

            if (MapComponent.spinnerFunctionsLoading === 0 && this.mounted)
                this.setState (
                    {
                        isLoading : false
                    }
                )

        }

    }

    genericCreateRegion (location) {
        return {
            latitude       : location.latitude,
            longitude      : location.longitude,
            latitudeDelta  : 0.005,
            longitudeDelta : 0.005
        }
    }

    genericCreateRegionDelta (location, latitudeDelta, longitudeDelta) {
        return {
            latitude       : location.latitude,
            longitude      : location.longitude,
            latitudeDelta  : latitudeDelta,
            longitudeDelta : longitudeDelta
        }
    }

    convertLocationMount (result, successCallback) {
        let location = convertLocationToLatitudeLongitude (result);

        if (this.mounted)
            this.setState (
                {
                    userLocation : location
                }
            );

        location = this.genericCreateRegion (location.latlng);

        successCallback (location);
    }

    createRegionCurrentLocation (successCallback, failureCallback) {

        getCurrentLocation ((result) => {
            this.convertLocationMount (result, (location) => {
                successCallback (location);
            })

        }, (error) => {
            failureCallback (new Error("Unable to create region"));
        })

    }

    setupRegionCurrentLocation (successCallback, failureCallback) {
        setupLocation ((result) => {
            let location = convertLocationToLatitudeLongitude (result);

            if (this.mounted)
                this.state.userLocation = location;

            location = this.genericCreateRegion (location.latlng);

            successCallback (location);
        }, (error) => {
            failureCallback (new Error("Unable to create region"));
        })
    }

    setInitialRegionState() {

        this.setupRegionCurrentLocation ( (result) => {
            this.setState (
                {
                    region : result
                }
            );
        }, (error) => 
            {
                this.setState (
                    {
                        region : {
                            latitude: 49.246292,
                            longitude: -123.116226,
                            latitudeDelta: 0.2,
                            longitudeDelta: 0.2,
                        }
                    }
                );
            }
        );

    }

    resetHelpTimer () {

        if (this.state.notifyTimer != null)
            clearInterval (this.state.notifyTimer);

        this.setState (
            {
                notifySeconds : 5,
                notifyMessage : this.state.notifySeconds.toString ()
                // notifyMessage : `Notifying in ${ this.state.notifySeconds } seconds`
            }
        )
       
    }

    helpMe () {

        this.resetHelpTimer ();

        if (!Network.connectionObject.connected) {
            notifyHelpErrorAlert ();
            return;
        }

        // console.log (compareDiffHoursNow (this.state.notifyTimestamp));

        if (compareDiffHoursNow (this.state.notifyTimestamp) < HELP_COOL_DOWN) {
            genericErrorAlert (HELP_COOL_DOWN_ERROR_MESSAGE);
            return;
        }

        this.nativeDialog.show ();

        let notifyTimer = setInterval (() => {
            if (this.state.notifySeconds > 0)
                this.setState (
                    {
                        notifySeconds : this.state.notifySeconds - 1,
                        // notifyMessage : `Notifying in ${ this.state.notifySeconds } seconds`
                        notifyMessage : this.state.notifySeconds.toString ()
                    }
                )
            else {
                console.log ("TIME IS ZERO");
                this.notfiyHelpWithUpdates ();
            }
        }, 1000);

        this.setState (
            {
                notifyTimer : notifyTimer,
            }
        )
        
    }

    findMe () {

        this.createRegionCurrentLocation ((region) => {
            this.setState (
                {
                    region : region
                }
            )

            // Center on user position
            this.map.animateToRegion (this.state.region);
        }, (error) => 
            {
                genericErrorAlert ("Failed to find user");
            }
        );

    }

    notfiyHelpWithUpdates () {
        console.log ("Notifying Help");

        this.resetHelpTimer ();

        PreventanylNotifications.notifyHelp ( () => 
            {

                this.setState (
                    {
                        notifyTimestamp : getMomentNow ()
                    }
                )        
            }, (error) => 
            {
                console.log (error);
            }
        );

        this.nativeDialog.dismiss ();
    }

    render () {
        return (
            <View style = { styles.container }>

                <Spinner
                    visible = { this.state.isLoading }
                    textContent = { SPINNER_MESSAGE }
                    textStyle = {
                        { color : '#FFF' }
                    }
                    cancelable = { false } />
                
                <GenericNativeDialog
                    title   = { notifyTitle } 
                    message = { this.state.notifyMessage } 
                    actionButtonText = { notifyTitle }
                    cancelFunction = { () => 
                        {
                            this.resetHelpTimer ();
                        }
                    }
                    actionFunction = { () => 
                        { 
                            this.notfiyHelpWithUpdates ();
                        }
                    }
                    ref = { 
                        (nativeDialog) => { 
                            this.nativeDialog = nativeDialog; 
                        } 
                    }
                />

                <MapView 
                    style = { styles.map }
                    initialRegion = { this.state.region }
                    ref   = { map => { 
                        this.map = map 
                        }
                    } >

                    <TouchableOpacity
                        styles = { styles.findMeBtn }
                        onPress = { this.findMe } 
                        underlayColor = '#fff'>

                        <Image 
                            source = {
                                require('../../../assets/location.imageset/define_location.png')
                            } />

                    </TouchableOpacity>

                    { this.state.userLocation.latlng.latitude != null && this.state.userLocation.latlng.longitude != null &&
                        <Marker 
                            coordinate  = { this.state.userLocation.latlng } 
                            title       = { USER_POSITION_TITLE }
                            description = { USER_POSITION_MESSAGE }
                            pinColor    = { Colours.HEX_COLOURS.BLACK } />
                    }

                    {
                        this.state.staticKits.length > 0 &&
                        this.state.staticKits.map ((marker, index) => (
                            <Marker
                                key         = { index }
                                coordinate  = { marker.latlng }
                                title       = { marker.title }
                                description = { marker.formattedDescription } >

                                <MapCallout 
                                    title = { marker.title }
                                    description = { marker.formattedDescription }
                                    url = { generateAppleMapsUrl ( this.state.userLocation.latlng, marker.latlng ) } />
                                
                            </Marker>
                        ))
                    }

                </MapView>

                <TouchableOpacity
                    style = { styles.helpMeBtn }
                    onPress = { this.helpMe.bind (this) }
                    underlayColor = '#fff'>
                    <Text style = { styles.helpMeText }>{ HELP_ME_BUTTON_TITLE }</Text>
                </TouchableOpacity>
                
            </View>
        );
    }
}


const styles = StyleSheet.create ({
    container : {
        flex : 1,
        backgroundColor : '#F5FCFF',
        flexDirection   : 'column',
    },
    map : {
        flex : 12,
    },
    helpMeBtn : {
        flex : 1,
        backgroundColor : '#8b0000',
    },
    helpMeText : {
        color         : '#fff',
        textAlign     : 'center',
        fontWeight    : 'bold',
        paddingLeft   : 10,
        paddingRight  : 10,
        paddingTop    : 10,
        paddingBottom : 10
    }
})

AppRegistry.registerComponent ('MapComponent', () => MapComponent);