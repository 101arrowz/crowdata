import MediaRecorderPolyfill = require('audio-recorder-polyfill');

if (!window.MediaRecorder)
  window.MediaRecorder = MediaRecorderPolyfill;

import React from 'react';
import { render } from 'react-dom';
import App from './App';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.ts');
  if ('SyncManager' in window)
    navigator.serviceWorker.ready.then(reg => {
      reg.sync.register('sendPending');
    }).catch(() => {});
}
render(<App />, document.getElementById('root'));
