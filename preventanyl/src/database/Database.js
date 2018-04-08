import * as firebase from "firebase";

import spinnerFunction from '../utils/spinnerFunction';
import { genericVerificationAlert } from '../utils/genericAlerts';

const config = {
    apiKey: "AIzaSyAO6B13IApMmcF-8f8QorZRAgD9CEjzHu4",
    authDomain: "preventanyl-1511504708922.firebaseapp.com",
    databaseURL: "https://preventanyl-1511504708922.firebaseio.com",
    projectId: "preventanyl-1511504708922",
    storageBucket: "preventanyl-1511504708922.appspot.com",
    messagingSenderId: "551559642544"
};

const firebaseApp = firebase.initializeApp (config);

export default class Database {

    static firebaseRefs = Object.freeze (
        {
            "staticKitsRef"    : firebase.database ().ref ('statickits'),
            "overdosesRef"     : firebase.database ().ref ('overdoses'),
            "usersRef"         : firebase.database ().ref ().child ("user"),
            "userLocationsRef" : firebase.database().ref ().child ("userLocations")
        }
    )

    static currentUser = undefined;

    static firebaseEventTypes = Object.freeze (
        {
            "Added"   : "child_added",
            "Changed" : "child_changed",
            "Removed" : "child_removed"
        }
    )

    static genericListenForItems (itemsRef, callback) {
        let items = [];

        return itemsRef.on('value', (snapshot) => {

            let val = snapshot.val ();

            if (val)
                callback (val);

        });
    }

    static genericListenForItem (itemsRef, eventType, callback) {
        // retrieve the last record from `itemsRef`
        return itemsRef.limitToLast(1).on(eventType, (snapshot) => {

            let val = snapshot.val ();

            // all records after the last continue to invoke this function
            if (val)
                callback (val);
         
         });
    }

    static addItem (itemsRef, item) {
        itemsRef.update (item)
    }

    static addItemWithChildPath (itemsRef, childPath, item) {
        itemsRef.child (`${ childPath }/`).update (item)
    }

    static addItemWithChildPathId (itemsRef, childPath, item) {
        itemsRef.child (`${ childPath }/${ item.id }`).update (item)
    }

    static addItemWithChildId (itemsRef, item) {
        itemsRef.child (`/${ item.id }`).update (item)
    }

    static listenForItems (itemsRef, callback) {

        Database.genericListenForItems (itemsRef, (snapshotVal) => {
            let items = [];
        
            items = Object.keys (snapshotVal).map ((item) => {
                return snapshotVal [item];
            });

            callback (items);
        });

        
    }

    static listenForItemsWithKeys(itemsRef, callback) {

        Database.genericListenForItems (itemsRef, (snapshotVal) => {
            let items = [];
            
            items = Object.keys (snapshotVal).map ((item) => {
                snapshotVal[item].id = item;
                return snapshotVal [item];
            });

            callback (items);
        });

    }

}