'use strict';
self.importScripts('./js/fetchGQL.js');
self.importScripts('./js/idb.js');
var cacheName = 'hello-pwa';
var filesToCache = [
  './',
  './index.html',
  './css/style.css',
  './css/all.min.css',
  './js/main.js',
  './js/idb.js',
  './images/pwa.png',
  './favicon.ico',
  './webfonts',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
          try {
            const cache = await caches.open(cacheName);
            return cache.addAll(filesToCache);
          } catch (e) {
            console.log(e.message);
          }
      })());
  });
  

/* Serve cached content when offline */
self.addEventListener('fetch', (event) => {
    console.log('ServiceWorker Fetch', event.request.url);
    event.respondWith((async () => {
          try {
              const response = await caches.match(event.request);
              return response || fetch(event.request);
          } catch (e) {
              console.log(e.message);
          }
      })());
  });
  
  self.addEventListener('sync', (event) => {
    if (event.tag === 'send-message') {
      event.waitUntil(sendToServer());
    }
  });
  
  
  const sendToServer = async () => {
    try {
      const outbox = await loadData('outbox');
      const sentMessages = await Promise.all(outbox.map(async (message) => await saveGreeting(message)));
      console.log('sentMessages', sentMessages);
      clearData('outbox');
    } catch (e) {
      console.log(e.message);
    }
  };