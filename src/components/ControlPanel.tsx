import { Box, Button, Divider, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import { getContrastTextColor } from "../utils";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { HexColorPicker } from "react-colorful";

interface ControlPanelProps {
  isClothingVisible: boolean;
  onToggleClothing: () => void;
  onReset: () => void;
  clothingColor: string;
  onColorChange: (color: string) => void;
  hasClothing: boolean;
}

export default function ControlPanel({
  isClothingVisible,
  onToggleClothing,
  onReset,
  clothingColor,
  onColorChange,
  hasClothing,
}: ControlPanelProps) {
  return (
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
            {isClothingVisible ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
            <Typography>Clothing Visibility</Typography>
          </Stack>
        }
      />
      <Divider sx={{ my: 2 }} />
      {hasClothing && (
        <>
          <Typography variant="subtitle2" gutterBottom>Clothing Color</Typography>
          <Box sx={{ mb: 2 }}>
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
        </>
      )}
      <Button 
        variant="outlined"
        startIcon={<RestartAltIcon />}
        onClick={onReset}
        fullWidth
        color="primary"
      >
        Reset Scene
      </Button>
    </Box>
  )
}