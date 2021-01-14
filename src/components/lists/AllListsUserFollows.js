import { makeStyles } from '@material-ui/core/styles'
import firebase from "firebase/app"
import React from "react"
import { useCollectionOnce } from 'react-firebase-hooks/firestore'
import SavedList from './SavedList'
import Emoji from '../shared/Emoji'
import {useTranslation} from "react-i18next";

const AllListsUserFollows = ({ref_user, css_prop={}}) => {

  const {t} = useTranslation('common')
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
      {
        (!loading && value.docs.length < 1) && 
        <p>{t('lists.follows.no_list_yet')}<Emoji symbol="🍽️"/></p>
      }
    </div>
  );
};
// {t('lists.follows.no_list_yet')}
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