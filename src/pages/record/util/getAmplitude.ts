function getAmplitude(data: Blob): Promise<number[]> {
  const ctx = new AudioContext();
  const fileReader = new FileReader();
  return new Promise(res => {
    fileReader.onloadend = () => {
      ctx.decodeAudioData(fileReader.result as ArrayBuffer, audio => {
        const dat = audio.getChannelData(0);
        const amps: number[] = [];
        for (let i = 0; i < dat.length; i += 256) {
          let sumSquareAmp = 0;
          const sub = dat.subarray(i, i + 256);
          for (const amp of sub) sumSquareAmp += amp * amp;
          const amp = Math.sqrt(sumSquareAmp / sub.length);
          amps.push(amp);
        }
        res(amps);
      });
    }
    fileReader.readAsArrayBuffer(data);
  });
}
export default getAmplitude;