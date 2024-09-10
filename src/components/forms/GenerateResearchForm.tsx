"use client";
import { useAction, useMutation, useQuery } from "convex/react";
import { useState, useEffect, useRef } from "react";
import useConvexAuth from "../../hooks/useConvexAuth";
import { api } from "../../../convex/_generated/api";

import WaveLoader from "../ui/WaveLoader";

import { TbArrowBadgeDownFilled, TbArrowBadgeUpFilled } from "react-icons/tb";
import { RiRobot2Fill } from "react-icons/ri";

interface ResearchResult {
  id: string;
  content: string;
}

interface ResearchChat {
  _id: string;
  userId: string;
  prompt: string;
  response?: string;
  createdAt: string;
}

const GenerateResearchForm = () => {
  const latestResultRef = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [displayPrompt, setDisplayPrompt] = useState<string>("");
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [savedChats, setSavedChats] = useState<ResearchChat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [noChatsMsg, setNoChatsMsg] = useState<string>("");
  const [isAIExpanded, setIsAIExpanded] = useState<boolean>(false);
  const [isArchivedExpanded, setIsArchivedExpanded] = useState<boolean>(false);
  const { userId } = useConvexAuth();

  const generateResults = useAction(api.actions.generateResearchResponses);
  const saveResearchChat = useMutation(api.functions.saveResearchChat);
  const listResearchChats = useQuery(
    api.functions.listResearchChats,
    userId ? { userId } : "skip"
  ) as ResearchChat[] | undefined;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (latestResultRef.current) {
      latestResultRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [results]);

  const handleOnChangePrompt = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPrompt(e.target.value);
    setDisplayPrompt(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResults([]);
    try {
      const researchResults = await generateResults({ prompt });
      if (researchResults !== null) {
        setIsLoading(false);
        const newResult = {
          id: Date.now().toString(),
          content: researchResults,
        };
        setResults((prevResults) => [...prevResults, newResult]);
        console.log("Research Results:", researchResults);

        if (userId) {
          await saveResearchChat({
            userId,
            prompt,
            response: researchResults,
          });
          setPrompt("");
        }
      } else {
        setIsLoading(false);
        setResults((prevResults) => [
          ...prevResults,
          {
            id: Date.now().toString(),
            content: "An error occurred while generating the response.",
          },
        ]);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      setResults((prevResults) => [
        ...prevResults,
        {
          id: Date.now().toString(),
          content: "An error occurred while generating the response.",
        },
      ]);
    }
  };

  const startNewChat = () => {
    setPrompt("");
    setResults([]);
  };

  useEffect(() => {
    if (listResearchChats) {
      setSavedChats(listResearchChats);
      console.log("Saved Chats:", listResearchChats);
      setNoChatsMsg("");
    } else {
      setSavedChats([]);
      setNoChatsMsg("You have no archived chats yet.");
    }
  }, [listResearchChats]);

  return (
    <>
      {savedChats.length > 0 ? (
        <div
          className={`fixed left-[7%] z-100 border border-white rounded-xl max-w-[40rem] bg-[#3F3F46] transition-all duration-300 ease-in-out ${
            isArchivedExpanded
              ? "bottom-20 top-10 h-[60rem]"
              : "bottom-[-60rem] h-[62.5rem]"
          }`}
        >
          <div
            className="sticky top-0 w-full flex items-center justify-between cursor-pointer bg-[#3F3F46] px-4 py-2 z-10 rounded-t-xl"
            onClick={() => setIsArchivedExpanded(!isArchivedExpanded)}
          >
            <p className="text-white text-lg font-semibold">
              Your Archived Research
            </p>
            {isArchivedExpanded ? (
              <TbArrowBadgeDownFilled size={24} className="text-white" />
            ) : (
              <TbArrowBadgeUpFilled size={24} className="text-white" />
            )}
          </div>
          <div className="overflow-y-auto h-[calc(100%-3rem)] px-4 pb-4">
            {savedChats.map((chat) => (
              <div
                key={chat._id}
                className="mb-4 px-4 py-4 bg-white rounded border-2 border-zinc-500"
              >
                <div className="bg-white">
                  <p className="font-semibold">Prompt: {chat.prompt}</p>
                  <p>Response: {chat.response}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>{noChatsMsg}</p>
      )}
      {/* -------------------------AI Chat Window------------------------ */}
      <div
        className={`fixed right-[7%] z-40 border border-white rounded-xl min-w-[40rem] h-[60rem] bg-[#3F3F46] px-4 pt-2 pb-2 transition-all duration-300 ease-in-out ${
          isAIExpanded ? "bottom-20 top-10" : "bottom-[-57.5rem]"
        }`}
      >
        <div
          className="w-full flex items-center pb-2 justify-between cursor-pointer"
          onClick={() => setIsAIExpanded(!isAIExpanded)}
        >
          <p className="text-white text-lg font-semibold">
            AI Research Assistant
          </p>

          {isAIExpanded ? (
            <TbArrowBadgeDownFilled size={24} className="text-white" />
          ) : (
            <TbArrowBadgeUpFilled size={24} className="text-white" />
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl h-[54.5rem] flex flex-col"
        >
          {isLoading ? (
            <div className="flex h-full w-full items-center">
              <WaveLoader />
            </div>
          ) : (
            <div className="overflow-y-auto p-4 w-[38rem] max-w-[38rem]">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  ref={index === results.length - 1 ? latestResultRef : null}
                  className="mb-4 text-base font-semibold w-full flex"
                >
                  <div className="flex-col">
                    <p className="text-slate-700 text-sm italic underline py-2">
                      {displayPrompt}
                    </p>
                    <p>{result.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col mt-auto">
            <div className="w-full flex justify-end">
              <h5
                onClick={startNewChat}
                className="bg-[#3F3F46] rounded-tl-lg text-white text-xs w-fit py-1 pl-3 pr-1.5 hover:bg-[#343439] transition duration-200 cursor-pointer"
              >
                Start New Chat
              </h5>
            </div>
            <div className="flex">
              <input
                type="text"
                name="prompt"
                id="prompt"
                value={prompt}
                onChange={handleOnChangePrompt}
                placeholder="Ask me anything..."
                className="w-full border border-neutral-400 border-r-0 p-2 outline-none"
              />
              <button
                type="submit"
                className="border border-l-0 border-neutral-400 bg-white p-2 "
              >
                <RiRobot2Fill size={24} className="text-neutral-400" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default GenerateResearchForm;
