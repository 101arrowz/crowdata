import React, { useState, useEffect } from 'react';
import { useID, useCompleted } from '../util/globalState';
import configs, { sourceConfigs, desiredRatio } from '../util/config';
import Welcome from '../pages/welcome';
import Record from '../pages/record';
import './index.css';

const chooseRandom = <T,>(vals: T[]): T => vals[Math.floor(Math.random() * vals.length)];

const App: React.FC = () => {
  const [completed, setCompleted] = useCompleted();
  const possibleConfigs = configs.filter(conf =>
    completed.every(val => !val.every((v, i) => conf[i] === v))
  );
  const [desiredConfig, setDesiredConfig] = useState<string[]>(() => chooseRandom(possibleConfigs));
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
  const [id] = useID();
  return id ? <Record desiredConfig={desiredConfig} prompt={
    <>
      {completed.length + 1} of {configs.length}
      {desiredConfig.map((v, i) => <div><span>{sourceConfigs[i][0] + ': '}</span><span style={{ fontWeight: 'bold' }}>{sourceConfigs[i][1][v]}</span></div>)}
    </>
  } onComplete={() => setCompleted(completed.concat([desiredConfig]))} /> : <Welcome />;
}

export default App;