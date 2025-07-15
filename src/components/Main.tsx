import { useState } from "react";
import { Play, Pause } from "lucide-react";

const Main = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  const togglePlay = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div
      className="w-7 h-7 bg-black text-white text-xl cursor-pointer flex items-center justify-center rounded-full"
      onClick={togglePlay}
    >
      {isMusicPlaying ? (
        <Play size={20} fill="currentColor" />
      ) : (
        <Pause size={20} fill="currentColor" />
      )}
    </div>
  );
};

export default Main;
