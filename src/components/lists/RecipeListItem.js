import { makeStyles } from '@material-ui/core/styles'
import React, { useState, useEffect} from "react"
import { useTranslation } from "react-i18next"
import { useFirestore } from "react-redux-firebase"
import { useHistory } from 'react-router-dom'
import { useSelector } from "react-redux"
import AlertDialog from '../../components/shared/AlertDialog'
import useFirebaseFetch from '../core/useFirebaseFetch';
// import getFieldFromDoc from '../core/getFieldFromDoc'

export default function RecipeListItem({list}) {

    const [openAlert, setOpenAlert] = useState(false)
    const [isShown, setIsShown] = useState(false);
    const [userField, setUserField] = useState(undefined)

    const {email: authUser} = useSelector((state) => state.firebase.auth)
    const firestore = useFirestore()
    const classes = useStyles()
    const history = useHistory()
    const {t} = useTranslation('common')

    //let db_recipes_ref = firestore.collection("lists").doc(list.listID).where("created_by", "==", "sara.olsson4s@gmail.com").collection("recipes")
    let db_recipes_ref = firestore.collection("lists").doc(list.listID).collection("recipes")
    const {
        data: recipes_in_list
    } = useFirebaseFetch(db_recipes_ref, "COLLECTION")

    const gradients = [
        'linear-gradient(138deg, rgba(224,93,244,1) 0%, rgba(253,187,45,1) 100%)',
        'linear-gradient(121deg, rgba(185,180,255,1) 0%, rgba(0,212,255,1) 100%)',
        'linear-gradient(138deg, rgba(255,249,180,1) 0%, rgba(255,89,80,1) 100%)'
        // 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        // 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        // 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        // 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        // 'linear-gradient(135deg, #E3FDF5 0%, #FFE6FA 100%)' 
    ]

    useEffect(() => {

        let username_ref = firestore.collection("users").doc(list.created_by)
        let fieldName = "username"
        // const [found, docData, field] = await getFieldFromDoc(username_ref, fieldName)
        // console.log("found " + found)
        // console.log(docData)
        // console.log("field " + field)

        username_ref.get().then( function(doc) {

            if (doc.exists) {
    
                let docData = doc.data()
        
                if (docData[fieldName]) {
                    
                    let field = docData[fieldName]
                    console.log("found doc")
                    setUserField(docData[fieldName])
                }
                else {
                    console.log("found doc but not field")
                }
        
            } else {      
                console.log("does not exist")
            }
    
            })
            .catch(err => {
        
                console.log("catched err")
            
        });

    }, [])

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
    {/* <div className={classes.closeBadge} onClick={onRemove}
    style={{
        display: true ? 'flex' : 'none',
        //width: isShown ? 35 : 25,
        //height: isShown ? 35 : 25,
    }}> <span>x</span></div> */}

        <div className={classes.listItem}
            style={{
                overflowY: isShown ? 'scroll' : 'unset'
                // width: isShown ? 200 : 100,
                // height: isShown ? 200 : 100,
                // background: isShown ? '#3979aa' : gradients[Math.floor(Math.random() * gradients.length)]
            }}>  

            <div className={classes.closeBadge} onClick={onRemove}
                style={{
                    display: true ? 'flex' : 'none',
                    //width: isShown ? 35 : 25,
                    //height: isShown ? 35 : 25,
                }}> <span>x</span></div>

            <div className={classes.listItemMain}>
            {!isShown && <div><p>{list.title}</p></div>}
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
        </div>

    {(authUser !== list.created_by) && <p>Av {userField}</p>}

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
        borderRadius: '15px',
        padding: 10,
        //display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
        // textAlign: 'center',

        //width: 150,
        height: 150,
        
    },
    listItemMain: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        //marginTop: 20,
        display: 'flex',
        height: '100%'
    },
    listItemHeader: {

    },
    listItemContainer: {
        margin: 10,
        width: '40%'
    },
    test: {
        background: theme.palette.secondary.main,
        height: 25,
        minWidth: 25,
        borderRadius: '80px'
    },
    closeBadge: {
        background: theme.palette.secondary.main, //'#3979aa',
        width: '25px',
        height: '25px',
        position: 'absolute',
        zIndex: '1',
        borderRadius: '50px',
        //top: '20px',
        //left: '-5px',
        cursor: 'pointer',
        // display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
    },
    closeBadge2: {
        background: theme.palette.secondary.main, //'#3979aa',
        width: '25px',
        height: '25px',
        position: 'relative',
        zIndex: '1',
        borderRadius: '50px',
        top: '20px',
        left: '-5px',
        cursor: 'pointer',
        // display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        alignSelf: 'flex-start'
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