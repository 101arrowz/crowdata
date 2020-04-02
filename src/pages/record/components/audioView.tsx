import React, { useState, useRef, useEffect } from 'react';
import { IconButton } from '@rmwc/icon-button';

const AudioView: React.FC<{
  ampList: number[];
  secondsToDisplay?: number;
  playback?: Blob;
  style?: React.CSSProperties
}> = ({ ampList, secondsToDisplay, playback, style }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [audio, setAudio] = useState<HTMLAudioElement>(null);
  const [, update] = useState(0);
  const forceUpdate = (): void => update(Date.now());
  const handleCanvasAction = (clientX: number): void => {
    if (!audio) return;
    const { left, width } = canvas.current.getBoundingClientRect();
    audio.currentTime = ((clientX - left) / width) * audio.duration;
    setTimeout(forceUpdate, 0);
  };
  const handleCanvasClick = ({ buttons, clientX }: React.MouseEvent<HTMLCanvasElement>): void => {
    if (buttons % 2) handleCanvasAction(clientX);
  };
  const updateDimensions = (): { height: number; width: number, strokeStyle: string } => {
    canvas.current.removeAttribute('height');
    canvas.current.removeAttribute('width');
    const style = getComputedStyle(canvas.current);
    const { height: strHeight, width: strWidth } = style;
    const height = parseFloat(strHeight),
      width = parseFloat(strWidth);
    canvas.current.height = height;
    canvas.current.width = width;
    return { height, width, strokeStyle: style.getPropertyValue('--mdc-theme-text-primary-on-light') };
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
          };
        } else {
          setAudio(aud);
        }
      };
    } else {
      setAudio(null);
    }
  }, [playback]);
  useEffect(() => {
    const { height, width, strokeStyle } = updateDimensions();
    const ctx = canvas.current.getContext('2d');
    ctx.strokeStyle = strokeStyle;
    const numSamples = playback ? ampList.length : secondsToDisplay * 75 || width;
    const h2 = height / 2;
    for (let x = 0; x < width; x++) {
      const nearMagInd = ((x - width) * numSamples) / width + ampList.length;
      const mag = ampList[Math.floor(nearMagInd)] || 0;
      ctx.beginPath();
      ctx.moveTo(x, Math.floor(h2 * (1 - mag)));
      ctx.lineTo(x, Math.floor(h2 * (1 + mag) + 1));
      ctx.stroke();
    }
    if (audio && audio.duration && audio.duration !== audio.currentTime) {
      const x = Math.floor((audio.currentTime / audio.duration) * width);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      if (!audio.paused) setTimeout(forceUpdate, 35);
    }
  }, [Math.floor((Date.now() * 3) / 100)]);
  useEffect(() => {
    window.addEventListener('resize', forceUpdate);
    return () => window.removeEventListener('resize', forceUpdate);
  });
  useEffect(() => {
    if (audio) {
      const cb = (): void => {
        audio.removeEventListener('ended', cb);
        forceUpdate();
      };
      audio.addEventListener('ended', cb);
    }
  });
  return (
    <>
      <canvas
        ref={canvas}
        tabIndex={0}
        style={{ ...style, flex: 1, width: '100%', outline: 'none' }}
        onMouseDown={handleCanvasClick}
        onMouseMove={handleCanvasClick}
        onTouchStart={e => {
          if (!audio) return;
          e.preventDefault();
          handleCanvasAction(e.touches[0].clientX);
        }}
        onTouchMove={e => {
          if (!audio) return;
          e.preventDefault();
          handleCanvasAction(e.touches[0].clientX);
        }}
        onKeyDown={({ key, which }) => {
          if (key ? [' ', 'Spacebar'].includes(key) : which === 32) {
            if (audio.currentTime && !audio.paused) {
              audio.pause();
              forceUpdate();
            } else {
              audio.play();
              forceUpdate();
            }
          }
        }}
      />
      {audio && (
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '70%',
            marginTop: '2vh'
          }}
        >
          {audio.currentTime && !audio.paused ? (
            <IconButton
              label="Pause"
              icon="pause"
              onClick={() => {
                audio.pause();
                forceUpdate();
              }}
              style={{ fontSize: '2.5rem', width: 'unset', height: 'unset' }}
            />
          ) : (
            <IconButton
              label="Play"
              icon="play_arrow"
              onClick={() => {
                audio.play();
                forceUpdate();
              }}
              style={{ fontSize: '2.5rem', width: 'unset', height: 'unset' }}
            />
          )}
          <IconButton
            label="Stop"
            icon="stop"
            disabled={!audio.currentTime || audio.paused}
            onClick={() => {
              audio.pause();
              audio.currentTime = 0;
              forceUpdate();
            }}
            style={{ fontSize: '2.5rem', width: 'unset', height: 'unset' }}
          />
        </div>
      )}
    </>
  );
};
export default AudioView;
