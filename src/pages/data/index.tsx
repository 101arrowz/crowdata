import React, { useState, useEffect } from 'react';
import { Typography } from '@rmwc/typography';
import { Transition } from 'react-transition-group';
import { LinearProgress } from '@rmwc/linear-progress';
import { useGlobal } from '../../util/globalState';
import { alert } from '../../util/dialogQueue';
import upload from '../../util/upload';
import configs, { sourceConfigs, CollectionPage, desiredRatio } from '../../util/config';

const chooseRandom = <T,>(vals: T[]): T => vals[Math.floor(Math.random() * vals.length)];
const timeout = 300;

const Data: React.FC = () => {
  const {
    id: [id],
    completed: [completed, setCompleted]
  } = useGlobal(['id', 'completed']);
  const possibleConfigs = configs.filter(conf =>
    completed.every(val => !val.every((v, i) => conf[i] === v))
  );
  const [desiredConfig, setDesiredConfig] = useState(() => chooseRandom(possibleConfigs));
  const [isLoading, setIsLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  useEffect(() => {
    if (possibleConfigs.length === 0) {
      alert({
        title: `You've completed all ${completed.length} of the data points!`,
        body: `Thank you so much! If you'd like, you could repeat some of the previous datapoints to help our research even more!`
      });
      setCompleted([]);
    } else {
      if (completed.length === Math.floor(configs.length * desiredRatio))
        alert({
          title: `You've completed ${completed.length} of the data points!`,
          body: `Thank you for your contributions! If you'd like to help even more, do the other ${possibleConfigs.length} datapoints!`
        });
      setDesiredConfig(chooseRandom(possibleConfigs));
    }
  }, [completed]);
  return (
    <Transition
      in={!complete}
      timeout={timeout}
      children={state => (
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            transform:
              state === 'exiting'
                ? 'translateX(-100%)'
                : state === 'entering'
                ? 'translateX(100%)'
                : '',
            transition: state === 'entering' ? '' : `transform ${timeout}ms ease-in-out`
          }}
        >
          <LinearProgress
            style={{ position: 'fixed', top: 0, left: 0, textAlign: 'left', display: complete ? 'none' : 'block' }}
            closed={!isLoading}
          />
          <Typography use="body2" style={{ marginBottom: '2vh' }}>
            {completed.length + 1} of {configs.length}

          </Typography>
          {desiredConfig.map((v, i) => (
            <Typography use="headline6" key={i} style={{ marginBottom: '2vh' }}>
              <span>{sourceConfigs[i][0] + ': '}</span>
              <span style={{ fontWeight: 'bold' }}>{sourceConfigs[i][1][v]}</span>
            </Typography>
          ))}
          <CollectionPage
            onComplete={async data => {
              setIsLoading(true);
              try {
                await upload(CollectionPage.type, data, desiredConfig, id);
              } catch (e) {
                if (!('SyncManager' in window)) {
                  alert({ title: 'Upload failed', body: 'Submitting that data point failed. Are you offline? Please try again later.' })
                  return;
                }
              }
              setIsLoading(false);
              setComplete(true);
              return new Promise(res => setTimeout(res, timeout));
            }}
          />
        </div>
      )}
      onExited={() => {
        setCompleted(completed.concat([desiredConfig]));
        setComplete(false);
      }}
    />
  );
};

export default Data;
