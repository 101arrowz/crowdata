import MediaRecorderPolyfill = require('audio-recorder-polyfill');

if (!window.MediaRecorder) window.MediaRecorder = MediaRecorderPolyfill;

const mimeType = [
  'audio/webm; codecs=opus',
  'audio/ogg; codecs=opus',
  'audio/ogg',
  'audio/webm',
  'audio/wav'
].find(MediaRecorder.isTypeSupported);

const supported =
  mimeType && !((MediaRecorder as unknown) as { notSupported: boolean }).notSupported;

class AudioRecorder {
  private data: Blob[];
  private mediaRecorder: MediaRecorder;
  constructor() {
    if (!mimeType) throw new Error('audio recording not supported');
    this.data = [];
  }

  async prepare(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType
    });
    this.mediaRecorder.addEventListener('dataavailable', ev => this.data.push(ev.data));
  }

  start(): boolean {
    if (!this.mediaRecorder) throw new Error('audio recorder not prepared');
    switch (this.mediaRecorder.state) {
      case 'recording':
        return false;
      case 'paused': {
        this.mediaRecorder.resume();
        return true;
      }
      default: {
        this.data = [];
        this.mediaRecorder.start();
        return true;
      }
    }
  }

  pause(): boolean {
    if (!this.mediaRecorder) throw new Error('audio recorder not prepared');
    if (this.mediaRecorder.state !== 'recording') return false;
    this.mediaRecorder.pause();
    return true;
  }

  resume(): boolean {
    if (!this.mediaRecorder) throw new Error('audio recorder not prepared');
    if (this.mediaRecorder.state !== 'paused') return false;
    this.mediaRecorder.resume();
    return true;
  }

  async stop(): Promise<Blob | null> {
    if (!this.mediaRecorder) throw new Error('audio recorder not prepared');
    if (this.mediaRecorder.state === 'inactive') return null;
    return new Promise(res => {
      const cb = () => {
        res(new Blob(this.data, { type: mimeType }));
        this.mediaRecorder.removeEventListener('stop', cb);
      };
      this.mediaRecorder.addEventListener('stop', cb);
      this.mediaRecorder.stop();
    });
  }
}

const recorder = async (): Promise<AudioRecorder> => {
  try {
    const audioRecorder = new AudioRecorder();
    await audioRecorder.prepare();
    return audioRecorder;
  } catch (e) {
    return null;
  }
};

export default recorder;
export { AudioRecorder, supported };
