import * as admin from "firebase-admin";
const serviceAccount = require("./key.json");

// console.log(admin)
// console.log(serviceAccount)


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://apx-stone-paper-scissors-gmz-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };