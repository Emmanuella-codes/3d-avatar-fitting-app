import { Box, Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import PersonIcon from '@mui/icons-material/Person';
import CheckroomIcon from '@mui/icons-material/Checkroom';

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

  const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps } = useDropzone({
    onDrop: onAvatarDrop,
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf']
    },
    maxFiles: 1
  });

  const { getRootProps: getClothingRootProps, getInputProps: getClothingInputProps } = useDropzone({
    onDrop: onClothingDrop,
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf']
    },
    maxFiles: 1
  });

  const dropzoneStyle = {
    border: '2px dashed #90caf9',
    borderRadius: 2,
    p: 2,
    mb: 2,
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(144, 202, 249, 0.1)',
    }
  };

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6" component="h2">Upload Models</Typography>
      <Stack direction="row" justifyContent="center" spacing={2}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>Avatar Model (GLB/GLTF)</Typography>
          <Box sx={dropzoneStyle} {...getAvatarRootProps()}>
            <input {...getAvatarInputProps()} />
            <Stack direction="column" spacing={1} alignItems="center">
              <PersonIcon fontSize="large" color="primary" />
              <Typography variant="body2">
                Drag & drop or click to select
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle2" gutterBottom>Clothing Model (GLB/GLTF)</Typography>
          <Box sx={dropzoneStyle} {...getClothingRootProps()}>
            <input {...getClothingInputProps()} />
            <Stack direction="column" spacing={1} alignItems="center">
              <CheckroomIcon fontSize="large" color="secondary" />
              <Typography variant="body2">
                Drag & drop or click to select
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Stack>      
    </Stack>
  )
}