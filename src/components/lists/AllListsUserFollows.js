import { useCollection, useCollectionOnce, useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useDocument, useDocumentOnce, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import React from "react"
import { useHistory } from 'react-router-dom'
import firebase from "firebase/app"
import { makeStyles } from '@material-ui/core/styles'
import SavedList from './SavedList'
import { ContactlessOutlined } from '@material-ui/icons';

const AllListsUserFollows = ({ref_user, css_prop={}}) => {

  const [value, loading, error] = useCollectionOnce(
    firebase.firestore().collection(`lists_follows/${ref_user}/lists`), {}
    
  );

  // console.log(value)

  return (
    <div style={css_prop}>
      {value && (
          <>
            {/* Collection:{' '} */}
            {value.docs.map((doc) => {
                
              let data = doc.data()
              console.log(data)
              return <SavedList key={doc.id} ref_listID={data.listID}/>
            }
            )}
          </>
        )}
    </div>
  );
};

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


export default AllListsUserFollows