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

    static listenStaticKits (callback) {

        let kits = [];
        // console.log (Database.staticKitsRef);

        return Database.staticKitsRef.on('value', (snapshot) => {

            var location = "";

            // console.log (snapshot);

            if (snapshot.val ()) {
                let val = snapshot.val ();
                let kit;
                // console.log (val);
                for (kit in val) {
                    // console.log (val[kit]);
                    kits.push(val[kit]);
                }
                callback (kits);
            }

            // callback (mobile);

        });
    }


}