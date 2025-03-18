
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/formatTime";

interface AudioControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  volume: number;
  language?: "ar" | "en";
  onPlayPause: () => void;
  onProgressChange: (value: number[]) => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number[]) => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  isLoading,
  currentTime,
  duration,
  isMuted,
  volume,
  language = "ar",
  onPlayPause,
  onProgressChange,
  onToggleMute,
  onVolumeChange
}) => {
  // Localized strings
  const playText = language === "ar" ? "تشغيل" : "Play";
  const pauseText = language === "ar" ? "إيقاف" : "Pause";
  const loadingText = language === "ar" ? "جاري التحميل..." : "Loading...";

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={onPlayPause}
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
          onClick={onToggleMute}
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
  );
};

export default AudioControls;
