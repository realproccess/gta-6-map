export interface Pin {
  id: number;
  lat: number;
  lng: number;
  info: string;
  type: string;
  imageUrl?: string;
}

export interface GameState {
  isPlaying: boolean;
  currentScreenshot: string | null;
  actualCoords: [number, number] | null;
  userGuess: [number, number] | null;
  score: number;
}
