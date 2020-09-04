import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import FileInput from '../components/fileinput';
import { makeStyles } from '@material-ui/core/styles';

function AddImage(props) {

    const classes = useStyles();
  
    return (
      <React.Fragment>
        <Grid container spacing={1}>
          <Grid item xs={9} style={{
              display: 'flex',
              marginBottom: '10px'
          }}>
          <FileInput onChange={props.onFileAdd} />
          </Grid>
        </Grid>
        { props.image !== undefined &&
        <React.Fragment>
          <Grid item xs={9}>
            <img src={props.image} alt={"loadedimage"} className={classes.loadedimage} />
          </Grid>
          
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={props.onFileRemove}
              style={{lineHeight: '1.2'}}
            >
              Ta bort bild
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