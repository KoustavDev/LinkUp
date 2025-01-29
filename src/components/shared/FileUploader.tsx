import React, { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import Image from "next/image";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaURL: string;
};

const FileUploader = ({ fieldChange, mediaURL }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileURL, setFileURL] = useState<string>(mediaURL);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      console.log(file);
      setFileURL(URL.createObjectURL(acceptedFiles[0]));
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
    },
    [fieldChange, file]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileURL ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            {/* {file.map((item, index) => {
              if (item.type.includes("image")) {
                return (
                  <Image
                    key={index}
                    src={fileURL}
                    alt="image"
                    width={60}
                    height={60}
                    className="file_uploader-img"
                  />
                );
              } else {
                return (
                  <video
                    controls
                    key={index}
                    // poster={poster}
                    className="video-player"
                    // loading="lazy"
                  >
                    <source src={fileURL} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                );
              }
            })} */}
            <Image
              src={fileURL}
              alt="image"
              width={60}
              height={60}
              className="file_uploader-img"
            />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box ">
          <Image
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />

          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
