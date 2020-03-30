import React, { useState, useEffect } from 'react';
import { DataPage } from '../../util/types';
import createRecorder, {
  AudioRecorder,
  supported as recordSupported
} from '../../util/recordAudio';
import AudioPlayer from './components/audioPlayer';
import Upload from '../../components/upload';

const Record: DataPage = ({ onComplete }) => {
  const [state, setState] = useState<Blob>(null);
  const [recorder, setRecorder] = useState<AudioRecorder>(null);
  useEffect(() => {
    if (recordSupported) createRecorder().then(setRecorder);
  }, []);
  return (
    <>
      {recordSupported ? (
        recorder ? (
          state === null ? (
            <>
              <button onClick={() => recorder.stop().then(setState)} style={{ color: 'red' }}>
                Stop Recording
              </button>
            </>
          ) : (
            <>
              <button
                onClick={async () => {
                  onComplete(state);
                }}
                style={{ color: 'green' }}
              >
                Upload
              </button>
              <AudioPlayer audio={state} whilePlaying="Stop playing">
                Play Recorded Sample
              </AudioPlayer>
              <button onClick={(): void => setState(null)} style={{ color: 'red' }}>
                Re-Record
              </button>
            </>
          )
        ) : (
          'Loading...'
        )
      ) : state === null ? (
        <Upload onFile={setState} uploadType="audio/*">
          Upload Recording
        </Upload>
      ) : (
        <>
          <button
            onClick={async () => {
              onComplete(state);
            }}
            style={{ color: 'green' }}
          >
            Upload
          </button>
          <AudioPlayer audio={state} whilePlaying="Stop playing">
            Play Sample
          </AudioPlayer>
          <button onClick={(): void => setState(null)} style={{ color: 'red' }}>
            Select Different File
          </button>
        </>
      )}
    </>
  );
};
Record.type = 'audio';
export default Record;
