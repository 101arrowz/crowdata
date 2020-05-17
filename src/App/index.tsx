import React from 'react';
import { ThemeProvider } from '@rmwc/theme';
import { RMWCProvider } from '@rmwc/provider';
import { DialogQueue } from '@rmwc/dialog';
import '@rmwc/button/styles';
import '@rmwc/textfield/styles';
import '@rmwc/dialog/styles';
import '@rmwc/select/styles';
import '@rmwc/typography/styles';
import '@rmwc/theme/styles';
import '@rmwc/linear-progress/styles';
import '@rmwc/fab/styles';
import '@rmwc/icon-button/styles';
import 'normalize.css';
import { useGlobal } from '../util/globalState';
import { dialogs } from '../util/dialogQueue';
import Data from '../pages/data';
import Welcome from '../pages/welcome';

const App = () => {
  const [id] = useGlobal.id();
  return (
    <RMWCProvider
      typography={{
        headline6: ({ style, ...props }) => (
          <h6 style={{ fontSize: '3vh', lineHeight: 1.25, margin: 0, ...style }} {...props} />
        ),
        body1: ({ style, ...props }) => (
          <span style={{ fontSize: '2.2vh', lineHeight: 1.2, ...style }} {...props} />
        ),
        body2: ({ style, ...props }) => (
          <span style={{ fontSize: '1.7vh', lineHeight: 1.1, ...style }} {...props} />
        )
      }}
    >
      <ThemeProvider
        options={{
          primary: '#ff5121',
          secondary: '#e539ff',
          error: '#b00020',        
          background: '#24aee9',
          textPrimaryOnDark: '#404040'
        }}
        style={{
          display: 'block',
          flex: 1,
          padding: '10vmin'
        }}
        theme={'background'}
      >
        <div
          style={{
            borderRadius: '3vw',
            backgroundColor: 'white',
            padding: '7vmin',
            display: 'flex',
            width: 'calc(100% - 14vmin)',
            height: 'calc(100% - 14vmin)',
            textAlign: 'center',
            overflow: 'hidden'
          }}
        >
          {id ? <Data /> : <Welcome />}
        </div>
        <DialogQueue dialogs={dialogs} />
      </ThemeProvider>
    </RMWCProvider>
  );
};

export default App;
