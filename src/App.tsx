import { useCallback, useEffect, useState } from 'react'
import './App.css'
import {Button, Container, Typography } from '@mui/material'
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import MenuIcon from '@mui/icons-material/Menu';
import Upload from './components/Upload';
import ControlPanel from './components/ControlPanel';
import Scene from './components/Scene';
import ControlsDrawer from './components/ControlsDrawer';

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
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAvatarUpload = (url: string) => {
    setState((prev) => ({ ...prev, avatarUrl: url, isLoading: true }));
  };

  const handleClothingUpload = (url: string) => {
    setState((prev) => ({ ...prev, clothingUrl: url, isLoading: true }));
  };

  const toggleClothingVisibility = () => {
    setState((prev) => ({ ...prev, isClothingVisible: !prev.isClothingVisible }));
  };

  const resetScene = () => {
    setState({
      avatarUrl: null,
      clothingUrl: null,
      isClothingVisible: true,
      isLoading: false,
      clothingColor: '#ffffff',
    });
  };

  const handleLoadingComplete = useCallback(() => {
    setState((prev) => {
      if ((prev.avatarUrl || prev.clothingUrl) && prev.isLoading) {
        return { ...prev, isLoading: false };
      }
      return prev;
    });
  }, []);

  const handleColorChange = (color: string) => {
    setState((prev) => ({ ...prev, clothingColor: color }));
  };

  useEffect(() => {
    return () => {
      if (state.avatarUrl) URL.revokeObjectURL(state.avatarUrl);
      if (state.clothingUrl) URL.revokeObjectURL(state.clothingUrl);
    };
  }, [state.avatarUrl, state.clothingUrl]);

  return (
    <>
      <Container>
        <Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" my={{xs: 1, sm: 3}}>
          <Typography fontSize={{ xs: "15px", sm: "20px"}} variant="h3" component="h1" gutterBottom align="center">3D Avatar Fitting App</Typography>
          <Button onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </Button>
        </Stack>
        <Stack direction="column" spacing={3}>
          <Paper>
            <Stack direction='column' px={{ xs: 1, sm: 2}} spacing={2} my={2}>
              <Upload onAvatarUpload={handleAvatarUpload} onClothingUpload={handleClothingUpload} />
              <ControlPanel onReset={resetScene} />
            </Stack>
          </Paper>
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
      <ControlsDrawer
        onOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        clothingColor={state.clothingColor}
        hasClothing={!!state.clothingUrl}
        onColorChange={handleColorChange} 
        isClothingVisible={state.isClothingVisible} 
        onToggleClothing={toggleClothingVisibility }      
      />
    </>
    
  );
}

export default App
