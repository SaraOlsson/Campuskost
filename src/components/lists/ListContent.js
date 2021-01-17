import firebase from "firebase/app";
import React from "react";
import { useCollectionOnce } from 'react-firebase-hooks/firestore';
import RecipeItemInList from './RecipeItemInList';
import { useTranslation } from "react-i18next"

const ListContent = ({ref_listID}) => {

  const {t} = useTranslation('common')
  const [value, loading, error] = useCollectionOnce(
    firebase.firestore().collection('/lists/'+ ref_listID +'/recipes'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return (
    <div>
      {/* <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
      </p> */}
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
        { (value && value.docs.length < 1) && 
          <p> {t('lists.empty_list')} </p>
        }
      
    </div>
  );
};

export default ListContent