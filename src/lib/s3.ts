import AWS from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';

export async function uploadToS3(file: File) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACESS_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: process.env.NEXT_PUBLIC_S3_REGION,
    });

    const fileKey =
      `uploads/${uuidv4()}.pdf`;

    const params = {
      Key: fileKey,
      Body: file,
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    };

    // const upload = s3.upload(params).promise();
    const upload = s3.putObject(params).on("httpUploadProgress", (evt) => {
      console.log(
        "uploading to s3...",
        parseInt(((evt.loaded * 100) / evt.total).toString())
      );
    }).promise();

    await upload.then(data => {
        console.log('successfully uploaded to S3!', fileKey);
    });

    return Promise.resolve({
        fileKey,
        fileName: file.name
    })
  } catch (err) {}
}

export function getS3Url(fileKey: string) {
    const url = new URL(`https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${fileKey}`);
    return url.href;
}
