import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function EditClassModal({
  open,
  onClose,
  className,
  status,
  onSave,
  onStatusToggle,
  onClassNameChange,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Class</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Edit the details of the Class.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="className"
          label="ClassName"
          type="text"
          fullWidth
          variant="outlined"
          value={className}
          onChange={onClassNameChange}
        />
        <Button
          onClick={onStatusToggle}
          variant="outlined"
          color={status === '1' ? 'error' : 'success'}
        >
          {status === '1' ? 'Turn Off' : 'Turn On'}
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
