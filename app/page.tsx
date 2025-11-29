import Image from "next/image";
import MagicSVG from "./magic.svg";
import { RabbitButton } from "./rabbit-button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-12 font-sans p-6">
      <Image src={MagicSVG} alt="Bunny Magic Containers" className="max-w-md" />
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black text-center">
          Next.js on Magic Containers!
        </h1>
      </div>
      <RabbitButton />
    </div>
  );
}
