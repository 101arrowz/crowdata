import MediaRecorderPolyfill = require('audio-recorder-polyfill');

if (!window.MediaRecorder) window.MediaRecorder = MediaRecorderPolyfill;

const mimeType = [
  'audio/webm; codecs=opus',
  'audio/ogg; codecs=opus',
  'audio/ogg',
  'audio/webm',
  'audio/wav'
].find(MediaRecorder.isTypeSupported);

type AmplitudeCallback = (amplitude: number) => unknown;

const supported =
  mimeType && !((MediaRecorder as unknown) as { notSupported: boolean }).notSupported;

class AudioRecorder {
  private data: Blob[];
  private mediaRecorder: MediaRecorder;
  onAmplitudeUpdate: AmplitudeCallback;
  constructor() {
    if (!mimeType) throw new Error('audio recording not supported');
    this.data = [];
  }

  async prepare(): Promise<void> {
    const gump = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    // TypeScript can be so annoying
    const gum =
      navigator.getUserMedia ||
      (navigator as Navigator & { webkitGetUserMedia: Navigator['getUserMedia'] })
        .webkitGetUserMedia ||
      (navigator as Navigator & { mozGetUserMedia: Navigator['getUserMedia'] }).mozGetUserMedia ||
      (navigator as Navigator & { msGetUserMedia: Navigator['getUserMedia'] }).msGetUserMedia;
    const stream = await (gump
      ? navigator.mediaDevices.getUserMedia({ audio: true })
      : new Promise<MediaStream>((res, rej) => gum.call(navigator, { audio: true }, res, rej)));
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType
    });
    this.mediaRecorder.addEventListener('dataavailable', ev => this.data.push(ev.data));
    const ctx = new AudioContext({ sampleRate: 48000 });
    const processor = ctx.createScriptProcessor(256, 1, 1);
    processor.addEventListener('audioprocess', ev => {
      if (this.mediaRecorder.state !== 'recording' || !this.onAmplitudeUpdate)
        return;
      const dat = ev.inputBuffer.getChannelData(0);
      let sumSquareAmp = 0;
      for (let amp of dat)
        sumSquareAmp += amp * amp;
      const amp = Math.sqrt(sumSquareAmp / dat.length);
      this.onAmplitudeUpdate(amp);
    });
    ctx.createMediaStreamSource(stream).connect(processor);
    processor.connect(ctx.destination);
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
      const cb = (): void => {
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
