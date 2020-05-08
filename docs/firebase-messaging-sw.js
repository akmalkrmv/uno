// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/7.14.1/firebase-messaging.js'
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: 'AIzaSyB8OELF8OtaSi-hF8rJm3lzgBn5GOI6Yeo',
  authDomain: 'uno-server-3000.firebaseapp.com',
  databaseURL: 'https://uno-server-3000.firebaseio.com',
  projectId: 'uno-server-3000',
  storageBucket: 'uno-server-3000.appspot.com',
  messagingSenderId: '460750590702',
  appId: '1:460750590702:web:e38380af9f7ff3e2a699ff',
  measurementId: 'G-1D1LTS2GWF',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
