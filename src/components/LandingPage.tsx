"use client";

import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import HeroImg from "../../public/images/message-to-convey.webp";
import { ImBubbles2 } from "react-icons/im";

const LandingPage = () => {
  const { data: session } = useSession();
  return (
    <main className="w-full h-full flex flex-col justify-center">
      <section
        id="hero"
        className="grid grid-cols-1 md:grid-cols-2 p-4 justify-items-center"
      >
        <section className="p-2">
          <div>
            <h1 className="text-2xl md:text-5xl lg:text-6xl md:font-extrabold">
              Don&apos;t Just Say it,
            </h1>
            <h1 className="text-2xl text-emerald-700 md:text-5xl lg:text-7xl md:font-extrabold">
              Convey It!
            </h1>
          </div>
          <div className="py-4 bg-gradient-to-b from-gray-950 via-gray-700 to-gray-400 bg-clip-text text-transparent">
            <h2 className="uppercase text-xl md:text-2xl lg:text-[1.7rem] font-extrabold">
              Internal company chat platform.
            </h2>
            <h3 className="uppercase text-xl md:text-2xl lg:text-[1.7rem] font-extrabold">
              Communicate. Collaborate. Grow.
            </h3>
            <h4 className="uppercase text-xl md:text-2xl lg:text-[1.7rem] font-extrabold">
              Share thoughts, ideas, & code!
            </h4>
          </div>
          {!session ? (
            <div
              onClick={() => signIn("google", { callbackUrl: "/chat" })}
              className="w-full flex justify-center items-center gap-3 p-[1.4rem] uppercase text-[#dacc86] text-xl font-extrabold bg-[#0c1811] rounded-lg shadow-lg shadow-gray-700 hover:bg-emerald-800 transition duration-200"
            >
              All right here
              <span>
                <ImBubbles2 size={30} />
              </span>
            </div>
          ) : (
            <Link
              href="/chat"
              className="w-full flex justify-center items-center gap-3 p-[1.4rem] uppercase text-[#dacc86] text-xl font-extrabold bg-[#0c1811] rounded-lg shadow-lg shadow-gray-700 hover:bg-emerald-800 transition duration-200"
            >
              All right here
              <span>
                <ImBubbles2 size={30} />
              </span>
            </Link>
          )}
        </section>
        <section className="p-2">
          <Image
            src={HeroImg}
            alt="Hero Image"
            width={500}
            height={500}
            className="rounded-lg shadow-lg shadow-gray-700"
          />
        </section>
      </section>
    </main>
  );
};

export default LandingPage;
