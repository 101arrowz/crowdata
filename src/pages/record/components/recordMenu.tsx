import React, { useState, useEffect, useRef } from 'react';
import createRecorder, { AudioRecorder, mimeType } from '../../../util/recordAudio';
import AudioPlayer from './audioPlayer';
import Upload from '../../../components/upload';

const recordSupported = !!mimeType;

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
            <button onClick={() => setState(recorder.stop())}>Stop Recording</button>
          </>
        ) : (
          whileLoading
        ) : (
          <Upload onFile={setState} uploadType='audio/*'>Upload Recording</Upload>
        )
      }
    </>
  );
}
export default RecordMenu;