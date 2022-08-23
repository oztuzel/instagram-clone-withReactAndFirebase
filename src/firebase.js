// firebase => go to console => go to project => project settings => general => fall down with scrolbar => config => and copy this
// const firebaseConfig = {
//     apiKey: "AIzaSyDumIycN95OuxG_uNbvSrTKnMj-vGvvJGI",
//     authDomain: "instagram-clone-e6e8d.firebaseapp.com",
//     databaseURL: "https://instagram-clone-e6e8d-default-rtdb.firebaseio.com",
//     projectId: "instagram-clone-e6e8d",
//     storageBucket: "instagram-clone-e6e8d.appspot.com",
//     messagingSenderId: "935604518867",
//     appId: "1:935604518867:web:d0099bad059c0d8a79f926",
//     measurementId: "G-4JYYDJMHPH"
//   };
// copy the inside config anda paste in firebase.initializeApp( {...in there} )

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDumIycN95OuxG_uNbvSrTKnMj-vGvvJGI",
  authDomain: "instagram-clone-e6e8d.firebaseapp.com",
  databaseURL: "https://instagram-clone-e6e8d-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-e6e8d",
  storageBucket: "instagram-clone-e6e8d.appspot.com",
  messagingSenderId: "935604518867",
  appId: "1:935604518867:web:d0099bad059c0d8a79f926",
  measurementId: "G-4JYYDJMHPH",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, storage, firebaseApp };
