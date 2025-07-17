import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const PlayButton = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    const handleFirstTouch = () => {
      audio
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((err) => {
          console.warn("자동 재생 실패:", err);
        });

      document.removeEventListener("touchstart", handleFirstTouch);
    };

    document.addEventListener("touchstart", handleFirstTouch, { once: true });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch((err) => console.warn("수동 재생 실패:", err));
    }
  };

  return (
    <div
      className="sticky top-4 right-0 ml-auto w-7 h-7 bg-black text-white flex items-center justify-center rounded-full cursor-pointer"
      onClick={togglePlay}
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
