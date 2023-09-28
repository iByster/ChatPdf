import { DrizzleChat as Chat } from "@/lib/db/schema";
import React from "react";
import { Code2, Home, MessageCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type Props = {
  chats: Chat[];
  chatId: number;
};

const ChatSiderBar = ({ chats, chatId }: Props) => {
  const renderChatButton = (chat: Chat) => {
    const { pdfName } = chat;

    return (
      <Link key={chat.id} href={`/chat/${chat.id}`}>
        <div
          className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
            "bg-[#4000ad] text-white": chat.id === chatId,
            "hover:text-white": chat.id !== chatId,
          })}
        >
          <MessageCircle className="mr-2" />
          <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
            {pdfName}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <div className="text-gray-200 bg-gray-900 p-4 w-full h-screen overflow-hidden">
      <Link href="/">
        <Button className="w-full border-dashed border-white border py-6">
          <PlusCircle className="mr-2 w-5 h-5" />
          New chat
        </Button>
      </Link>

      <div className="flex flex-col gap-2 mt-4 overflow-scroll h-full">
        {chats.map((chat) => (
          <>{renderChatButton(chat)}</>
        ))}
      </div>

      <div className="absolute bottom-0 flex flex-col gap-5 font-extrabold text-gray-400 flex-wrap bg-gray-900 border-t-4 border-gray-200 p-4 w-72">
        <Link href="/">
          <div className="flex items-center hover:text-gray-200">
            <Home className="mr-2" />
            <p>Home</p>
          </div>
        </Link>
        <Link href="https://github.com/iByster/ChatPdf">
          <div className="flex items-center hover:text-gray-200">
            <Code2 className="mr-2" />
            Subscription
          </div>
        </Link>
        <Link href="https://github.com/iByster/ChatPdf">
          <div className="flex items-center hover:text-gray-200">
            <Code2 className="mr-2" />
            Source
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ChatSiderBar;
