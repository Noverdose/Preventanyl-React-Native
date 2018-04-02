import React from 'react';

import { genericErrorAlert, notifyAngelAlert } from '../utils/genericAlerts';

import { getCurrentLocation, convertLocationToLatitudeLongitude } from '../utils/location';

import Database from '../database/Database';
import Overdose from '../objects/Overdose';

export default class PreventanylNotifications {

    static notifyAngels = async () => {
        getCurrentLocation ( (result) => {
            location = convertLocationToLatitudeLongitude (result);
            console.log (location);
            overdose = Overdose.generateOverdoseFromLocation (location)
            console.log (overdose)
            url = `https://preventanyl.com/regionfinder.php?id=${ overdose.id }&lat=${ overdose.latlng.latitude }&long=${ overdose.latlng.longitude }`
            Database.addItemWithChildId (Database.firebaseRefs.overdosesRef, overdose.generateOverdoseForStorage ())
            console.log (url);

            notifyAngelAlert ();

        }, (error) => {
            console.log (error);
            genericErrorAlert ('unable to notify nearby, please check network connection and gps');
        })      
       
    }

}