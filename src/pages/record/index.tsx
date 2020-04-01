import React, { useState, useEffect } from 'react';
import { DataPage } from '../../util/types';
import createRecorder, {
  AudioRecorder,
  supported as recordSupported
} from './util/recordAudio';
import AudioPlayer from './components/audioPlayer';
import AudioView from './components/audioView';
import Upload from '../../components/upload';

const recording = {} as Blob;

const Record: DataPage = ({ onComplete }) => {
  const [state, setState] = useState<Blob>(null);
  const [recorder, setRecorder] = useState<AudioRecorder>(null);
  const [amplitudeData, setAmplitudeData] = useState<number[]>([]);
  useEffect(() => {
    if (recordSupported) {
      createRecorder().then(recorder => {
        setRecorder(recorder);
      });
    }
  }, []);
  useEffect(() => {
    if (state === null)
      setAmplitudeData([]);
  }, [state])
  useEffect(() => {
    if (recorder) {
      recorder.onAmplitudeUpdate = ev => setAmplitudeData(amplitudeData.concat(ev));
      return () => recorder.onAmplitudeUpdate = null;
    }
  })
  return (
    <>
      {recordSupported ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '40%' }}>
            <AudioView ampList={amplitudeData} secondsToDisplay={3} playback={state instanceof Blob && state} />
          </div>
          {recorder ? (
            state === recording ? (
                <>
                  <button onClick={() => recorder.stop().then(setState)} style={{ color: 'red' }}>
                    Stop Recording
                  </button>
                </>
              ) : state === null ? (
                <>
                  <button onClick={() => {

                    recorder.start();
                    setState(recording);
                  }} style={{ color: 'green' }}>
                    Start Recording
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={async () => {
                      await onComplete(state);
                      setState(null);
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
          )}
        </>
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
