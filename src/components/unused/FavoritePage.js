import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import React, { useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'
import { useFirestore } from 'react-redux-firebase'
import ListContainer from './ListContainer'
import { makeStyles } from '@material-ui/core/styles'

function FavoritePage(props) {

  const [lists, setLists] = React.useState([])
  const [lists_by_user, setLists_by_user] = React.useState([])
  const [likes, setLikes] = React.useState(undefined)

  const [myLists, setMyLists] = React.useState({})
  const [refList, setRefList] = React.useState([])

  const userdoc = useSelector(state => state.firestore.data.userdoc)
  const firestore = useFirestore()
  const classes = useStyles()

  useEffect(() => {

    if( !( props.otheruser || userdoc))
      return

    let current_email = (props.otheruser) ? props.otheruser.email : userdoc.email

    // lists the user follows
    getListDocsForUser(current_email, false).then((loadedDocs) => {
      setLists(loadedDocs)
    })

    // lists created by the user
    getListDocsForUser(current_email, true).then((loadedDocs) => {
      setLists_by_user(loadedDocs)
    })

    // lists likes for the user
    getLikesDocsForUser(current_email).then((loadedDoc) => {
      setLikes(loadedDoc)
    })

  }, [userdoc])

  let getListDocsForUser = function(current_email, mine) {
    return new Promise((resolve, reject) => {

      let replaced_email = current_email.replace(/\./g, ',') // replaces all dots
      let listsRef = firestore.collection('recipe_lists').where('list_followers.' + replaced_email, '==', true)
      let list_docs = []

      if (mine === true) {
        listsRef = listsRef.where('created_by', '==', current_email)
      }

      let query = listsRef.get()
        .then(snapshot => {

          snapshot.forEach(doc => {

            let data = doc.data()
            // grab only lists of other users
            if (mine === true || (mine === false && data.created_by != current_email)) {
              list_docs.push(data)
            }

          })
          resolve(list_docs)
        })
    })
  }

  // fix not found
  let getLikesDocsForUser = function(current_email) {
    return new Promise((resolve, reject) => {

      let likesRef = firestore.collection('recipe_likes').doc(current_email)

      likesRef.get().then(function(doc) {
        let data = doc.data()
        //data.id = doc.id
        resolve(data)
      })
    })
  }

  const onDragEnd = result => {
      const { source, destination } = result

  }

  // build jsx for lists this user follows
  let lists_jxs = lists.map((item, i) =>
    <ListContainer key={i} recipemap={item.recipes} listname={item.listname} createdby={item.created_by} noheader={false}/>
  )

  // build jsx for lists this user has created
  let lists_by_user_jxs = lists_by_user.map((item, i) =>
    <ListContainer key={i} recipemap={item.recipes} listname={item.listname} createdby={item.created_by} noheader={false} mine={true}/>
  )

  let likes_by_user_jxs = (likes != undefined) ? <ListContainer recipemap={likes.liked_recipes} noheader={true}/> : undefined

  // if user profile view, this prop will be available
  let no_lists_text = (props.otheruser) ? props.otheruser + ' har ännu inga sparade listor' : 'Inga sparade listor ännu'
  let liked_list_jsx = (refList.length >= 1) ? <ListContainer refs={refList} noheader={true}/> : <p> Gillade recept.. </p>

  // <p> - kanske listor som <i>billig vecka, bra matlådemat</i> eller <i>att prova</i> ? </p>
  // <p> Här kommer du se de listor skapade av andra använder som du följer 🍴💎 </p>
  // { lists_I_follow.length < 1 && <p> {no_lists_text} </p>}
 // .body .MuiGridList-root

 const getListStyle = isDraggingOver => ({
     background: isDraggingOver ? 'lightblue' : '#eeeeee',
     padding: 8,
     width: '90%',
     display: 'flex',
     overflow: 'auto',
     borderRadius: 12,
 })

  return (

    <div>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='list_test2' direction='horizontal'>
          {(provided, snapshot) => (
              <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}>
                  {provided.placeholder}
              </div>
          )}
      </Droppable>
    { !props.otheruser &&

      <Accordion 
        className={classes.likedPanel}
        defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography style={{fontWeight: 'bold'}}> Gillade recept</Typography>
        </AccordionSummary>
        <AccordionDetails>

          {likes_by_user_jxs}

        </AccordionDetails>
      </Accordion>

    }
    { !props.otheruser && <h3>Listor</h3> }

    { props.otheruser &&

      <div className={classes.likedPanel}> {/*className='profilepageLists'*/}
        {lists_by_user_jxs}
      </div>

    }
    { !props.otheruser &&
    <Accordion className={classes.likedPanel}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography style={{fontWeight: 'bold'}}> Dina listor</Typography>
      </AccordionSummary>
      <AccordionDetails>

        {lists_by_user_jxs}

      </AccordionDetails>
    </Accordion>
    }
    { !props.otheruser &&

      <Accordion className={classes.likedPanel}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography style={{fontWeight: 'bold'}}> Listor du följer</Typography>
        </AccordionSummary>
        <AccordionDetails>

          {lists_jxs}

        </AccordionDetails>
      </Accordion>

    }
    </DragDropContext>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  likedPanel: {
    background: theme.palette.campuskost.lightgrey,
    marginTop: '8px', 
    borderRadius: '15px'
  }
}))



export default FavoritePage
