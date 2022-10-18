import firebase from "firebase";
const app = firebase.initializeApp({
    apiKey: "ZsY6HKWyzjy9YjKPGgaXUi98MLhzqS7Vkh5AF8Xd",
    projectId: "apx-stone-paper-scissors-gmz",
    authDomain: "apx-stone-paper-scissors-gmz.firebase.app",
    databaseUrl: "https://apx-stone-paper-scissors-gmz-default-rtdb.firebaseio.com/",
});

const rtdb = firebase.database();

export { rtdb };