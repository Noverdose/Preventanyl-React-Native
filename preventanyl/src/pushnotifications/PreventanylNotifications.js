import React from 'react';

import { genericErrorAlert, notifyAngelAlert, notifyAngelErrorAlert } from '../utils/genericAlerts';

import { getCurrentLocation, convertLocationToLatitudeLongitude } from '../utils/location';

import Network from '../utils/Network';

import Database from '../database/Database';
import Overdose from '../objects/Overdose';

export default class PreventanylNotifications {

    static notifyAngels = async (successCallback, failureCallback) => {

        if (!Network.connectionObject.connected) {
            notifyAngelErrorAlert ();
            failureCallback (new Error (Network.errorMessages.NO_INTERNET_CONNECTION));
            return;
        }

        getCurrentLocation ( (result) => {
            location = convertLocationToLatitudeLongitude (result);
            
            // console.log (location);
            
            overdose = Overdose.generateOverdoseFromLocation (location)
            // console.log (overdose)
            
            url = `https://preventanyl.com/regionfinder.php?id=${ overdose.id }&lat=${ overdose.latlng.latitude }&long=${ overdose.latlng.longitude }`
            Database.addItemWithChildId (Database.firebaseRefs.overdosesRef, overdose.generateOverdoseForStorage ())
            
            console.log (url);

            notifyAngelAlert ();

            // No need to send location result back as it is not useful information
            successCallback ();

        }, (error) => 
            {
                console.log (error);
                failureCallback (error);
                genericErrorAlert ('unable to notify nearby, please check network connection and gps');
            }
        )      
       
    }

}