"use client";
import { uploadToS3 } from "@/lib/s3";
import axios from "axios";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";

type IProps = {};

const FileUpload: React.FC<IProps> = ({}) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      fileName,
      fileKey,
    }: {
      fileName: string;
      fileKey: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        fileName,
        fileKey,
      });

      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async ([acceptedFiles]) => {
      if (acceptedFiles.size > 10 * 1024 * 1024) {
        toast.error("File too large");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(acceptedFiles);
        if (!data?.fileKey || !data.fileName) {
          toast.error("Something went wrong");
          return;
        }

        mutate(data, {
          onSuccess: ({ chatId }) => {
            toast.success("Chat created!");
            router.push(`/chat/${chatId}`);
          },
          onError: (error) => {
            toast.error("Error creating chat");
            console.error(error);
          },
        });
      } catch (err) {
        console.log(err);
      } finally {
        setUploading(false);
      }
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            <Loader2 className="text-blue-500 w-10 h-10 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Cookin&apos; up some AI shi
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
