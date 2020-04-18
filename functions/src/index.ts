import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp(functions.config().firebase);

export const notifyUser = functions.firestore
  .document('rooms/{roomId}/offers/{offerId}')
  .onCreate((event) => {
    const offer = event.data();
    const userFromId: string = offer && offer.from;
    const userToId: string = offer && offer.to;

    const payload = {
      notification: {
        title: 'Новый звонок',
        body: `${userFromId} начал соеденение`,
      },
    };

    const userRef = admin.firestore().collection('users').doc(userToId);

    return userRef
      .get()
      .then((snapshot) => snapshot.data())
      .then((user) => {
        if (!user) {
          throw new Error('Can not find user');
        }

        const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : [];

        if (!tokens.length) {
          console.log(`${user.name} tokens: ${user.fcmTokens}`);
          throw new Error('User does not have tokens');
        }

        admin.messaging().sendToDevice(tokens, payload);
      })
      .catch((error) => console.log(error));
  });
