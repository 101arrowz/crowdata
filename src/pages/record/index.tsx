import React from 'react';
import { useID } from '../../util/globalState';
import RecordMenu from './components/recordMenu';
import upload from '../../util/upload';



const Record: React.FC<{ desiredConfig: string[], onComplete: () => unknown, prompt: React.ReactNode }> = ({ desiredConfig, onComplete, prompt }) => {
  const [id] = useID();
  return (
    <RecordMenu
      prompt={prompt}
      whileLoading='Loading...'
      onUpload={async file => {
        const ok = await upload('audio', file, desiredConfig, id);
        if (ok)
          onComplete();
        else
          alert('Something went wrong when uploading. Please try again.');
      }}
    />
  );
};
export default Record;