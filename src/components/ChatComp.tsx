"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import { TbChartBubbleFilled } from "react-icons/tb";
import NewMessageForm from "./forms/NewMessageForm";

const ChatComp: React.FC = () => {
  const messages = useQuery(api.functions.listMessages);
  const { data: session } = useSession();

  return (
    <>
      {session && (
        <h1
          onClick={() => signOut({ callbackUrl: "/" })}
          className="fixed top-4 right-12 text-lg ml-6 text-extrabold hover:text-blue-500 cursor-pointer"
        >
          SignOut
        </h1>
      )}
      <div className="bg-white w-[60rem] fixed top-0 right-[31%] pt-5 px-10 shadow-lg shadow-white">
        <div className="max-w-[50rem] bg-gradient-to-b from-neutral-950 to-zinc-300 bg-clip-text text-transparent flex items-center gap-2">
          <h1 className="text-6xl font-bold uppercase">Convey</h1>
          <span className="text-zinc-500">
            <TbChartBubbleFilled size={52} />
          </span>
        </div>
      </div>
      <main className="max-w-[50rem] bg-zinc-200 px-4 rounded-2xl max-h-screen flex flex-col mx-auto pb-12 overflow-y-auto">
        <ul className="overflow-y-auto min-h-screen pt-28">
          {messages?.map((message, msgIndex) => (
            <div
              key={msgIndex}
              className="flex flex-col bg-zinc-700 py-3 my-3 rounded-xl"
            >
              <li className="px-4 text-xs text-[#eab308]">
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
              <li className="px-6 text-base text-white tracking-wide">
                {message.text}
              </li>
            </div>
          ))}
        </ul>
        <NewMessageForm />
      </main>
    </>
  );
};

export default ChatComp;
