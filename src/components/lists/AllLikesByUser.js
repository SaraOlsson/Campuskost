import firebase from "firebase/app"
import React from "react"
import { useCollection } from 'react-firebase-hooks/firestore'
import RecipeItemInList from './RecipeItemInList'

// get which recipe IDs this user likes
const AllLikesByUser = ({ref_user, css_prop={}}) => {

  const [value] = useCollection(
    firebase.firestore().collection(`likes/${ref_user}/likes`), {}
  );

  const toggleLike = (event, ref_recipeID) => {
    event.stopPropagation();

    firebase.firestore().collection(`likes/${ref_user}/likes`).doc(ref_recipeID).delete()
  }

  const css_prop_item = {
    background: '#43a58e',
    width: 300,
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
                <RecipeItemInList isLiking={true} 
                                  toggleLike={toggleLike}
                                  ref_recipeID={doc.id} 
                                  css_prop={css_prop_item}/>
              </React.Fragment>
            ))}
          </>
        )}
    </div>
  );
};

export default AllLikesByUser