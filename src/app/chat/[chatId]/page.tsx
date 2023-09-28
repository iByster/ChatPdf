import ChatComponent from "@/components/my-components/ChatComponent";
import ChatSiderBar from "@/components/my-components/ChatSiderBar";
import PDFViewer from "@/components/my-components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("./sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  const currenctChat = _chats.find((chat) => chat.id === parseInt(chatId));

  if (!currenctChat) {
    return redirect("/");
  }

  return (
    <div className="flex max-h-screen">
      <div className="flex w-full max-h-screen">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSiderBar chatId={parseInt(chatId)} chats={_chats} />
        </div>
        {/* pdf viewer */}
        <div className="max-h-screen p-4 overflow-scroll flex-[5]">
          <PDFViewer pdfUrl={currenctChat?.pdfUrl} />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-1-4 border-l-slate-200">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
