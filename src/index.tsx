import MediaRecorderPolyfill = require('audio-recorder-polyfill');

if (!window.MediaRecorder)
  window.MediaRecorder = MediaRecorderPolyfill;

import React from 'react';
import { render } from 'react-dom';
import App from './App';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.ts');
}
render(<App />, document.getElementById('root'));
