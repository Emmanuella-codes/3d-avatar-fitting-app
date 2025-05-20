import { Box, Button, Stack } from "@mui/material";
import RestartAltIcon from '@mui/icons-material/RestartAlt';


type ControlPanelProps = {
  onReset: () => void;
  hasModel: boolean
};

export default function ControlPanel({ onReset, hasModel }: ControlPanelProps) {
  return (
    <Box>
      <Stack width="100%" alignItems="center">
        <Button 
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={onReset}
          size="medium"
          color="primary"
          disabled={hasModel}
        >
          Reset Scene
        </Button>
      </Stack>
    </Box>
  )
}
