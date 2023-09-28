import { S3 } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export async function uploadToS3(file: File) {
  try {
    const s3 = new S3({
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACESS_KEY!,
      },
      region: process.env.NEXT_PUBLIC_S3_REGION,
    });

    const fileKey = `uploads/${uuidv4()}.pdf`;

    const params = {
      Key: fileKey,
      Body: file,
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    };

    const upload = s3.putObject(params);

    await upload.then((data) => {
      console.log("successfully uploaded to S3!", fileKey);
    });

    return Promise.resolve({
      fileKey,
      fileName: file.name,
    });
  } catch (err) {
    throw err;
  }
}

export function getS3Url(fileKey: string) {
  const url = new URL(
    `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${fileKey}`
  );
  return url.href;
}
