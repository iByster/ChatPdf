import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import React from "react";

type Props = {
  messages: Message[];
};

const MessageList = ({ messages }: Props) => {
  if (!messages) return <></>;

  const renderMessage = (message: Message) => {
    return (
      <div
        key={message.id}
        className={cn("flex", {
          "justify-end pl-10": message.role === "user",
          "justify-start pr-10": message.role === "assistant",
        })}
      >
        <div
          className={cn(
            "rounded-lg px-3 text-base py-1 mb-2 shadow-md ring-1 ring-gray-900/10",
            {
              "bg-[#4000ad] text-white": message.role === "user",
            }
          )}
        >
          <p>{message.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 px-4 mb-10 overflow-y-scroll">
      {messages.map((message) => renderMessage(message))}
    </div>
  );
};

export default MessageList;
