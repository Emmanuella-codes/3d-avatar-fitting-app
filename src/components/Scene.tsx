import { Box } from "@mui/material";

interface SceneProps {
  avatarUrl: string | null;
  clothingUrl: string | null;
  isClothingVisible: boolean;
  onLoadingComplete: () => void;
  isLoading: boolean;
  clothingColor: string;
}

export default function Scene({
  avatarUrl,
  clothingUrl,
  isClothingVisible,
  onLoadingComplete,
  isLoading,
  clothingColor,
}: SceneProps) {
  return (
    <Box></Box>
  )
}

