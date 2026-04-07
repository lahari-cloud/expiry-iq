// NOTE: Replace the firebaseConfig values below with your actual project values.
// This file must live at /public/firebase-messaging-sw.js so it is served from
// the root of your domain (required by Firebase for the service worker scope).

importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "REPLACE_WITH_YOUR_API_KEY",
  authDomain:        "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId:         "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket:     "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId:             "REPLACE_WITH_YOUR_APP_ID",
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'ExpiryAlert', {
    body: body || 'A product is expiring soon.',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    tag: 'expiry-alert',
    requireInteraction: true,
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'View product' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  });
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(clients.openWindow('/'));
  }
});
