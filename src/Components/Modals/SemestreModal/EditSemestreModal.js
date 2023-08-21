import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function EditSemestreModal({
  open,
  onClose,
  semestreName,
  status,
  onSave,
  onStatusToggle,
  onSemestreNameChange,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Semestre</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Edit the details of the semester.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="semestreName"
          label="Semestre Name"
          type="text"
          fullWidth
          variant="outlined"
          value={semestreName}
          onChange={onSemestreNameChange}
        />
        <Button onClick={onStatusToggle}>
          {status === '1' ? 'Turn Off' : 'Turn On'}
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
