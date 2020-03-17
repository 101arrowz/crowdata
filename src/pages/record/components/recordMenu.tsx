import React, { useState, useEffect } from 'react';
import createRecorder, { AudioRecorder, supported as recordSupported } from '../../../util/recordAudio';
import AudioPlayer from './audioPlayer';
import Upload from '../../../components/upload';

const RecordMenu: React.FC<{ onUpload: (data: Blob) => unknown, prompt: React.ReactNode, whileLoading?: React.ReactNode, whileUploading?: React.ReactNode }> = ({ onUpload, prompt, whileLoading = null, whileUploading = whileLoading }) => {
  const [state, setState] = useState<Blob | 'recording' | 'uploading' | null>(null);
  const [recorder, setRecorder] = useState<AudioRecorder>(null);
  useEffect(() => {
    if (recordSupported)
      createRecorder().then(setRecorder);
  }, []);
  return (
    <>
      {prompt}
      {recordSupported ? recorder ? recorder.state === 'inactive' ?
        state instanceof Blob ? (
          <>
            <button
              onClick={async () => {
                setState('uploading');
                await onUpload(state);
                setState(null);
              }}
              style={{ color: 'green' }}
            >
              Upload
            </button>
            <AudioPlayer audio={state} whilePlaying='Stop playing'>Play Recorded Sample</AudioPlayer>
            <button onClick={(): void => setState(null)} style={{ color: 'red' }}>Re-Record</button>
          </>
        ) : state === 'uploading' ? whileUploading : (
          <>
            <button onClick={() => {
              recorder.start();
              setState('recording');
            }}>Start Recording</button>
          </>
        ) : (
          <>
            <button onClick={() => recorder.stop().then(setState)}>Stop Recording</button>
          </>
        ) : (
          whileLoading
        ) : state instanceof Blob ? (
          <>
            <button
              onClick={async () => {
                setState('uploading');
                await onUpload(state);
                setState(null);
              }}
              style={{ color: 'green' }}
            >
              Upload
            </button>
            <AudioPlayer audio={state} whilePlaying='Stop playing'>Play Sample</AudioPlayer>
            <button onClick={(): void => setState(null)} style={{ color: 'red' }}>Select Different File</button>
          </>
        ) : (
          <Upload onFile={setState} uploadType='audio/*'>Upload Recording</Upload>
        )
      }
    </>
  );
}
export default RecordMenu;