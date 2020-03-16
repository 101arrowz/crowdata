import React from 'react';
import { infoPhrase } from '../../util/config';
import Options from './components/options';

const Welcome: React.FC = () => {
  return (
    <>
      <div>{infoPhrase}</div>
      <Options whileLoading={<div>Loading...</div>} />
    </>
  )
}

export default Welcome