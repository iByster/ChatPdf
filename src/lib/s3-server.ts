import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import os from "os";
import path from "path";
import { S3 } from "@aws-sdk/client-s3";
import { Readable } from "stream";

export async function downloadFromS3(fileKey: string) {
  try {
    const s3 = new S3({
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACESS_KEY!,
      },
      region: process.env.NEXT_PUBLIC_S3_REGION,
    });

    const params = {
      Key: fileKey,
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    };
    const { Body } = await s3.getObject(params);
    const fileName = path.join(os.tmpdir(), `${uuidv4()}.pdf`);

    if (Body && Body instanceof Readable) {
      const target = fs.createWriteStream(fileName);
      Body.pipe(target);

      return new Promise<string>((resolve, reject) => {
        target.on("finish", () => {
          resolve(fileName);
        });

        target.on("error", (error) => {
          reject(error);
        });
      });
    }

    return fileName;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
