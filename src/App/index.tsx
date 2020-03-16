import React from 'react';
import { useID } from '../util/globalState';
import Welcome from '../pages/welcome';
import Record from '../pages/record';
import './index.css';

const App: React.FC = () => {
  const [id] = useID();
  return id ? <Record /> : <Welcome />;
}

export default App;