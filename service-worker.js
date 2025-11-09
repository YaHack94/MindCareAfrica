
// service-worker.js

self.addEventListener('install', event => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
});

self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');
  
  // Default data if payload is empty
  let data = {
    title: 'Nouvelle notification',
    body: 'Quelque chose de nouveau est arrivé !',
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch(e) {
    console.error("Failed to parse push data", e);
  }

  const title = data.title;
  const options = {
    body: data.body,
    icon: 'vite.svg', // An icon for the notification
    badge: 'vite.svg', // A smaller icon for the notification bar
  };

  event.waitUntil(self.registration.showNotification(title, options));
});