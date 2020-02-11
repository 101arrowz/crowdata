const mimeType = [
  'audio/webm; codecs=opus',
  'audio/ogg; codecs=opus',
  'audio/ogg',
  'audio/webm'
].find(MediaRecorder.isTypeSupported);
const isSupported = !!mimeType;
let data: Blob[];
let mediaRecorder: MediaRecorder;

async function start(): Promise<boolean> {
  if (!isSupported) return false;
  if (mediaRecorder) {
    if (mediaRecorder.state === 'recording') return true;
  } else {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, {
      mimeType
    });
    mediaRecorder.addEventListener('dataavailable', ev => {
      data.push(ev.data);
    });
  }
  data = [];
  mediaRecorder.start();
  return true;
}

async function stop(): Promise<Blob | null> {
  if (!mediaRecorder || mediaRecorder.state !== 'recording') return null;
  return new Promise(resolve => {
    mediaRecorder.addEventListener('stop', () => {
      resolve(
        new Blob(data, {
          type: mimeType
        })
      );
    });
    mediaRecorder.stop();
  });
}

export default {
  start,
  stop,
  isSupported
};
export { start, stop, isSupported };
