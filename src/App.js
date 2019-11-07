import React from 'react';
import logo from './logo.svg';
import './App.css';

import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FolderIcon from '@material-ui/icons/Folder';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

const useStyles = makeStyles({
  body: {
    padding: 15
  },
  root: {
    width: 500
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 50

  },
  foodImg: {
    height: 100,
    width: 100,
    backgroundColor: 'pink',
    margin: 5,
    borderRadius: 20

  },

});

function ImageContainer() {

  const classes = useStyles();

  return (

    <div className={classes.foodImg}>

    </div>

  );

}

function App() {

  const classes = useStyles();
  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let images = [];
  for (var i = 0; i <= 5; i++) {
    images.push(<ImageContainer key={i}/>);
  }

  // <ImageContainer/>

  return (
    <div className={classes.body}>
      <div className={classes.mainContainer}>

      <h1>Veckans poppis</h1>

      <div className={classes.imageContainer}>{images}</div>
      
      

      </div>
      <div>
        <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
          <BottomNavigationAction label="Recents" value="recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOnIcon />} />
          <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
        </BottomNavigation>
      </div>
    </div>
  );
}


export default App;
