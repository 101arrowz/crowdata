const mimeType = [
  'audio/webm; codecs=opus',
  'audio/ogg; codecs=opus',
  'audio/ogg',
  'audio/webm',
  'audio/wav'
].find(MediaRecorder.isTypeSupported);

class AudioRecorder {
  private data: Blob[];
  private mediaRecorder: MediaRecorder;
  state: 'inactive' | 'paused' | 'recording';
  constructor() {
    if (!mimeType)
      throw new Error('audio recording not supported');
    this.data = [];
    this.state = 'inactive';
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
    switch(this.state) {
      case 'recording': return false;
      case 'paused': {
        this.mediaRecorder.resume();
        this.state = 'recording';
        return true;
      }
      default: {
        this.data = [];
        this.mediaRecorder.start(1);
        this.state = 'recording';
        return true;
      }
    }
  }

  pause(): boolean {
    if (!this.mediaRecorder) throw new Error('audio recorder not prepared');
    if (this.state !== 'recording') return false;
    this.mediaRecorder.pause();
    this.state = 'paused';
    return true;
  }

  resume(): boolean {
    if (!this.mediaRecorder) throw new Error('audio recorder not prepared');
    if (this.state !== 'paused') return false;
    this.mediaRecorder.resume();
    this.state = 'recording';
    return true;
  }

  stop(): Blob | null {
    if (!this.mediaRecorder) throw new Error('audio recorder not prepared');
    if (this.state === 'inactive') return null;
    this.mediaRecorder.stop();
    this.state = 'inactive';
    return new Blob(this.data, {
      type: mimeType
    });
  }
}

const recorder = async (): Promise<AudioRecorder> => {
  try {
    const audioRecorder = new AudioRecorder();
    await audioRecorder.prepare();
    return audioRecorder;
  } catch(e) {
    return null;
  }
}

export default recorder;
export { AudioRecorder, mimeType };
