import React from 'react';

import { genericErrorAlert, notifyHelpAlert, notifyHelpErrorAlert, notifyHelpErrorAlertUnknown } from '../utils/genericAlerts';

import { getCurrentLocation, convertLocationToLatitudeLongitude } from '../utils/location';

import Network from '../utils/Network';

import Database from '../database/Database';
import Overdose from '../objects/Overdose';

export default class PreventanylNotifications {

    static notifyHelp = async (successCallback, failureCallback) => {

        if (!Network.connectionObject.connected) {
            notifyHelpErrorAlert ();
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

            notifyHelpAlert ();

            // No need to send location result back as it is not useful information
            successCallback ();

        }, (error) => 
            {
                console.log (error);
                failureCallback (error);
                notifyHelpErrorAlertUnknown ();
            }
        )      
       
    }

}