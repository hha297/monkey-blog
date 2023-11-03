import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyBZGc89tT8OgO7BX-LATXdPXz1G-mRYLjM',
    authDomain: 'monkey-blog-ddcea.firebaseapp.com',
    projectId: 'monkey-blog-ddcea',
    storageBucket: 'monkey-blog-ddcea.appspot.com',
    messagingSenderId: '198381436320',
    appId: '1:198381436320:web:2943932b18a8cd015ff8c5',

    //     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    //   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    //   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    //   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE,
    //   messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    //   appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
