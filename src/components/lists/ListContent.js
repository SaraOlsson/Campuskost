import { useCollection, useCollectionOnce, useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useDocument, useDocumentOnce, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import React from "react"
import { useHistory } from 'react-router-dom'
import firebase from "firebase/app"
import { makeStyles } from '@material-ui/core/styles'
import RecipeItemInList from './RecipeItemInList'

const ListContent = ({ref_listID}) => {
  const [value, loading, error] = useCollectionOnce(
    firebase.firestore().collection('/lists/'+ ref_listID +'/recipes'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return (
    <div>
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
      </p>
        {value && (
          <>
            {/* Collection:{' '} */}
            {value.docs.map((doc) => (
              <React.Fragment key={doc.id}>
                {/* {JSON.stringify(doc.data())},{' '} */}
                <RecipeItemInList ref_recipeID={doc.id}/>
              </React.Fragment>
            ))}
          </>
        )}
      
    </div>
  );
};

// const useStyles = makeStyles(theme => ({
//     recipeLink: {
//         // background: theme.palette.primary.main,
//         borderRadius: 5,
//         padding: '10px 15px',
//         margin: 5,
//         color: 'white',
//         textAlign: 'left',
//     },
//     listImage: {
//       maxHeight: '50px',
//       maxWidth: '50px',
//       minWidth: '50px',
//       minHeight: '50px',
//       objectFit: 'cover',
//       borderRadius: 5
//     },
//     row: {
//       display: 'flex',
//       alignItems: 'center',
//       cursor: 'pointer'
//     }
// }))


export default ListContent