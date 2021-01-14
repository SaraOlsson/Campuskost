import { makeStyles } from '@material-ui/core/styles';
import firebase from "firebase/app";
import React from "react";
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useHistory } from 'react-router-dom';

const RecipeItemInList = ({ref_recipeID, css_prop = {}}) => {
    const [value, loading, error] = useDocumentDataOnce(
        firebase.firestore().doc('recipes/' + ref_recipeID), {} );

    const history = useHistory()
    const classes = useStyles()

    return (
        <>
        {value && 
        <div className={classes.row}
          style={css_prop}
          onClick={() => history.push("/recipe/" + ref_recipeID )}
        >
            {/* <span>Document: {JSON.stringify(value)}</span> */}
            {/* <span> {value.title}{' | '}{value.user}</span> */}
            <img src={value.img_url} className={classes.listImage} alt={value.title} />
            <div className={classes.recipeLink} key={ref_recipeID}>
                {value.title}{' | '}<br/>{value.user}
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
    }
}))

export default RecipeItemInList