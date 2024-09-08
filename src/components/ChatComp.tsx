"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import { TbChartBubbleFilled } from "react-icons/tb";
import NewMessageForm from "./forms/NewMessageForm";
import Image from "next/image";

const ChatComp: React.FC = () => {
  const messagesWithUsers = useQuery(api.functions.getMessagesWithUsers);
  const { data: session } = useSession();
  console.log("MESSAGES WITH USERS: ", messagesWithUsers);
  return (
    <>
      <div className="bg-white min-w-[53rem] fixed top-0 left-[50%] translate-x-[-50%] z-10 flex justify-center text-start  pt-5 px-10 shadow-xl shadow-white">
        <div className="w-full bg-gradient-to-b from-neutral-950 to-zinc-300 bg-clip-text text-transparent flex flex-col">
          <h1 className="text-6xl font-bold w-full uppercase flex">
            Convey
            <span className="text-zinc-500">
              <TbChartBubbleFilled size={52} />
            </span>
          </h1>
          <div className="w-full flex justify-between items-end">
            <p className=" text-2xl text-zinc-600 font-bold pl-1.5">
              Interal Chat Platform.
            </p>
            {session && (
              <p className="text-sm text-zinc-900 mb-1 flex-end">
                {session?.user?.name} |{" "}
                <span
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-zinc-950 font-semibold hover:text-emerald-600 cursor-pointer transition duration-200"
                >
                  SignOut
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
      <main className="max-w-[50rem] bg-zinc-200 px-4 rounded-2xl max-h-screen flex flex-col mx-auto pb-12 overflow-y-auto">
        <ul className="overflow-y-auto min-h-screen pt-28">
          {messagesWithUsers?.map((message) => (
            <div
              key={message._id}
              className="flex flex-col bg-zinc-700 py-3 my-3 rounded-xl"
            >
              <li className="px-4 text-sm text-white tracking-wide">
                {message.content}
              </li>
              <div className="flex items-center justify-center w-full">
                <div className="bg-zinc-500 mx-4 my-1.5 h-[0.02rem] flex-1"></div>
                <div className=" pt-2 pb-1 flex items-center justify-center">
                  <Image
                    src={message.user?.image as string}
                    alt={message.user?.name as string}
                    width={30}
                    height={30}
                    className="rounded-full p-[1px] bg-zinc-400"
                  />
                  <div className="flex w-full items-center gap-2 px-2 text-zinc-200">
                    <li className="text-[#fddb51] text-xs">
                      {message.user?.email.split("@")[0] ?? ""}
                    </li>
                    <li className="text-[0.6rem] flex w-full">
                      {new Date(message._creationTime).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </li>
                  </div>
                </div>
                <div className="bg-zinc-500 mx-4 my-1.5 h-[0.02rem] flex-1"></div>
              </div>
            </div>
          ))}
        </ul>
        <NewMessageForm />
      </main>
    </>
  );
};

export default ChatComp;
