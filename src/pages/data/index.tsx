import React, { useState, useEffect } from 'react';
import { useID, useCompleted } from '../../util/globalState';
import upload from '../../util/upload';
import configs, { sourceConfigs, CollectionPage, desiredRatio } from '../../util/config';

const chooseRandom = <T,>(vals: T[]): T => vals[Math.floor(Math.random() * vals.length)];

const Data: React.FC = () => {
  const [id] = useID();
  const [completed, setCompleted] = useCompleted();
  const possibleConfigs = configs.filter(conf =>
    completed.every(val => !val.every((v, i) => conf[i] === v))
  );
  const [desiredConfig, setDesiredConfig] = useState(() => chooseRandom(possibleConfigs));
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (possibleConfigs.length === 0) {
      alert(
        `You've finished all ${completed.length} of the recording samples. Thank you so much! (If you'd like you can do some more, and you'll help our research even more!)`
      );
      setCompleted([]);
    } else {
      if (completed.length === Math.floor(configs.length * desiredRatio))
        alert(
          `You've finished ${completed.length} recording samples. Thank you for your contributions! If you'd like to help even more, do ${possibleConfigs.length} more!`
        );
      setDesiredConfig(chooseRandom(possibleConfigs));
    }
  }, [completed]);
  return !isLoading ? (
    <>
      {completed.length + 1} of {configs.length}
      {desiredConfig.map((v, i) => (
        <div key={i}>
          <span>{sourceConfigs[i][0] + ': '}</span>
          <span style={{ fontWeight: 'bold' }}>{sourceConfigs[i][1][v]}</span>
        </div>
      ))}
      <CollectionPage
        onComplete={async data => {
          setIsLoading(true);
          await upload(CollectionPage.type, data, desiredConfig, id);
          setIsLoading(false);
          setCompleted(completed.concat([desiredConfig]));
        }}
      />
    </>
  ) : (
    <>Loading...</>
  );
};

export default Data;
