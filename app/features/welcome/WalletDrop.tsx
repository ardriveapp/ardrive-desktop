/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

// Import the useDropzone hooks from react-dropzone
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';

interface Props {
  onDrop: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
  accept: string;
}

const WalletDrop = ({ onDrop, accept }: Props) => {
  // Initializing useDropzone hooks with options
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  /*
    useDropzone hooks exposes two functions called getRootProps and getInputProps
    and also exposes isDragActive boolean
  */

  return (
    <div {...getRootProps()}>
      <input className="dropzone-input" {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="dropzone-content">Release to drop the files here</p>
        ) : (
          <p className="dropzone-content">
            Drag files here or click to select files
          </p>
        )}
      </div>
    </div>
  );
};

export default WalletDrop;
