import React, { useState } from 'react';
import { Select } from '@rmwc/select';
import { Button } from '@rmwc/button';
import { TextField } from '@rmwc/textfield';
import { Typography } from '@rmwc/typography';
import { idOptions as idOptionsArr } from '../../../util/config';

const idOptions: typeof idOptionsArr = idOptionsArr.map(([key, val]) => [key, { ...val }]); // Fix Select functionality - array to object

type Option = [string, React.Dispatch<React.SetStateAction<string>>];
type ProcessedOptions = { [k: string]: string };

const Options: React.FC<{ onSubmit: (data: ProcessedOptions) => unknown }> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const options: { [k: string]: Option } = {};
  for (const [key] of idOptions) {
    options[key] = useState<string>('unselected');
  }
  const canSubmit = !!name && Object.values(options).every(([v]) => v !== 'unselected');
  return (
    <>
      {idOptions.map(([key, val]) => (
        <Select
          enhanced
          key={key}
          label={key}
          options={val}
          value={options[key][0]}
          onChange={({ currentTarget: { value } }) => options[key][1](value)}
          style={{ width: '100%' }}
          rootProps={{
            style: { width: '100%', maxWidth: '35vh', textAlign: 'left', marginBottom: '2vh' }
          }}
        />
      ))}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          marginBottom: '2vh'
        }}
      >
        <Typography use="body2" style={{ width: '100%' }}>
          By writing your full name below, you agree to the usage of the data you upload for
          research purposes.
          {idOptions.length
            ? ' You also agree that the data will be associated with your responses to the above fields.'
            : ''}{' '}
          (Your name will not be associated with any data you choose to upload.)
        </Typography>
        <TextField
          placeholder="Name"
          value={name}
          onInput={({ currentTarget: { value } }) => setName(value)}
          style={{ width: '100%', maxWidth: '45vh', marginTop: '1vh' }}
        />
      </div>
      <Button
        label="Start"
        disabled={!canSubmit}
        dense
        onClick={() => {
          const finalOptions: ProcessedOptions = {};
          for (const k in options) finalOptions[k] = options[k][0];
          finalOptions['name'] = name;
          onSubmit(finalOptions);
        }}
      />
    </>
  );
};
export default Options;
