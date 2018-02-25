import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyBa2ZiHRF2TrEaLBw3JrctIgT-UOU0tN84",
    authDomain: "preventanyl.firebaseapp.com",
    databaseURL: "https://preventanyl.firebaseio.com",
    projectId: "preventanyl",
    storageBucket: "preventanyl.appspot.com",
    messagingSenderId: "111767423984"
};

const firebaseApp = firebase.initializeApp (config);

export default class Database {

    static staticKitsRef = firebase.database ().ref('statickits');
    static overdosesRef  = firebase.database ().ref('overdoses');

    static genericListenForItems (itemsRef, callback) {
        let items = [];

        return itemsRef.on('value', (snapshot) => {

            if (snapshot.val ()) {
                let val = snapshot.val ();

                callback (val);
            }

        });
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
    
    async signup(email, pass) {
        try {
            await firebase.auth().
                createUserWithEmailAndPassword(email, pass);

            console.log("Account created");

            // Navigate to home page, user is auto logged in
        } catch (error) {
            console.log(error.toString());
        }
    }

    static async login(email, pass) {
        try {
            await firebase.auth().
                signInWithEmailAndPassword(email, pass);

            console.log("Logged in");

            // Navigate to home page, after login
        } catch (error) {
            console.log(error.toString());
        }
    }

    async logout() {
        try {
            await firebase.auth().signOut();

            // Navigate to login component
        } catch (error) {
            console.log(error.toString());
        }
    }


}