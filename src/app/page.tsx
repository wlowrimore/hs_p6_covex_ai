import LandingPage from "@/components/LandingPage";
import Image from "next/image";

export default function Home() {
  return (
    <main
      id="home"
      className="w-[80rem] max-w-screen min-h-screen flex flex-col justify-center p-12 mx-auto"
    >
      <LandingPage />
    </main>
  );
}
