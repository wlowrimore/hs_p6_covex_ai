"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Id } from "../../convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";

import NewMessageForm from "./forms/NewMessageForm";
import ProfileModal from "./forms/ProfileModal";
import { TbChartBubbleFilled } from "react-icons/tb";

export interface MessageUser {
  id?: Id<"users"> | undefined;
  creationTime?: number | undefined;
  image?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
}

interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  content: string;
  user: MessageUser;
  userId: Id<"users">;
}

const ChatComp: React.FC = () => {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<MessageUser | null>(null);
  const [sortedMessages, setSortedMessages] = useState<Message[]>([]);
  const messagesWithUsers = useQuery(api.functions.getMessagesWithUsers);
  const [shouldScrollToBottom, setShouldScrollToBottom] =
    useState<boolean>(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (messagesWithUsers) {
      const sorted = [...messagesWithUsers].sort(
        (a, b) => a._creationTime - b._creationTime
      );
      setSortedMessages(sorted);
      setShouldScrollToBottom(true);
    }
  }, [messagesWithUsers]);

  useLayoutEffect(() => {
    if (shouldScrollToBottom && chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      setShouldScrollToBottom(false);
    }
  }, [sortedMessages, shouldScrollToBottom]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShouldScrollToBottom(isScrolledToBottom);
    }
  };

  const handleOpenModal = (user: MessageUser) => {
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
          <Link href="/">
            <h1 className="text-6xl font-bold w-full uppercase flex">
              Convey
              <span className="text-zinc-500">
                <TbChartBubbleFilled size={52} />
              </span>
            </h1>
          </Link>
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
      <main
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="min-w-[50rem] bg-white px-4 rounded-2xl pt-[9rem] mb-24 flex flex-col mx-auto min-h-screen overflow-y-auto"
      >
        <ul className="overflow-y-auto">
          {sortedMessages?.map((message) => (
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
                    onMouseEnter={() =>
                      handleOpenModal(message.user as MessageUser)
                    }
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
