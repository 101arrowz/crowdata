import React, { useState, useEffect, useRef } from 'react';
import recorder, { isSupported } from '../util/recordAudio';
import { useSex, useID, useCompleted } from '../util/globalState';
import configs, { sourceConfigs, infoPhrase,desiredRatio } from './configs';
import './index.css';

const upload = (data: Blob, params: { [k: string]: string }): Promise<Response> => {
  const body = new FormData();
  body.append('audio', data);
  for (const k in params) {
    body.append(k, params[k]);
  }
  return fetch('/api/submitRecording', { method: 'POST', body });
};

const chooseRandom = <T,>(vals: T[]): T => vals[Math.floor(Math.random() * vals.length)];
let initConfig: number[];

// TODO: Attribute Freepik
const App: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean | null>(false);
  const [completed, setCompleted] = useCompleted();
  const possibleConfigs = configs.filter(conf =>
    completed.every(val => !val.every((v, i) => conf[i] === v))
  );
  if (!initConfig) {
    if (possibleConfigs.length === 0) setCompleted([]);
    else initConfig = chooseRandom(possibleConfigs);
  }
  const [lastRecordedSample, setLastRecordedSample] = useState<Blob>(null);
  const [desiredConfig, setDesiredConfig] = useState<number[]>(initConfig);
  const [sex, setSex] = useSex();
  const [id, setID] = useID();
  useEffect(() => {
    if (isRecording) {
      recorder.start();
    } else {
      recorder.stop().then(setLastRecordedSample);
    }
  }, [isRecording]);
  useEffect(() => {
    if (!id && sex !== null)
      fetch(`/api/id?sex=${sex}`)
        .then(res => res.text())
        .then(setID);
  }, [sex]);
  useEffect(() => {
    if (possibleConfigs.length === 0) {
      alert(`You've finished all ${completed.length} of the recording samples. Thank you so much! (If you'd like you can do some more, and you'll help our research even more!)`);
      setCompleted([]);
    }
    else {
      if (completed.length === Math.floor(configs.length * desiredRatio))
        alert(`You've finished ${completed.length} recording samples. Thank you for your contributions! If you'd like to help even more, do ${possibleConfigs.length} more!`)
      setDesiredConfig(chooseRandom(possibleConfigs));
    }
  }, [completed]);
  return (
    <>
      {sex === null ? (
        <>
          <div>{infoPhrase}</div>
          <button onClick={(): void => setSex(0)}>Male</button>
          <button onClick={(): void => setSex(1)}>Female</button>
          <button onClick={(): void => setSex(2)}>N/A / Remain undisclosed</button>
        </>
      ) : isSupported ? (
        <>
          {completed.length + 1} of {configs.length}
          {desiredConfig.map((v, i) => <div><span>{sourceConfigs[i][0] + ': '}</span><span style={{ fontWeight: 'bold' }}>{sourceConfigs[i][1][v]}</span></div>)}
          {lastRecordedSample ? (
            <>
              <button
                onClick={async (): Promise<void> => {
                  await upload(lastRecordedSample, { id, dataStr: desiredConfig.join('-') });
                  setLastRecordedSample(null);
                  setCompleted(completed.concat([desiredConfig]));
                }}
                style={{ color: 'green' }}
              >
                Upload
              </button>
              <button
                onClick={(): void => {
                  const audio = new Audio(URL.createObjectURL(lastRecordedSample));
                  audio.play();
                }}
              >
                Play recorded sample
              </button>
              <button onClick={(): void => setLastRecordedSample(null)} style={{ color: 'red' }}>Re-record</button>
            </>
          ) : (
            <>
              <button style={{ color: isRecording ? 'red' : 'green' }} onClick={(): void => setIsRecording(!isRecording)}>
                {isRecording ? 'Stop recording' : 'Start recording'}
              </button>
              {isRecording ? null : <button style={{ color: 'red' }} onClick={(): void => setDesiredConfig(chooseRandom(possibleConfigs))}>
                Skip
              </button>}
            </>
          )}
        </>
        ) : (
        <div>
          We can't record audio on your device. We're working on adding upload support. Sorry :(
        </div>
      )}
    </>
  );
};
export default App;
