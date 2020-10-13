import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp(functions.config().firebase);

function sentToUser(userId: string, notification: object) {
  const userRef = admin.firestore().collection('users').doc(userId);

  return userRef
    .get()
    .then((snapshot) => snapshot.data())
    .then((user) => {
      if (!user) {
        throw new Error('Can not find user');
      }

      const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : [];
      console.log(`User: ${user.name}, tokens: ${tokens}`);

      if (tokens && tokens.length) {
        admin.messaging().sendToDevice(tokens, notification);
      } else {
        console.log('User does not have tokens');
      }
    })
    .catch((error) => console.log(error));
}

export const messageNotification = functions.firestore
  .document('messages/{messageId}')
  .onCreate((event) => {
    const message = event.data();
    const senderId: string = message && message.sender;
    const roomId: string = message && message.roomId;

    const payload = {
      notification: {
        title: 'Новое сообшение',
        body: `${senderId} прислал сообшение`,
      },
    };

    const roomRef = admin.firestore().collection('rooms').doc(roomId);

    return roomRef
      .get()
      .then((snapshot) => snapshot.data())
      .then((room) => {
        if (!room) {
          throw new Error('Can not find room');
        }

        room.members.forEach((userId: string) => sentToUser(userId, payload));
      })
      .catch((error) => console.log(error));
  });

export const callNotification = functions.firestore
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

    return sentToUser(userToId, payload);
  });
