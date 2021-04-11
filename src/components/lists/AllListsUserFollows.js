import firebase from "firebase/app"
import React from "react"
import { useCollection } from 'react-firebase-hooks/firestore'
import { useTranslation } from "react-i18next"
import Emoji from '../shared/Emoji'
import SavedList from './SavedList'

const AllListsUserFollows = ({ref_user, css_prop={}}) => {

  const {t} = useTranslation('common')
  const [value, loading, error] = useCollection(
    firebase.firestore().collection(`lists_follows/${ref_user}/lists`), {}
  )

  return (
    <div style={css_prop}>
      {value && (
          <>
            {/* Collection:{' '} */}
            {value.docs.map((doc) => {
                
              let data = doc.data()
              return <SavedList key={doc.id} ref_listID={data.listID}/>
            }
            )}
          </>
        )}
      {
        (!loading && value.docs.length < 1) && 
        <p>{t('lists.follows.no_list_yet')}<Emoji symbol="🍽️"/></p>
      }
    </div>
  )
}

export default AllListsUserFollows