import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export default function AlertDialog(props) {

  const handleClose = (chosedYes) => {
    props.onAlertClose(chosedYes)
  }

  return (

      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color='primary'>
            {props.NoOptionText}
          </Button>
          <Button onClick={() => handleClose(true)} color='primary' autoFocus>
            {props.yesOptionText}
          </Button>
        </DialogActions>
      </Dialog>

  )
}
