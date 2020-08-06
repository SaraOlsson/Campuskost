import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import ListContainer from '../components/listcontainer';

function FavoritePage(props) {

  const [lists, setLists] = React.useState([]);
  const [lists_by_user, setLists_by_user] = React.useState([]);
  const [likes, setLikes] = React.useState(undefined);

  const [myLists, setMyLists] = React.useState({});
  const [refList, setRefList] = React.useState([]);

  const store = useSelector(state => state.fireReducer);
  const firestore = useFirestore();

  useEffect(() => {

    if( !( props.otheruser || store.firestore_user))
      return;

    let current_email = (props.otheruser) ? props.otheruser.email : store.firestore_user.email;

    // lists the user follows
    getListDocsForUser(current_email, false).then((loadedDocs) => {
      setLists(loadedDocs);
    });

    // lists created by the user
    getListDocsForUser(current_email, true).then((loadedDocs) => {
      setLists_by_user(loadedDocs);
    });

    // lists likes for the user
    getLikesDocsForUser(current_email).then((loadedDoc) => {
      setLikes(loadedDoc);
    });

  }, [store.firestore_user]);

  let getListDocsForUser = function(current_email, mine) {
    return new Promise((resolve, reject) => {

      let replaced_email = current_email.replace(/\./g, ','); // replaces all dots
      let listsRef = firestore.collection('recipe_lists').where('list_followers.' + replaced_email, '==', true);
      let list_docs = [];

      if (mine === true) {
        listsRef = listsRef.where('created_by', '==', current_email);
      }

      let query = listsRef.get()
        .then(snapshot => {

          snapshot.forEach(doc => {

            let data = doc.data();
            // grab only lists of other users
            if (mine === true || (mine === false && data.created_by != current_email)) {
              list_docs.push(data);
            }

          });
          resolve(list_docs);
        })
    });
  }

  // fix not found
  let getLikesDocsForUser = function(current_email) {
    return new Promise((resolve, reject) => {

      let likesRef = firestore.collection('recipe_likes').doc(current_email);

      likesRef.get().then(function(doc) {
        let data = doc.data();
        //data.id = doc.id;
        resolve(data);
      });
    });
  }

  const onDragEnd = result => {
      const { source, destination } = result;

  }

  // build jsx for lists this user follows
  let lists_jxs = lists.map((item, i) =>
    <ListContainer key={i} recipemap={item.recipes} listname={item.listname} createdby={item.created_by} noheader={false}/>
  );

  // build jsx for lists this user has created
  let lists_by_user_jxs = lists_by_user.map((item, i) =>
    <ListContainer key={i} recipemap={item.recipes} listname={item.listname} createdby={item.created_by} noheader={false} mine={true}/>
  );

  let likes_by_user_jxs = (likes != undefined) ? <ListContainer recipemap={likes.liked_recipes} noheader={true}/> : undefined;

  // if user profile view, this prop will be available
  let no_lists_text = (props.otheruser) ? props.otheruser + " har ännu inga sparade listor" : "Inga sparade listor ännu";
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
 });

  return (

    <div>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list_test2" direction="horizontal">
          {(provided, snapshot) => (
              <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}>
                  {provided.placeholder}
              </div>
          )}
      </Droppable>
    { !props.otheruser &&

      <ExpansionPanel style={{background: '#f1f1f1', marginTop: '8px', borderRadius: '15px'}}
        defaultExpanded={true}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{fontWeight: 'bold'}}> Gillade recept</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>

          {likes_by_user_jxs}

        </ExpansionPanelDetails>
      </ExpansionPanel>

    }
    { !props.otheruser && <h3>Listor</h3> }

    { props.otheruser &&

      <div style={{background: '#f1f1f1', marginTop: '8px', borderRadius: '15px', padding: '15px'}}
           className="profilepageLists"
        >
        {lists_by_user_jxs}
      </div>

    }
    { !props.otheruser &&
    <ExpansionPanel style={{background: '#f1f1f1', marginTop: '8px', borderRadius: '15px'}}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography style={{fontWeight: 'bold'}}> Dina listor</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>

        {lists_by_user_jxs}

      </ExpansionPanelDetails>
    </ExpansionPanel>
    }
    { !props.otheruser &&

      <ExpansionPanel style={{background: '#f1f1f1', marginTop: '8px', borderRadius: '15px'}}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{fontWeight: 'bold'}}> Listor du följer</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>

          {lists_jxs}

        </ExpansionPanelDetails>
      </ExpansionPanel>

    }
    </DragDropContext>
    </div>
  );
}



export default FavoritePage;
