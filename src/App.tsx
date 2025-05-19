import { useState } from 'react'
import './App.css'
import { Container, Typography } from '@mui/material'
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Upload from './components/Upload';
import ControlPanel from './components/ControlPanel';
import Scene from './components/Scene';

interface AppProps {
  avatarUrl: string | null;
  clothingUrl: string | null;
  isClothingVisible: boolean;
  isLoading: boolean;
  clothingColor: string;
}

function App() {
  const [state, setState] = useState<AppProps>({
    avatarUrl: null,
    clothingUrl: null,
    isClothingVisible: true,
    isLoading: false,
    clothingColor: '#ffffff',
  })

  const handleAvatarUpload = (url: string) => {
    setState((prev) => ({ ...prev, avatarUrl: url, isLoading: true }));
  }

  const handleClothingUpload = (url: string) => {
    setState((prev) => ({ ...prev, clothingUrl: url, isLoading: true }));
  }

  const toggleClothingVisibility = () => {
    setState((prev) => ({ ...prev, isClothingVisible: !prev.isClothingVisible }));
  }

  const resetScene = () => {
    setState({
      avatarUrl: null,
      clothingUrl: null,
      isClothingVisible: true,
      isLoading: false,
      clothingColor: '#ffffff',
    });
  };

  const handleLoadingComplete = () => {
    setState((prev) => ({ ...prev, isLoading: false }));
  };

  const handleColorChange = (color: string) => {
    setState((prev) => ({ ...prev, clothingColor: color }));
  };

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom align="center">3D Avatar Clothing</Typography>
      <Stack direction="row" spacing={3}>
        <Stack direction="column">
          <Paper>
            <Upload onAvatarUpload={handleAvatarUpload} onClothingUpload={handleClothingUpload} />
            <ControlPanel 
              isClothingVisible={state.isClothingVisible} 
              onToggleClothing={toggleClothingVisibility} 
              onReset={resetScene} 
              clothingColor={state.clothingColor} 
              onColorChange={handleColorChange} 
              hasClothing={!!state.clothingUrl} 
            />
          </Paper>
        </Stack>
        {/* 3D Scene */}
        <Stack width="100%">
          <Paper
            sx={{
              width: "100%",
              height: '100vh', 
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2
            }}
          >
            <Scene 
              avatarUrl={state.avatarUrl} 
              clothingUrl={state.clothingUrl} 
              isClothingVisible={state.isClothingVisible} 
              onLoadingComplete={handleLoadingComplete} 
              isLoading={state.isLoading} 
              clothingColor={state.clothingColor} 
            />
          </Paper>
        </Stack>
      </Stack>
    </Container>
  )
}

export default App
