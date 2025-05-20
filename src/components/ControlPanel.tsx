import { Box, Button, Stack } from "@mui/material";
import RestartAltIcon from '@mui/icons-material/RestartAlt';


type ControlPanelProps = {
  onReset: () => void;
};

export default function ControlPanel({ onReset }: ControlPanelProps) {
  return (
    <Box>
      <Stack width="100%" alignItems="center">
        <Button 
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={onReset}
          size="medium"
          color="primary"
        >
          Reset Scene
        </Button>
      </Stack>
    </Box>
  )
}
