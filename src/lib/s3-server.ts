import AWS from "aws-sdk";
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import path from 'path';

export async function downloadFromS3(fileKey: string) {
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

    const params = {
      Key: fileKey,
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    };

    const obj = await s3.getObject(params).promise();
    const fileName = path.join(os.tmpdir(), `${uuidv4()}.pdf`);
    fs.writeFileSync(fileName, obj.Body as Buffer);
    return fileName;
  } catch (error) {
    console.log(error);
  }
}
