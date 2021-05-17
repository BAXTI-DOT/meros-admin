import firebase from 'firebase/app'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyC3qiphOVt7qJJY9e-z7HL2f1DGi-NUmks",
    authDomain: "meros-e3e86.firebaseapp.com",
    projectId: "meros-e3e86",
    storageBucket: "meros-e3e86.appspot.com",
    messagingSenderId: "537156294181",
    appId: "1:537156294181:web:f5fe60e6db39b64a2751cc",
    measurementId: "G-EBZCE62T5X"
}

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

export { storage, firebase as default }