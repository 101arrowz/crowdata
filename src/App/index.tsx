import React from 'react';
import { ThemeProvider, Theme } from '@rmwc/theme';
import { RMWCProvider } from '@rmwc/provider';
import { DialogQueue } from '@rmwc/dialog';
import '@rmwc/button/styles';
import '@rmwc/textfield/styles';
import '@rmwc/dialog/styles';
import '@rmwc/select/styles';
import '@rmwc/typography/styles';
import '@rmwc/theme/styles';
import '@rmwc/linear-progress/styles';
import 'normalize.css';
import { useID } from '../util/globalState';
import { dialogs } from '../util/dialogQueue';
import Data from '../pages/data';
import Welcome from '../pages/welcome';

const App: React.FC = () => {
  const [id] = useID();
  return (
    <RMWCProvider
      typography={{
        headline6: ({ style, ...props }) => (
          <h6 style={{ fontSize: '2.2vh', lineHeight: 1.25, margin: 0, ...style }} {...props} />
        ),
        body2: ({ style, ...props }) => (
          <span style={{ fontSize: '1.7vh', lineHeight: 1.1, ...style }} {...props} />
        )
      }}
    >
      <ThemeProvider
        options={{
          background: 'lightblue'
        }}
        style={{
          display: 'flex',
          flex: 1
        }}
      >
        <Theme
          use="background"
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10%'
          }}
          tag="div"
        >
          <div
            style={{
              borderRadius: '3vw',
              backgroundColor: 'white',
              padding: '3vmin',
              display: 'flex',
              flex: 1,
              textAlign: 'center',
              height: '100%',
              width: '100%',
              overflow: 'hidden'
            }}
          >
            {id ? <Data /> : <Welcome />}
          </div>
        </Theme>
        <DialogQueue dialogs={dialogs} />
      </ThemeProvider>
    </RMWCProvider>
  );
};

export default App;
