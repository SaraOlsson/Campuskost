import React, { useState, useCallback } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import ImageCrop from "../components/ImageCrop";
import { withStyles } from '@material-ui/styles';
import getCroppedImg from '../logic/cropImage'

function ImageDialog(props) {

const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const handleClose = async (chosedYes) => {
    // CROP IMAGE
    
    if(chosedYes === true)
    {
        try {
            const croppedImage = await getCroppedImg(
                props.image,
                croppedAreaPixels
            )
        // console.log('done', { croppedImage })
        // console.log(croppedImage)
        props.onAlertClose(chosedYes, croppedImage);
        } catch (e) {
        console.error(e)
        }
    } else {
        props.onAlertClose(chosedYes);
    }
    
  }; 

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
    // console.log(croppedArea, croppedAreaPixels)
  }, [])
  

  // const classes = useStyles();

  return (

      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: props.classes.dialogPaper }}
      >
        {/*<DialogTitle id="alert-dialog-title">Ladda upp bild</DialogTitle>*/}
        <DialogContent >

            <ImageCrop image={props.image} onCropComplete={onCropComplete}/>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            Avbryt
          </Button>
          <Button onClick={() => handleClose(true)} color="primary" autoFocus>
            Använd bild
          </Button>
        </DialogActions>
      </Dialog>

  );
}


const useStyles = {
    dialogPaper: {
        minHeight: '50vh',
        maxHeight: '50vh',
    },
};

export default withStyles(useStyles)(ImageDialog);