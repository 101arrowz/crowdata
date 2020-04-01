import React, { useState, useRef, useEffect } from 'react';

const WaveformCanvas: React.FC<{
  ampList: number[];
  secondsToDisplay?: number;
  playback?: Blob;
}> = ({
  ampList,
  secondsToDisplay,
  playback
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [audio, setAudio] = useState<HTMLAudioElement>(null);
  const [_, update] = useState(false);
  const forceUpdate = () => update(!_);
  const updateOnEnd = () => {
    const cb = () => {
      audio.removeEventListener('ended', cb);
      forceUpdate();
    }
    audio.addEventListener('ended', cb);
  }
  const handleCanvasClick = (clientX: number): void => {
    if (!audio)
      return;
    const { left, width } = canvas.current.getBoundingClientRect();
    audio.currentTime = ((clientX - left) / width) * audio.duration;
    forceUpdate();
  };
  useEffect(() => {
    if (playback) {
      const aud = new Audio(URL.createObjectURL(playback));
      aud.onloadedmetadata = () => {
        // Chrome is dumb
        if (aud.duration === Infinity) {
          aud.currentTime = 9007199254740991;
          aud.ontimeupdate = () => {
            aud.ontimeupdate = null;
            aud.currentTime = 0.1;
            aud.currentTime = 0;
            setAudio(aud);
          }
        } else {
          setAudio(aud);
        }
      }
    }
  }, [playback]);
  useEffect(() => {
    canvas.current.removeAttribute('height');
    canvas.current.removeAttribute('width');
    const { height: strHeight, width: strWidth } = getComputedStyle(canvas.current);
    const height = parseFloat(strHeight), width = parseFloat(strWidth);
    canvas.current.height = height;
    canvas.current.width = width;
    const ctx = canvas.current.getContext('2d');
    const numSamples = playback ? ampList.length : secondsToDisplay * 150 || width;
    ctx.clearRect(0, 0, width, height);
    const h2 = height / 2;
    for (let x = 0; x < width; x++) {
      const nearMagInd = (x - width) * numSamples / width + ampList.length;
      const mag = ampList[Math.floor(nearMagInd)] || 0;
      ctx.beginPath();
      ctx.moveTo(x, Math.ceil(h2 * (1 - mag) - 1));
      ctx.lineTo(x, Math.floor(h2 * (1 + mag) + 1));
      ctx.stroke();
    }
    if (audio && audio.duration && audio.duration !== audio.currentTime) {
      const x = Math.floor(audio.currentTime / audio.duration * width);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      if (!audio.paused)
        setTimeout(forceUpdate, 35);
    }
  }, [Math.floor(Date.now() * 3 / 100)]);
  useEffect(() => {
    if (audio)
      updateOnEnd();
  });
  return (
    <>
      <canvas ref={canvas} style={{ flex: 1 }} onMouseDown={({ clientX }) => handleCanvasClick(clientX)} onMouseMove={({ buttons, clientX }) => {
        if (buttons % 2 === 1)
          handleCanvasClick(clientX);
      }} onTouchMove={({ touches: { 0: { clientX } } }) => {
        handleCanvasClick(clientX);
      }} />
      {audio && (
        <>
          {audio.currentTime && !audio.paused ? (<button onClick={() => {
            audio.pause();
            forceUpdate();
          }}>Pause</button>) : <button onClick={() => {
            audio.play().then(forceUpdate);
          }}>Play</button>}
          <button disabled={!audio.currentTime || audio.paused} onClick={() => {
            audio.pause();
            audio.currentTime = 0;
            forceUpdate()
          }}>Stop</button>
        </>
      )}
    </>
  )
};
export default WaveformCanvas;
