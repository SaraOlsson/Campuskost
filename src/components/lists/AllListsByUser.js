import firebase from "firebase/app"
import React from "react"
import { useCollection } from 'react-firebase-hooks/firestore'
import SavedList from './SavedList'

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

export default AllListsByUser