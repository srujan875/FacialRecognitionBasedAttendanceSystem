import { initializeApp } from 'firebase/app';
import {getAuth} from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCq2XBnZSzUmy4NQ3ro7fPKFo4I05b_Etc",
    authDomain: "faceattendance-b4196.firebaseapp.com",
    databaseURL: "https://faceattendance-b4196-default-rtdb.firebaseio.com",
    projectId: "faceattendance-b4196",
    storageBucket: "faceattendance-b4196.appspot.com",
    messagingSenderId: "173917752331",
    appId: "1:173917752331:web:db09532e3dc85a70748b0e",
    measurementId: "G-S0W16N9V60"
  };
  
const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)

export {app,auth};