import React, { useRef } from 'react';
import './index.css';

const Upload: React.FC<{ uploadType: string, onFile: (data: File) => unknown } & React.HTMLAttributes<HTMLDivElement>> = ({ uploadType, onFile, style, onDragEnter, onDragLeave, onDrop, onClick, ...props }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const process = (files: FileList): File | void => {
    if (files.length === 0)
      return;
    if (files.length > 1)
      return alert('Too many files! Please submit only one.');
    const file = files[0];
    const isValid = uploadType.includes('.') ? new RegExp('(' + uploadType.replace(/,/g, '|') + ')$').test(file.name) : new RegExp(uploadType).test(file.type)
    if (!isValid)
      return alert('Invalid file type!');
    return file;
  }
  return (
    <>
      <div
        onDragEnter={e => {
          e.preventDefault();
          if (e.dataTransfer.files.length === 1)
            divRef.current.classList.add('highlight');
          if (onDragEnter)
            onDragEnter(e);
        }}
        onDragLeave={e => {
          e.preventDefault();
          divRef.current.classList.remove('highlight');
          if (onDragLeave)
            onDragLeave(e);
        }}
        onDrop={e => {
          e.preventDefault();
          const file = process(e.dataTransfer.files);
          if (file)
            onFile(file);
          if (onDrop)
            onDrop(e);
        }}
        onClick={e => {
          inputRef.current.click();
          if (onClick)
            onClick(e);
        }}
        style={{ transition: 'transform 100ms ease-in-out', ...style }}
        ref={divRef}
        {...props}
      />
      <input
        type='file'
        accept={uploadType}
        style={{ display: 'none' }}
        onChange={e => {
          const file = process(e.target.files);
          if (file)
            onFile(file);
        }}
        ref={inputRef}
      />
    </>
  )
}
export default Upload;