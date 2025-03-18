
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatTime } from "@/utils/formatTime";

interface InlineAudioPlayerProps {
  show: boolean;
  audioUrl: string;
  reciterName: string;
  surahName: string;
  onClose: () => void;
  language: "ar" | "en";
}

const InlineAudioPlayer: React.FC<InlineAudioPlayerProps> = ({
  show,
  audioUrl,
  reciterName,
  surahName,
  onClose,
  language
}) => {
  const { toast } = useToast();
  const audioRef = React.useRef<HTMLAudioElement>(null);

  if (!show) return null;

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("Audio error:", e);
    toast({
      title: language === "ar" ? "خطأ في الملف الصوتي" : "Audio File Error",
      description: language === "ar" ? "تعذر تشغيل الملف الصوتي" : "Could not play the audio file",
      variant: "destructive",
    });
    onClose();
  };

  return (
    <div 
      className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 transition-transform duration-300 flex items-center gap-4 translate-y-0"
    >
      <audio 
        ref={audioRef} 
        controls 
        className="flex-1" 
        src={audioUrl}
        onEnded={onClose}
        onError={handleError}
      />
      
      <div className="flex-1 truncate">
        <p className="font-medium text-green-darker truncate">
          {reciterName} - {surahName}
        </p>
      </div>
      
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default InlineAudioPlayer;
