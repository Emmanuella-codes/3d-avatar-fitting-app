import { useState } from 'react'
import './App.css'
import { Container } from '@mui/material'

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
  return (
    <Container></Container>
  )
}

export default App
