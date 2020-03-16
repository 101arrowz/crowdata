import React, { useState } from 'react';
import { idOptions } from '../../../util/config';
import { useID } from '../../../util/globalState';
import api from '../../../util/api';

type Option = [string, React.Dispatch<React.SetStateAction<string>>];

const Options: React.FC<{ whileLoading?: React.ReactNode }> = ({ whileLoading = null }) => {
  const [, setID] = useID();
  const [isLoading, setIsLoading] = useState(false);
  const options: { [k: string]: Option } = {};
  for (let [name] of idOptions) {
    options[name] = useState('unselected');
  }
  let canSubmit = true;
  for (let k in options) {
    if (options[k][0] === 'unselected') {
      canSubmit = false;
      break;
    }
  }
  return !isLoading ? (
    <>
      {idOptions.map(([name, val]) => (
          <div>
            <label>{name}:</label>
            <select value={options[name][0]} onChange={({ target: { value } }) => options[name][1](value)}>
              <option value='unselected'>Select an option</option>
              {Object.keys(val).map(opt => <option value={opt}>{val[opt]}</option>)}
            </select>
          </div>
        ))}
      <button disabled={!canSubmit} onClick={async () => {
        if (!canSubmit)
          return;
        const params = new URLSearchParams();
        for (let k in options)
          params.append(k, options[k][0]);
        setIsLoading(true);
        let res: { ok: false } | Response = { ok: false };
        try { res = await api('/id?'+params, { method: 'POST' }); } catch(e) {}
        if (!res.ok) {
          setIsLoading(false);
          alert('Something went wrong when registering you as a new contributor. Please try again later.');
        } else setID(await res.text());
      }}>Start</button>
    </>
  ) : <>{whileLoading}</>;
}
export default Options;