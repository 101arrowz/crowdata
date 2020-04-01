import React, { useState, useEffect } from 'react';
import { Transition } from 'react-transition-group';
import { LinearProgress } from '@rmwc/linear-progress';
import { useID, useCompleted } from '../../util/globalState';
import upload from '../../util/upload';
import configs, { sourceConfigs, CollectionPage, desiredRatio } from '../../util/config';

const chooseRandom = <T,>(vals: T[]): T => vals[Math.floor(Math.random() * vals.length)];
const timeout = 300;

const Data: React.FC = () => {
  const [id] = useID();
  const [completed, setCompleted] = useCompleted();
  const possibleConfigs = configs.filter(conf =>
    completed.every(val => !val.every((v, i) => conf[i] === v))
  );
  const [desiredConfig, setDesiredConfig] = useState(() => chooseRandom(possibleConfigs));
  const [isLoading, setIsLoading] = useState(false);
  const [complete, setComplete] = useState(false);
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
  return (
    <Transition in={!complete} timeout={timeout} children={state => (
      <div style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        transform: state === 'exiting' ? 'translateX(-100%)' : state === 'entering' ? 'translateX(100%)' : '',
        transition: state === 'entering' ? '' : `transform ${timeout}ms ease-in-out`
      }}>
        <LinearProgress style={{ position: 'fixed', top: 0, left: 0, textAlign: 'left' }} closed={!isLoading} />
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
            setComplete(true);
            return new Promise(res => setTimeout(res, timeout));
          }}
        />
      </div>
    )} onExited={() => {
      setCompleted(completed.concat([desiredConfig]));
      setComplete(false);
    }} />
  )
};

export default Data;
