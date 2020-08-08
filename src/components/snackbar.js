import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

// <MySnackbar open={openDialog} handleClose={handleClose} message={recipe.title} action={"ta bort från lista"}/>

export default function MySnackbar(props) {

  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }


    setOpen(false);
    props.handleClose();
  };

  const handleAction = () => {

    setOpen(false);
    props.handleClose("remove");
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={props.message}
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleAction} style={{marginRight: '25px'}}>
              {props.action}
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
