import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function EditModuleModal({
  open,
  onClose,
  moduleName,
  status,
  onSave,
  onStatusToggle,
  onModuleNameChange,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Module</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Edit the details of the module.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="moduleName"
          label="Module Name"
          type="text"
          fullWidth
          variant="outlined"
          value={moduleName}
          onChange={onModuleNameChange}
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
