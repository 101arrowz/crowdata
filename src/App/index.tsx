import React from 'react';
import { ThemeProvider } from '@rmwc/theme';
import '@rmwc/button/styles';
import '@rmwc/textfield/styles';
import '@rmwc/dialog/styles';
import '@rmwc/select/styles';
import '@rmwc/typography/styles';
import '@rmwc/theme/styles';
import { useID } from '../util/globalState';
import Data from '../pages/data';
import Welcome from '../pages/welcome';

const App: React.FC = () => {
  const [id] = useID();
  return (
    <ThemeProvider
      options={{
        background: 'lightblue'
      }}
    >
      <div
        style={{
          backgroundColor: 'lightskyblue',
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ borderRadius: '40px', backgroundColor: 'white', padding: '3vmin' }}>
          {id ? <Data /> : <Welcome />}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
