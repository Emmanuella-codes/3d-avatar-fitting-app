import { Box } from "@mui/material";
import { useCallback } from "react";

interface UploadProps {
  onAvatarUpload: (url: string) => void;
  onClothingUpload: (url: string) => void;
}

export default function Upload({onAvatarUpload, onClothingUpload}: UploadProps) {
  const onAvatarDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      onAvatarUpload(url);
    }
  }, [onAvatarUpload]);

  const onClothingDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      onClothingUpload(url);
    }
  }, [onClothingUpload])

  return (
    <Box></Box>
  )
}