import React, { useRef, useState } from 'react';
import { alert } from '../../util/dialogQueue';

const process = (files: FileList, uploadType: string): File | void => {
  if (files.length === 0) return;
  if (files.length > 1) return void alert({ title: 'Too many files!', body: 'Please submit only one file at a time.' });
  const file = files[0];
  const isValid = uploadType.includes('.')
    ? new RegExp('(' + uploadType.replace(/,/g, '|') + ')$').test(file.name)
    : new RegExp(uploadType).test(file.type);
  if (!isValid) return void alert({ title: 'Invalid file type!',  body: `Your file ${file.name} was not recognized as a valid file of type "${uploadType}".` });
  return file;
};

const Upload: React.FC<{
  uploadType: string;
  onFile: (data: File) => unknown;
} & React.HTMLAttributes<HTMLDivElement>> = ({
  uploadType,
  onFile,
  style,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div
        onDragEnter={e => {
          e.preventDefault();
          e.stopPropagation();
          setHover(true);
          if (onDragEnter) onDragEnter(e);
        }}
        onDragOver={e => {
          e.preventDefault();
          e.stopPropagation();
          if (onDragOver) onDragOver(e);
        }}
        onDragLeave={e => {
          e.preventDefault();
          e.stopPropagation();
          setHover(false);
          if (onDragLeave) onDragLeave(e);
        }}
        onDrop={e => {
          e.preventDefault();
          e.stopPropagation();
          setHover(false);
          const file = process(e.dataTransfer.files, uploadType);
          if (file) onFile(file);
          if (onDrop) onDrop(e);
        }}
        onClick={e => {
          inputRef.current.click();
          if (onClick) onClick(e);
        }}
        style={{
          transition: 'transform 100ms ease-in-out',
          ...style,
          ...(hover && { transform: 'scale(1.05)' })
        }}
        {...props}
      />
      <input
        type="file"
        accept={uploadType}
        style={{ display: 'none' }}
        onChange={e => {
          const file = process(e.target.files, uploadType);
          if (file) onFile(file);
        }}
        ref={inputRef}
      />
    </>
  );
};
export default Upload;
