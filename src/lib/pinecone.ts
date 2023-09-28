import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import md5 from "md5";
import { getEmbeddings } from "./embeddings";
import { downloadFromS3 } from "./s3-server";

let pinecone: Pinecone | null = null;

export const getPineconeClient = () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }

  return pinecone;
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: {
      pageNumber: number;
    };
  };
};

export async function loadS3ToPinecone(filekey: string) {
  // 1. obtain the pdf -> download and read from pdf
  const fileName = await downloadFromS3(filekey);

  if (!fileName) {
    throw new Error("could not download from s3");
  }

  const loader = new PDFLoader(fileName);
  const pages = (await loader.load()) as PDFPage[];

  // 2. split and segment the pdf
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. vectorise and embed each document
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // 4. upload to pinecone
  const client = getPineconeClient();
  const pineconeIndex = client.index("chat-pdf");

  // const namespace = pineconeIndex.namespace(convertToAscii(filekey));
  await pineconeIndex.upsert(vectors);

  return documents[0];
}

const truncanteStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  const dec = new TextDecoder("utf-8");

  return dec.decode(enc.encode(str).slice(0, bytes));
};

async function embedDocument(doc: Document) {
  try {
    const embaddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embaddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (err) {
    console.error("error embadding document", err);
    throw err;
  }
}

export async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;

  pageContent = pageContent.replace(/\n/g, "");

  const splitter = new RecursiveCharacterTextSplitter();

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncanteStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}
