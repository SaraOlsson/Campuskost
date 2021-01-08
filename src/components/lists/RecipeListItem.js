import React, { useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import { useFirestoreConnect } from "react-redux-firebase";
import AlertDialog from '../../components/shared/AlertDialog';
import {useTranslation} from "react-i18next";
import useFirebaseFetch from '../core/useFirebaseFetch';
import {useHistory} from 'react-router-dom'
import recipe_id_to_title from '../../logic/recipeIdToTitle'
import Button from '@material-ui/core/Button';

export default function RecipeListItem({list}) {

    const [openAlert, setOpenAlert] = useState(false)
    const [isShown, setIsShown] = useState(false);

    const firestore = useFirestore()
    const classes = useStyles()
    const history = useHistory()
    const {t} = useTranslation('common')

    let db_recipes_ref = firestore.collection("lists").doc(list.listID).collection("recipes")
    const {
        data: recipes_in_list
    } = useFirebaseFetch(db_recipes_ref, "COLLECTION")

    //console.log(recipes_in_list)

    // useFirestoreConnect({
    //     collection: `lists/${list.listID}/recipes`,
    //     storeAs: "recipes",
    //   });
    // const recipes = useSelector((state) => state.firestore.data.recipes);

    const onDeleteAccChoice = (chosedDelete) => {

        if(chosedDelete === true) {
          firestore.collection('lists').doc(list.listID).delete();
        } else {
          setOpenAlert(false)
        }
    }

  const onRemove = () => {
    setOpenAlert(true)
  }

  const pushToRecipe = (recipeID) => {

    // history.push("/recipe/" + recipe_id_to_title(recipeID) + "/" + recipeID )
    history.push("/recipe/" + recipeID )
  }

  return (
    <div className={classes.listItemContainer}
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
        >
    <div className={classes.testis} onClick={onRemove}
    style={{
        display: isShown ? 'flex' : 'none',
        width: isShown ? 35 : 25,
        height: isShown ? 35 : 25,
    }}> <span>x</span></div>
    {/* <Badge badgeContent={'x'} color="secondary" 
        style={{cursor: 'pointer'}}
        classes={{
            badge: classes.test
        }}> */}
        <div className={classes.listItem}
            style={{
                width: isShown ? 200 : 100,
                height: isShown ? 200 : 100,
            }}>  
            {!isShown && list.title}
            {isShown && (
            <div>
                <b> {list.title} </b>
                <>
                    { 
                        (recipes_in_list && recipes_in_list.length > 0) ?
                            recipes_in_list.map((r,idx) => 
                                <div className={classes.recipeLink} key={idx} 
                                    onClick={() => pushToRecipe(r.id)}
                                >
                                    {r.title}
                                </div>
                            ) 
                        :
                            <p>{t('lists.no_recipes_yet')}</p>
                    }
                </>
            </div>
            )}
        </div>
    {/* </Badge> */}
    

    <AlertDialog
        open={openAlert}
        onAlertClose={onDeleteAccChoice}
        title={t('lists.delete_alert.title')}
        message={t('lists.delete_alert.message')}
        yesOptionText={t('lists.delete_alert.yes')}
        NoOptionText={t('lists.delete_alert.no')}
    />

    </div>
  );
}



const useStyles = makeStyles(theme => ({
    listItem: {
        background: theme.palette.campuskost.teal,
        color: 'white',
        borderRadius: '15%',
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
        
    },
    listItemContainer: {
        margin: 10
    },
    test: {
        background: theme.palette.secondary.main,
        height: 25,
        minWidth: 25,
        borderRadius: '80px'
    },
    testis: {
        background: '#3979aa',
        // width: '25px',
        // height: '25px',
        position: 'relative',
        zIndex: '1',
        borderRadius: '50px',
        top: '20px',
        left: '-5px',
        cursor: 'pointer',
        // display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
    },
    recipeLink: {
        background: theme.palette.primary.main,
        borderRadius: 5,
        padding: '10px 15px',
        margin: 5,
        color: 'white',
        textAlign: 'center',
        cursor: 'pointer',
        // display: 'flex',
        // justifyContent: 'space-between',
        // alignItems: 'center'
    }
}));