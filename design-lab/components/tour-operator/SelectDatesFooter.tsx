'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type Props = {
  visible: boolean;
  selectedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export function SelectDatesFooter({ visible, selectedCount, onCancel, onConfirm }: Props) {
  const label =
    selectedCount === 1 ? '1 date selected' : `${selectedCount} dates selected`;

  return (
    <Box
      component="footer"
      className={`mo-sel-footer${visible ? ' visible' : ''}`}
      aria-hidden={!visible}
    >
      <Box className="mo-sel-footer-inner">
        <Typography className="mo-sel-count" variant="body2">
          {label}
        </Typography>
        <Box className="mo-sel-footer-actions">
          <Button className="mo-sel-footer-cancel" color="primary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="mo-sel-footer-action"
            variant="contained"
            color="primary"
            disabled={selectedCount === 0}
            onClick={onConfirm}
          >
            Close / Re-Open
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
