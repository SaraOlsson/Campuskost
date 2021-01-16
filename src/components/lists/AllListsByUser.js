import { makeStyles } from '@material-ui/core/styles';
import firebase from "firebase/app";
import React from "react";
import { useCollection } from 'react-firebase-hooks/firestore';
import SavedList from './SavedList';

const AllListsByUser = ({ref_user, css_prop={}}) => {

  const [value, loading, error] = useCollection(
    firebase.firestore().collection('lists').where("created_by", "==", ref_user), {}
  );

  return (
    <div style={css_prop}>
      {value && (
          <>
            {/* Collection:{' '} */}
            {value.docs.map((doc) => (
              <SavedList key={doc.id} ref_listID={doc.id}/>
            ))}
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


export default AllListsByUser