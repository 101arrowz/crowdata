import React, { useState } from 'react';
import { Transition } from 'react-transition-group';
import { Typography } from '@rmwc/typography';
import { LinearProgress } from '@rmwc/linear-progress';
import { infoPhrase } from '../../util/config';
import Options from './components/options';
import { useID } from '../../util/globalState';
import { alert } from '../../util/dialogQueue';
import api from '../../util/api';

const timeout = 300;

const Welcome: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [localID, setLocalID] = useState('');
  const [, setID] = useID();
  return (
    <Transition in={!localID} timeout={timeout} children={state => (
      <div style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: state === 'entering' ? 0 : 1,
        transform: state === 'exiting' ? 'translateX(-100%)' : '',
        transition: `opacity ${timeout}ms ease-in-out, transform ${timeout}ms ease-in-out`
      }}>
        <LinearProgress style={{ position: 'fixed', top: 0, left: 0, textAlign: 'left' }} closed={!isLoading} />
        {infoPhrase.split('\n').map((txt, i) => (
          <Typography use="headline6" key={i} style={{ marginBottom: '2vh' }}>
            {txt}
          </Typography>
        ))}
        <Options
          onSubmit={async options => {
            const params = new URLSearchParams(options);
            setIsLoading(true);
            let res: { ok: false } | Response = { ok: false };
            try {
              res = await api('/id?' + params, { method: 'POST' });
            } catch (e) {}
            setIsLoading(false);
            if (!res.ok) {
              await alert({ title: 'Registration failed', body: 'Something went wrong when registering you as a new contributor. Please try again later.' });
            } else setLocalID(await res.text());
          }} 
        />
      </div>
    )} appear onExited={() => setID(localID)} />
  );
};

export default Welcome;
