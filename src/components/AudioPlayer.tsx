
import React from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import AudioControls from "@/components/AudioControls";
import AudioHeader from "@/components/AudioHeader";

interface AudioPlayerProps {
  audioUrl: string;
  surahName?: string;
  reciterName?: string;
  language?: "ar" | "en";
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioUrl, 
  surahName, 
  reciterName,
  language = "ar" 
}) => {
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    togglePlayPause,
    onProgressChange,
    toggleMute,
    onVolumeChange
  } = useAudioPlayer({ audioUrl });

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-quran-gold/10">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="flex flex-col gap-2">
        <AudioHeader 
          reciterName={reciterName} 
          surahName={surahName} 
          language={language} 
        />
        
        <AudioControls 
          isPlaying={isPlaying}
          isLoading={isLoading}
          currentTime={currentTime}
          duration={duration}
          isMuted={isMuted}
          volume={volume}
          language={language}
          onPlayPause={togglePlayPause}
          onProgressChange={onProgressChange}
          onToggleMute={toggleMute}
          onVolumeChange={onVolumeChange}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
