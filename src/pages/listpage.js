import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import ListContainer from '../components/listcontainer';
import Emoji from '../components/Emoji';

var Spinner = require('react-spinkit');

// ********************************* */

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

let grid = 15;

/*
const getReicipeStyle = (isDragging, draggableStyle) => {

  return {

    userSelect: 'none',
    margin: `0px 10px ${grid}px 0px`,
    // background: isDragging ? 'lightgreen' : '#68bb8c', // 'lightgreen
    borderRadius: 10,
    width: '120px !important', // isDragging ? '50px !important' : '120px',
    height: '120px !important', // isDragging ? '50px !important' : '120px',

    // styles we need to apply on draggables
    ...draggableStyle
}}; */

/*
const getLikedListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : '#eeeeee',
    padding: grid,
    width: '90%',
    display: 'flex',
    overflow: 'auto',
    borderRadius: 12,
}); */

function DraggableRecipe(props) {

  const classes = useStyles();
  const recipe = props.recipe;

  // SET IMAGE
  let r_img = ( recipe.img !== undefined) ? recipe.img : 'temp_food1';
  let img_src = ( recipe.img_url !== undefined) ? recipe.img_url : require('../assets/'+ r_img + '.jpg');
  let image = <img src={img_src} className={classes.listimage} alt={recipe.title} />;

  // RETURN JSX
  return (
    <React.Fragment>
    {image}
    </React.Fragment>
  );
}

window.oncontextmenu = function(event) {
     event.preventDefault();
     event.stopPropagation();
     return false;
};

function ListPage() {

    const [listState, setlistState] = React.useState(undefined);
    // const [likes, setLikes] = React.useState(undefined);
    const [recipes, setRecipes] = React.useState([]);
    const [lists_by_user, setLists_by_user] = React.useState([]);
    const [, updateState] = React.useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    //const [isDragging, setisDragging] = React.useState(false);
    // const [wasupdated, setwasupdated] = React.useState(false);

    const store = useSelector(state => state.fireReducer);
    const firestore = useFirestore();
    const classes = useStyles();

    // dragReducer
    const dispatch = useDispatch(); // be able to dispatch

    const dragDisp = (isDragging_val, draggableId_val = undefined) => {
      dispatch({
        type: "SETISDRAGGING",
        isDragging: isDragging_val
      })

      dispatch({
        type: "SETDRAGGABLEID",
        draggableId: draggableId_val
      })

    }

    let isDragging = false;


    useEffect(() => {

      if( !store.firestore_user) {
        return;
      }

      let current_email = store.firestore_user.email;

      // lists created by the user
      getListDocsForUser(current_email, true).then((loadedDocs) => {
        setLists_by_user(loadedDocs);
      });

      // lists likes for the user
      getLikesDocsForUser(current_email).then((like_docs) => {

        // if user has no liked recipes
        if(!like_docs)
          return;

        // setLikes(like_docs);

        let liked_recipes_ids = like_docs.liked_recipes;
        if ( liked_recipes_ids !== undefined) {

          let temp_recipes = [];
          // previously liked recipes will persist in the firestore map but be false
          Object.keys(liked_recipes_ids).forEach(function(key) {
              if(liked_recipes_ids[key] === true)
                temp_recipes.push(key)
          });

          recipe_fetcher(temp_recipes); // Object.keys(props.recipemap)
        }

      });

    }, [store.firestore_user]);

    let getLikesDocsForUser = function(current_email) {
      return new Promise((resolve, reject) => {

        let likesRef = firestore.collection('recipe_likes').doc(current_email);

        likesRef.get().then(function(doc) {
          let data = doc.data();
          resolve(data);

        });
      });
    }

    // get list definitions
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
              if (mine === true || (mine === false && data.created_by !== current_email)) {
                data.id = doc.id;
                list_docs.push(data);
              }

            });
            resolve(list_docs);
          })
      });
    }

    // fetch by list of recipe ids
    const recipe_fetcher = (recipe_id_list) => {

      let temp_recipes = [];
      let ref;
      recipe_id_list.map( (recipe_id, idx) => {

        ref = firestore.collection('recipes').doc(recipe_id);
        ref.get().then(function(doc) {
            if (doc.exists) {

                let data = doc.data();
                data.id = doc.id;
                temp_recipes.push(data);
                if (idx === recipe_id_list.length - 1) {
                  setRecipes(temp_recipes);
                  setlistState(temp_recipes);
                }
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      })
    }

    const onDragStart = result => {

      //setisDragging(true);
      isDragging = true;

      dragDisp(true, result.draggableId);
    }

    const onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        // if added to list
        if(destination.droppableId.substring(0, 4) === 'list') {

          //listState.splice(source.index, 1); // remove from current list

          //let listsRef = firestore.collection('recipe_lists').where('list_followers.' + replaced_email, '==', true);
          // lists_by_user
          let drop_id = result.destination.droppableId;
          let list_index = drop_id.substring(drop_id.indexOf("_")+1);

          let list = lists_by_user[list_index];
          let recipe_doc_id = result.draggableId;

          let listsRef = firestore.collection('recipe_lists').doc(list.id);

          listsRef.get().then(function(doc) {

            let data = doc.data();
            data.id = doc.id;
            data.recipes[recipe_doc_id] = true; // add to list
            firestore.collection("recipe_lists").doc(doc.id).update(data).then(function(what) {
              // history.go(0);
            });

            let updated_recipes = data.recipes[recipe_doc_id];
            const nextState = lists_by_user.map(a => a.id === doc.id ? { ...a, [recipes]: updated_recipes } : a);
            setLists_by_user(nextState);

          });
          }

        //setisDragging(false);
        isDragging = false;
        dragDisp(false);

        // if just reordered in same list
        if (source.droppableId === destination.droppableId) {

            const updated_items = reorder(
                listState,
                source.index,
                destination.index
            );

            let temp_selected = updated_items;
            setlistState(updated_items);
        }
    };



    let lists_by_user_jxs = lists_by_user.map((list_doc, i) =>
      <Droppable key={"list_" + i} droppableId={"list_" + i} direction="horizontal">
          {(provided, snapshot) => {

            return (
              <div ref={provided.innerRef} >
                <div
                  style={getListStyle(snapshot.isDraggingOver)}
                  className={isDragging ? null : classes.displayNone}>
                    <p> {list_doc.listname} </p>
                    <Spinner name="ball-scale-ripple" color="white" className={classes.spinner}/>
                </div>

                { !isDragging &&
                <div>
                    <ListContainer key={i}
                       listdoc={list_doc}
                       noheader={false} mine={true}
                    />
                </div>
              }
              </div>
            );
          }}
      </Droppable>
    );

    //                  recipeDocs={list_doc.recipeDocs}
    // className={isDragging ? classes.displayNone : null}

    let starter_content = (<div>
      <p> Du har inga gillade recept än</p>
    </div>);

    let loading_or_starting = (listState && listState.length < 1) ? starter_content : <p>spinner</p>;

    return (listState && listState.length > 0) ? (
      <div style={{margin: 10}}>
        <h3>Gillade recept</h3>
        <div>
          {listState.map((item, index) => (
            <DraggableRecipe recipe={item} key={index} className={classes.listimage}/>
          ))}
        </div>
        <h3>Mina listor</h3>
        <p>Kommer snart! <Emoji symbol="🥳"/> </p>
      </div>
    ) : <div><h3>Gillade recept</h3><p> Ledsen, du behöver logga in för att börja spara recept! <Emoji symbol="🍳"/> </p></div>;

    /*
    return (listState && listState.length > 0) ? (
      <div style={{margin: 10}}>
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>

            <h3>Gillade recept</h3>

            <div className={classes.listDroppable}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getLikedListStyle(snapshot.isDraggingOver)}>
                            {listState.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getReicipeStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps
                                                    .style
                                            )}>
                                            <DraggableRecipe recipe={item} isdragging={snapshot.isDragging}/>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>


        </DragDropContext>
      </div>
    ) : <div><h3>Gillade recept</h3><p> Ledsen, du behöver logga in för att börja spara recept! 🍳 </p></div>;
    */
}

/*

<h3>Mina listor</h3>

  <div style={{background: '#f1f1f1', marginTop: '8px', borderRadius: '15px', padding: '15px'}}
       className="profilepageLists"
    >
    {lists_by_user_jxs}
  </div>

<h3>Listor jag följer</h3>

*/

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : '#68bb8c', // '#eeeeee',
    padding: grid,
    width: '90%',
    // display: 'flex',
    overflow: 'auto',
    borderRadius: 12,
    height: '160px',
    marginBottom: '10px',
    textAlign: 'center',
    fontSize: '18px',
    color: 'white'
});

const useStyles = makeStyles({
  listDroppable: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 5
  },
  listimage: {
    height: '120px',
    width: '120px',
    objectFit: 'cover',
    borderRadius: 10,
    margin: '5px'
  },
  draggingClass: {
    height: '50px',
    width: '50px',
    objectFit: 'cover',
    borderRadius: 10
  },
  spinner: {
    color: 'white',
    marginRight: 'auto',
    marginLeft: 'auto',
    width: 'fit-content'
  },
  displayNone: {
    display: 'none'
  }
});


// Put the things into the DOM!
export default ListPage
