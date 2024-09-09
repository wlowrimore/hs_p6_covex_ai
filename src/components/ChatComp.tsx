"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { User } from "../app/api/auth/[...nextauth]/route";

import { TbChartBubbleFilled } from "react-icons/tb";
import NewMessageForm from "./forms/NewMessageForm";
import Image from "next/image";
import ProfileModal from "./forms/ProfileModal";

const ChatComp: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const messagesWithUsers = useQuery(api.functions.getMessagesWithUsers);
  const { data: session } = useSession();
  console.log("MESSAGES WITH USERS: ", messagesWithUsers);

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

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
                  className="text-zinc-700 font-semibold hover:text-emerald-600 cursor-pointer transition duration-200"
                >
                  SignOut
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
      <main className="max-w-[50rem] bg-white px-4 rounded-2xl min-h-screen flex flex-col mx-auto pb-24 overflow-y-auto">
        <ul className="overflow-y-auto min-h-screen pt-[9rem]">
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
                <div className=" pt-2 pb-1 min-w-[16rem] flex items-center justify-center">
                  <Image
                    src={
                      (message.user?.image as string) ||
                      (message.user?.name?.slice(0, 2).toUpperCase() as string)
                    }
                    alt={message.user?.name as string}
                    width={30}
                    height={30}
                    onMouseEnter={() => handleOpenModal(message.user as User)}
                    onMouseLeave={handleCloseModal}
                    className="rounded-full p-[1px] min-w-8 min-h-8 max-w-8 max-h-8 bg-zinc-400 cursor-pointer"
                  />
                  <div className="flex w-full items-center gap-2 px-2 text-zinc-200">
                    <li className="text-[#fddb51] text-xs">
                      {message.user?.email?.split("@")[0] ?? ""}
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

      {modalOpen && selectedUser && (
        <ProfileModal
          user={selectedUser}
          isOpen={modalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ChatComp;
