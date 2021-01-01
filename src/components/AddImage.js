import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import FileInput from '../components/fileinput';
import { makeStyles } from '@material-ui/core/styles';
import {useTranslation} from "react-i18next";

function AddImage(props) {

    const classes = useStyles();
    const {t} = useTranslation('common');  
  
    return (
      <React.Fragment>
        <Grid container spacing={1}>
          <Grid item xs={12} style={{
              display: 'flex',
              marginBottom: '10px'
          }}>
          <FileInput onChange={props.onFileAdd} uploadText={t('upload.actions.upload_image')}/>
          </Grid>
        </Grid>
        { props.image !== undefined &&
        <React.Fragment>
          <Grid item xs={12}>
            <img src={props.image} alt={"loadedimage"} className={classes.loadedimage} />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={props.onFileRemove}
              style={{lineHeight: '1.2'}}
            >
              {t('upload.actions.remove_image')}
            </Button>
          </Grid>
        </React.Fragment>
        }
      </React.Fragment>
    );
}
 
// material ui design
const useStyles = makeStyles(theme => ({
    loadedimage: {
        width: '100%',
        borderRadius: '4px'
    }
}));

export default AddImage;