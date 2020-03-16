import React, { useState, useEffect, useRef } from 'react';

const AudioPlayer: React.FC<{ audio: Blob, whilePlaying?: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ audio, children, whilePlaying, onClick, ...props }) => {
  const el = useRef<HTMLAudioElement>();
  useEffect(() => {
    el.current = new Audio(URL.createObjectURL(audio));
    el.current.addEventListener('ended', () => setIsPlaying(false));
  }, [audio])
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <button onClick={e => {
      if (isPlaying) {
        el.current.pause();
        el.current.currentTime = 0;
      } else {
        el.current.play();
      }
      setIsPlaying(!isPlaying);
      if (onClick)
        onClick(e);
    }} {...props}>
      {isPlaying ? whilePlaying || children : children}
    </button>
  );
}
export default AudioPlayer;