import React, { useState, useEffect } from 'react';
import { useID, useCompleted } from '../../util/globalState';
import configs, { sourceConfigs, desiredRatio } from '../../util/config';
import RecordMenu from './components/recordMenu';
import upload from '../../util/upload';

const chooseRandom = <T,>(vals: T[]): T => vals[Math.floor(Math.random() * vals.length)];


const Record: React.FC = () => {
  const [completed, setCompleted] = useCompleted();
  const possibleConfigs = configs.filter(conf =>
    completed.every(val => !val.every((v, i) => conf[i] === v))
  );
  const [desiredConfig, setDesiredConfig] = useState<string[]>(() => chooseRandom(possibleConfigs));
  const [id] = useID();
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
    <RecordMenu
      prompt={
        <>
          {completed.length + 1} of {configs.length}
          {desiredConfig.map((v, i) => <div><span>{sourceConfigs[i][0] + ': '}</span><span style={{ fontWeight: 'bold' }}>{sourceConfigs[i][1][v]}</span></div>)}
        </>
      }
      whileLoading='Loading...'
      onUpload={async file => {
        const ok = await upload('audio', file, desiredConfig, id);
        if (ok)
          setCompleted(completed.concat([desiredConfig]));
        else
          alert('Something went wrong when uploading. Please try again.');
      }}
    />
  );
};
export default Record;