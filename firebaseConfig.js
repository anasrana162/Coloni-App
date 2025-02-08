// Import the functions you need from the SDKs you need
import { initializeApp } from "@react-native-firebase/app";
//import { getAnalytics } from "@react-native-firebase/analytics";
import { getDatabase } from '@react-native-firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwbYA3pYQohv-kZwtzZnoyp86LmnLco6Q",
  authDomain: "assigment-form-5af57.firebaseapp.com",
  databaseURL: "https://assigment-form-5af57-default-rtdb.firebaseio.com",
  projectId: "assigment-form-5af57",
  storageBucket: "assigment-form-5af57.appspot.com",
  messagingSenderId: "354782526265",
  appId: "1:354782526265:web:32370dfb07c6a6604a46e8",
  measurementId: "G-CQJHCN5FXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database };