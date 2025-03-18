
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    
    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleAudioEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };
    
    // Set up event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('canplay', handleCanPlay);
    
    // Start loading the audio
    setIsLoading(true);
    audio.load();
    
    return () => {
      // Clean up event listeners
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleAudioEnd);
      audio.removeEventListener('canplay', handleCanPlay);
      
      // Cancel animation frame when component unmounts
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (!isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            animationRef.current = requestAnimationFrame(updateProgress);
          })
          .catch(error => {
            console.error("Error playing audio:", error);
          });
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const updateProgress = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setCurrentTime(audio.currentTime);
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  const onProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const onVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = value[0];
    setVolume(newVolume);
    audio.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Localized strings
  const playText = language === "ar" ? "تشغيل" : "Play";
  const pauseText = language === "ar" ? "إيقاف" : "Pause";
  const loadingText = language === "ar" ? "جاري التحميل..." : "Loading...";
  const surahDisplayName = language === "en" && surahName?.startsWith("سورة")
    ? surahName.replace("سورة", "Surah")
    : surahName;

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-quran-gold/10">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="flex flex-col gap-2">
        {(reciterName || surahName) && (
          <div className="text-center mb-2">
            {reciterName && <p className="text-quran-dark font-medium">{reciterName}</p>}
            {surahDisplayName && <p className="text-quran-secondary text-sm">{surahDisplayName}</p>}
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <Button
            onClick={togglePlayPause}
            size="sm"
            disabled={isLoading}
            title={isPlaying ? pauseText : playText}
            className={cn(
              "w-10 h-10 rounded-full",
              isPlaying 
                ? "bg-quran-accent hover:bg-quran-accent/90"
                : "bg-quran-primary hover:bg-quran-primary/90",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin block rounded-full border-2 border-white border-t-transparent" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <div className="grow space-y-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.01}
              onValueChange={onProgressChange}
              disabled={isLoading}
              className={cn("cursor-pointer", isLoading && "opacity-50")}
            />
            
            <div className="flex justify-between text-xs text-quran-dark/80">
              <span>{formatTime(currentTime)}</span>
              <span>{isLoading ? loadingText : formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleMute}
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="text-quran-dark hover:text-quran-primary hover:bg-transparent"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={onVolumeChange}
              disabled={isLoading}
              className={cn("w-20 cursor-pointer", isLoading && "opacity-50")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
