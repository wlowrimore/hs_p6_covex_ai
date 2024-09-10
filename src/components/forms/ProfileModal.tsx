"use client";

import React from "react";
import Image from "next/image";
import { MessageUser } from "../ChatComp";

const ProfileModal = ({
  user,
}: {
  user: MessageUser;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <main className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[40rem] max-w-[30rem] h-[15rem] bg-green-50 border-zinc-700 rounded-lg p-4 flex items-center justify-center">
      <div className="flex items-center gap-4">
        <div className="border border-zinc-700 rounded-full p-2">
          <Image
            src={user?.image as string}
            alt={user?.name as string}
            width={100}
            height={100}
            className="rounded-full w-44 h-44"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-2xl font-semibold">{user?.name}</p>
          <p className="text-base text-neutral-90">{user?.email}</p>
        </div>
      </div>
    </main>
  );
};

export default ProfileModal;
