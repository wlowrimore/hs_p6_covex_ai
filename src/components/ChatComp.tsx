"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import { TbChartBubbleFilled } from "react-icons/tb";
import NewMessageForm from "./forms/NewMessageForm";

const ChatComp: React.FC = () => {
  const [postedTime, setPostedTime] = useState<string>("");
  const messages = useQuery(api.functions.listMessages);
  const { data: session } = useSession();

  return (
    <>
      {session && (
        <h1
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-lg ml-6 text-extrabold hover:text-blue-500 cursor-pointer"
        >
          SignOut
        </h1>
      )}

      <main className="max-w-[50rem] h-screen rounded-lg flex flex-col mx-auto border border-black">
        <ul>
          {messages?.map((message, msgIndex) => (
            <div key={msgIndex} className="flex flex-col">
              <li className="pt-4 px-4 text-xs text-gray-600">
                {message.sender}&nbsp;
                <span>
                  {new Date(message._creationTime).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </li>
              <li className="px-6 text-sm">{message.text}</li>
            </div>
          ))}
        </ul>
        <NewMessageForm />
      </main>
    </>
  );
};

export default ChatComp;
