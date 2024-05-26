import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import React from 'react';

function ConfirmDeleteModal({ open, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {'Bạn có chắc chắc muốn xóa dữ liệu này?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Dữ liệu sau khi bị xóa sẽ không thể khôi phục lại được !
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={onConfirm} color="error" variant="outlined" autoFocus>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteModal;
