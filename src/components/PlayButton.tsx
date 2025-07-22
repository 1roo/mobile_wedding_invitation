import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const PlayButton = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    console.log("effect mounted");
    window.addEventListener("scroll", () => console.log("SCROLL!"));
  }, []);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      console.log("I am scrolling!!!");
      setIsVisible(false);

      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMusicPlaying) {
      audio.pause();
      setIsMusicPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((err) => console.warn("수동 재생 실패:", err));
    }
  };

  return (
    <div
      onClick={togglePlay}
      className={`sticky top-2 right-2 ml-auto w-7 h-7 bg-black text-white flex items-center justify-center rounded-full cursor-pointer transition-opacity duration-500 ease-in-out ${
        isVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {isMusicPlaying ? (
        <Pause size={20} fill="currentColor" />
      ) : (
        <Play size={20} fill="currentColor" />
      )}
    </div>
  );
};

export default PlayButton;
