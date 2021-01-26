import { makeStyles } from '@material-ui/core/styles';
import firebase from "firebase/app";
import React from "react";
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useHistory } from 'react-router-dom';
import FavoriteIcon from '@material-ui/icons/Favorite'
import Button from '@material-ui/core/Button'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
const fallbackImage = require('../../assets/err_image.png')


const RecipeItemInList = ({ref_recipeID, isLiking = null, toggleLike = () => {}, css_prop = {}}) => {
    const [value, loading, error] = useDocumentDataOnce(
        firebase.firestore().doc('recipes/' + ref_recipeID), {} );

    const history = useHistory()
    const classes = useStyles()

    const icon = (isLiking === true) ? <FavoriteIcon/> : <FavoriteBorderIcon/>;
    const likeBtn = isLiking ? (
        <Button 
        disableTouchRipple 
        onClick={(e) => toggleLike(e, ref_recipeID)}
        classes={{
            root: classes.likeButton
        }}>
            {icon}
        </Button>) : null

    return (
        <>
        {value && 
        <div className={classes.row}
          style={css_prop}
          onClick={() => history.push("/recipe/" + ref_recipeID )}
        >
            {/* <span>Document: {JSON.stringify(value)}</span> */}
            {/* <span> {value.title}{' | '}{value.user}</span> */}
            <img src={value.img_url} 
                className={classes.listImage} 
                alt={value.title}
                onError={(e)=>{e.target.onerror = null; e.target.src=fallbackImage}}
            />
            <div className={classes.recipeLink} key={ref_recipeID}>
                <div>
                {value.title}{' | '}<br/>{value.user}
                </div>
                <div>
                    {likeBtn}
                </div>
            </div>
        </div>
        }
        </>
    );
}

const useStyles = makeStyles(theme => ({
    recipeLink: {
        // background: theme.palette.primary.main,
        borderRadius: 5,
        padding: '10px 15px',
        margin: 5,
        color: 'white',
        textAlign: 'left',
        display: 'flex'
    },
    listImage: {
      maxHeight: '50px',
      maxWidth: '50px',
      minWidth: '50px',
      minHeight: '50px',
      objectFit: 'cover',
      borderRadius: 5
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    likeButton: {
        color: '#ffffff52' //'white'
    }
}))

export default RecipeItemInList