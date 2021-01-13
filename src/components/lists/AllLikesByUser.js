import { useCollection, useCollectionOnce, useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useDocument, useDocumentOnce, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import React from "react"
import { useHistory } from 'react-router-dom'
import firebase from "firebase/app"
import { makeStyles } from '@material-ui/core/styles'
import SavedList from './SavedList'
import RecipeGridList from '../shared/RecipeGridList';
import RecipeItemInList from './RecipeItemInList'
import LoadSpinner from '../shared/LoadSpinner';

// get which recipe IDs this user likes
const AllLikesByUser = ({ref_user, css_prop={}}) => {

  const [value, loading, error] = useCollectionOnce(
    firebase.firestore().collection(`likes/${ref_user}/likes`), {}
  );

  // <RecipeGridList recipes={getRecipeDocs(userLikes)} />

  const css_prop_item = {
    background: '#43a58e',
    width: 300,
    // height: 200,
    color: 'white',
    borderRadius: 15,
    padding: '0px 15px',
    margin: 15
  }

  return (
    <div style={css_prop}>
      {/* {loading && 
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <LoadSpinner/>
        </div>
      } */}
      {value && (
          <>
            {/* Collection:{' '} */}
            {value.docs.map((doc) => (
              <React.Fragment key={doc.id}>
                {/* {JSON.stringify(doc.data())},{' '} */}
                <RecipeItemInList ref_recipeID={doc.id} css_prop={css_prop_item}/>
              </React.Fragment>
            ))}
          </>
        )}
    </div>
  );
};

// const LikedRecipeItem = ({ref_recipeID}) => {
//     const [value, loading, error] = useDocumentDataOnce(
//         firebase.firestore().doc('recipes/' + ref_recipeID), {} );

//     const history = useHistory()
//     const classes = useStyles()

//     return (
//     <div>
//         <p>
//         {/* {error && <strong>Error: {JSON.stringify(error)}</strong>}
//         {loading && <span>Document: Loading...</span>} */}
//         {' '}
//         </p>
//         {value && 
//         <div className={classes.row}
//           onClick={() => history.push("/recipe/" + ref_recipeID )}>
//         {/* <span>Document: {JSON.stringify(value)}</span> */}
//         {/* <span> {value.title}{' | '}{value.user}</span> */}
//         <img src={value.img_url} className={classes.listImage} alt={value.title} />
//         <div className={classes.recipeLink} key={ref_recipeID}>
//             {value.title}{' | '}<br/>{value.user}
//         </div>
//         </div>
//         }
        
//     </div>
//     );
// }


// {/* Collection:{' '} */}
// {value.docs.map((doc) => {

//     return <p key={doc.id}> {doc.id} </p>
// //   return <p> </p><SavedList key={doc.id} ref_listID={doc.id}/>
// })}


// <React.Fragment key={doc.id}>
// {JSON.stringify(doc.data())},{' '}
// {/* <RecipeItemInList ref_recipeID={doc.id}/> */}
// </React.Fragment>


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


export default AllLikesByUser