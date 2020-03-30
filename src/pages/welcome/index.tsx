import React, { useState } from 'react';
import { Typography } from '@rmwc/typography';
import { LinearProgress } from '@rmwc/linear-progress';
import { infoPhrase } from '../../util/config';
import Options from './components/options';
import { useID } from '../../util/globalState';
import api from '../../util/api';

const Welcome: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [, setID] = useID();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '80vw',
        maxWidth: '120vh'
      }}
    >
      <Typography use="headline6" style={{ whiteSpace: 'pre-wrap' }}>
        {infoPhrase}
      </Typography>
      <Options
        onSubmit={async options => {
          const params = new URLSearchParams();
          for (const k in options) params.append(k, options[k]);
          setIsLoading(true);
          let res: { ok: false } | Response = { ok: false };
          try {
            res = await api('/id?' + params, { method: 'POST' });
          } catch (e) {}
          if (!res.ok) {
            setIsLoading(false);
            alert(
              'Something went wrong when registering you as a new contributor. Please try again later.'
            );
          } else setID(await res.text());
        }}
      />
    </div>
  );
};

export default Welcome;
