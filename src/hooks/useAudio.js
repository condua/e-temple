import { useState, useEffect, useRef } from "react";

export const useAudio = (url, loop = false) => {
  const audio = useRef(new Audio(url));
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    audio.current.loop = loop;
    audio.current.volume = 0.3;
    const handleEnded = () => setPlaying(false);
    audio.current.addEventListener("ended", handleEnded);
    return () => {
      audio.current.pause();
      audio.current.removeEventListener("ended", handleEnded);
    };
  }, [loop, url]);

  const toggle = () => {
    if (playing) {
      audio.current.pause();
    } else {
      audio.current
        .play()
        .catch((e) => console.log("Audio play failed interaction required"));
    }
    setPlaying(!playing);
  };

  const playOneShot = () => {
    const sound = new Audio(url);
    sound.volume = 0.5;
    sound.play().catch((e) => console.log("Sound error"));
  };

  return { playing, toggle, playOneShot };
};
