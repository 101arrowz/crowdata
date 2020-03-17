import MediaRecorderPolyfill = require('audio-recorder-polyfill');

if (!window.MediaRecorder)
  window.MediaRecorder = MediaRecorderPolyfill;