import { useState, useEffect, RefObject, ChangeEvent } from "react";

type ElementRef = RefObject<HTMLVideoElement>;
type InputEvent = ChangeEvent<HTMLInputElement>;
type SelectEvent = ChangeEvent<HTMLSelectElement>;

type PlayerState = {
  isPlaying: boolean;
  progress: number;
  speed: number;
  isMuted: boolean;
};

type Props = {
  playerState: PlayerState;
  togglePlay: () => void;
  handleOnTimeUpdate: () => void;
  handleVideoProgress: (e: InputEvent) => void;
  handleVideoSpeed: (e: SelectEvent) => void;
  toggleMute: () => void;
};

const usePlayer = (videoElement: ElementRef): Props => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    progress: 0,
    speed: 1,
    isMuted: false,
  });

  useEffect(() => {
    playerState.isPlaying
      ? videoElement.current!.play()
      : videoElement.current!.pause();
  }, [playerState.isPlaying, videoElement]);

  const togglePlay = () => {
    setPlayerState({
      ...playerState,
      isPlaying: !playerState.isPlaying,
    });
  };

  const handleOnTimeUpdate = () => {
    const progress =
      (videoElement.current!.currentTime / videoElement.current!.duration) *
      100;
    setPlayerState({
      ...playerState,
      progress,
    });
  };

  const handleVideoProgress = (e: InputEvent) => {
    const manualChange = Number(e.target.value);
    videoElement.current!.currentTime =
      (videoElement.current!.duration / 100) * manualChange;
    setPlayerState({
      ...playerState,
      progress: manualChange,
    });
  };

  const handleVideoSpeed = (e: SelectEvent) => {
    const speed = Number(e.target.value);
    videoElement.current!.playbackRate = speed;
    setPlayerState({
      ...playerState,
      speed,
    });
  };

  useEffect(() => {
    playerState.isMuted
      ? (videoElement.current!.muted = true)
      : (videoElement.current!.muted = false);
  }, [playerState.isMuted, videoElement]);

  const toggleMute = () => {
    setPlayerState({
      ...playerState,
      isMuted: !playerState.isMuted,
    });
  };

  return {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
  };
};

export default usePlayer;
