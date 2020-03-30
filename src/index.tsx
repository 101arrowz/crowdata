const polyfill = document.createElement('script');
polyfill.src = '/api/polyfill.js';
document.head.appendChild(polyfill);

import React from 'react';
import { render } from 'react-dom';
import App from './App';

if ((process.env.NODE_ENV === 'production' || process.env.SW) && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.ts');
  if ('SyncManager' in window)
    navigator.serviceWorker.ready
      .then(reg => {
        reg.sync.register('sendPending');
      })
      .catch(() => {
        // ignore sync fail
      });
}
render(<App />, document.getElementById('root'));
