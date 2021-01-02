import { Slider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import Cropper from 'react-easy-crop';

const ImageCrop = (props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const classes = useStyles();

  return (
    <div className={classes.App}>
      <div className={classes.cropContainer}>
        <Cropper
          image={props.image} 
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          onCropChange={setCrop}
          onCropComplete={props.onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className={classes.controls}>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => setZoom(zoom)}
        />
      </div>
    </div>
  )
}
// classes={{ container: 'slider' }}
const useStyles = makeStyles({
  App: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
  },
  cropContainer: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "80px",
  },
  controls: {
    position: "absolute",
    bottom: "20%",
    left: "50%",
    width: "50%",
    transform: "translateX(-50%)",
    height: "80px",
    display: "flex",
    alignItems: "center"
  },
  slider: {
    padding: "22px 0px"
  }

});

export default ImageCrop;

// "https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
// classes={{ container: classes.slider }}