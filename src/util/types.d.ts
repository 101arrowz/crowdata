import React from 'react';

type DataPage = React.FC<{
  onComplete: (data: Blob) => Promise<void>;
}> & { type: string; };

type Options = [string, { [k: number]: string } | { [k: string]: string }][];

export { DataPage, Options };
