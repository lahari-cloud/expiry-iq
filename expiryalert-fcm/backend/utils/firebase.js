import admin from 'firebase-admin';

let initialized = false;

export const getFirebaseAdmin = () => {
  if (!initialized) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    initialized = true;
  }
  return admin;
};

export const sendPushNotification = async ({ token, title, body, data = {} }) => {
  const fb = getFirebaseAdmin();
  try {
    await fb.messaging().send({
      token,
      notification: { title, body },
      data,
      android: { priority: 'high', notification: { sound: 'default', channelId: 'expiry_alerts' } },
      webpush: {
        notification: { title, body, icon: '/icon-192.png', badge: '/icon-96.png', requireInteraction: true },
        fcmOptions: { link: '/' },
      },
    });
    return true;
  } catch (err) {
    console.error('FCM error:', err.message);
    return false;
  }
};
