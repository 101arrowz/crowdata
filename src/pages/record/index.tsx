import React, { useState, useEffect } from 'react';
import { Fab } from '@rmwc/fab';
import { DataPage } from '../../util/types';
import { alert } from '../../util/dialogQueue';
import { useRequestedAudioPermission } from '../../util/globalState';
import createRecorder, { AudioRecorder, supported as recordSupported } from './util/recordAudio';
import getAmplitude from './util/getAmplitude';
import AudioView from './components/audioView';
import Upload from '../../components/upload';

let record = recordSupported;

const recording = {} as Blob;

const Record: DataPage = ({ onComplete }) => {
  const [state, setState] = useState<Blob>(null);
  const [recorder, setRecorder] = useState<AudioRecorder>(null);
  const [amplitudeData, setAmplitudeData] = useState<number[]>([]);
  const [requestedAudioPermission, setRequestedAudioPermission] = useRequestedAudioPermission();
  useEffect(() => {
    if (recordSupported) {
      createRecorder().then(rec => {
        if (!(rec instanceof AudioRecorder)) {
          // User rejected our request :(
          if (!requestedAudioPermission) {
            alert({ title: 'Permission denied to record audio', body: `You'll need to upload an audio file or grant us permission if you'd like to contribute. Sorry! The error was: ${rec}` });
            setRequestedAudioPermission(true);
          } else {
            setAmplitudeData([]); // Just to rerender
          }
          record = false;
        } else {
          setRecorder(rec);
          setRequestedAudioPermission(false);
        }
      });
    }
  }, []);
  useEffect(() => {
    if (recorder) {
      recorder.onAmplitudeUpdate = ev => setAmplitudeData(amplitudeData.concat(ev));
      return () => (recorder.onAmplitudeUpdate = null);
    }
  });
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '40%' }}>
        <AudioView
          ampList={amplitudeData}
          secondsToDisplay={3}
          playback={state instanceof Blob && state}
        />
      </div>
      {record ? recorder ? (
        <>
          <Fab
            label="Start Recording"
            onClick={() => {
              recorder.start();
              setState(recording);
            }}
            style={state === null ? { backgroundColor: 'darkgreen', maxHeight: '10vh' } : { display: 'none' }}
          />
          <Fab
            label="Stop Recording"
            onClick={() => recorder.stop().then(aud => {
              setState(aud);
              setTimeout(() => setAmplitudeData([...amplitudeData]), 0)
            })}
            style={state === recording ? { backgroundColor: 'var(--mdc-theme-error)', maxHeight: '10vh' } : { display: 'none' }}
            theme={['onError']}
          />
        </>
      ) : (
        'Waiting for permission to use your microphone...'
      ) : (
        <Upload onFile={async file => {
          setAmplitudeData(await getAmplitude(file));
          setState(file);
        }} uploadType="audio/*" style={state == null ? {  } : { display: 'none' }}>
          <Fab
            label="Upload Recording"
            style={{ backgroundColor: 'darkgreen', maxHeight: '10vh' }}
          />
        </Upload>
      )}
      <div style={{ display: state instanceof Blob ? 'flex' : 'none', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Fab
          icon="thumb_up"
          label="Submit Recording"
          onClick={async () => {
            await onComplete(state);
            setState(null);
            setAmplitudeData([]);
          }}
          style={{ background: 'darkgreen', minWidth: '40%', margin: '0 auto', marginBottom: '2vh', maxHeight: '10vh' }}
        />
        <Fab
          icon="thumb_down"
          label="Re-Record"
          onClick={() => {
            setState(null);
            setAmplitudeData([]);
          }}
          style={{ backgroundColor: 'var(--mdc-theme-error)', minWidth: '40%', margin: '0 auto', marginBottom: '2vh', maxHeight: '10vh' }}
        />
      </div>
    </>
  );
};
Record.type = 'audio';
export default Record;
