import { Box, Divider, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import { HexColorPicker } from 'react-colorful';
import { getContrastTextColor } from '../utils';

interface DrawerProps {
  onOpen: boolean;
  onClose: () => void;
  clothingColor: string;
  isClothingVisible: boolean;
  hasClothing: boolean;
  onColorChange: (color: string) => void;
  onToggleClothing: () => void;
}

export default function ControlsDrawer({ 
  clothingColor, 
  hasClothing,
  isClothingVisible,
  onToggleClothing,
  onColorChange,
  onOpen,
  onClose
  }: DrawerProps) {

  const ControlsCmp = (
    <Box sx={{ width: 300 }} px={2} role="presentation" onClick={onClose}>
      <Stack direction="column">
        <Box>
          <Typography variant="h6" component="h2" gutterBottom>Controls</Typography>
          <FormControlLabel 
            control={
              <Switch 
                checked={isClothingVisible} 
                onChange={onToggleClothing}
                disabled={!hasClothing}
              />
            }
            label={
              <Stack>
                <Typography>Clothing Visibility</Typography>
              </Stack>
            }
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        {hasClothing && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>Clothing Color</Typography>
            <Box sx={{ mb: 2 }} width={{ sm: '300px'}}>
              <HexColorPicker color={clothingColor} onChange={onColorChange} style={{ width: '100%' }} />
              <Box
                sx={{ 
                  mt: 1, 
                  p: 1, 
                  border: '1px solid #444',
                  borderRadius: 1,
                  backgroundColor: clothingColor,
                  textAlign: 'center',
                  color: getContrastTextColor(clothingColor)
                }}
              >
                {clothingColor}
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}
      </Stack>
      
      <Divider />
      
    </Box>
  );

  return (
    <Drawer anchor='right' open={onOpen} onClose={onClose}>
      {ControlsCmp}
    </Drawer>
  );
}
