
export interface PreloadedAudio {
  [key: string]: boolean;
}

export const preloadAudio = (
  server: string, 
  surahNumbers: number[], 
  preloadedAudios: PreloadedAudio,
  onPreloaded: (key: string) => void
) => {
  surahNumbers.forEach(num => {
    const paddedNumber = num.toString().padStart(3, '0');
    const audioUrl = `${server}${paddedNumber}.mp3`;
    const key = `${server}-${paddedNumber}`;
    
    if (preloadedAudios[key]) return;
    
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = audioUrl;
    audio.load();
    
    // Mark this audio as preloaded
    onPreloaded(key);
  });
};

export const getAudioUrl = (server: string, surahNumber: number): string => {
  const paddedNumber = surahNumber.toString().padStart(3, '0');
  return `${server}${paddedNumber}.mp3`;
};
