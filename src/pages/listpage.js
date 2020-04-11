import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';





// ********************************* */

// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

let grid = 15;

const getReicipeStyle = (isDragging, draggableStyle) => {

  return {

    userSelect: 'none',
    margin: `0px 10px ${grid}px 0px`,
    // background: isDragging ? 'lightgreen' : '#68bb8c', // 'lightgreen
    borderRadius: 10,

    // styles we need to apply on draggables
    ...draggableStyle
}};

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : '#eeeeee',
    padding: grid,
    width: '90%',
    display: 'flex',
    overflow: 'auto',
    borderRadius: 12,
});


function DraggableRecipe(props) {

  const classes = useStyles();
  const recipe = props.recipe;

  // SET IMAGE
  let r_img = ( recipe.img !== undefined) ? recipe.img : 'temp_food1';
  let img_src = ( recipe.img_url !== undefined) ? recipe.img_url : require('../assets/'+ r_img + '.jpg');
  let image = <img src={img_src} className={classes.listimage} alt={recipe.title} alt={"recipe img"} />;

  // RETURN JSX
  return (
    <React.Fragment>
    {image}
    </React.Fragment>
  );
}

function ListPage() {

    const [listState, setlistState] = React.useState([]);
    const [likes, setLikes] = React.useState(undefined);
    const [recipes, setRecipes] = React.useState([]);

    const store = useSelector(state => state.fireReducer);
    const classes = useStyles();

    useEffect(() => {

      if( !store.firestore_user)
        return;

      let current_email = store.firestore_user.email;
      console.log("list for firestore_user: " + current_email)

      // lists likes for the user
      getLikesDocsForUser(current_email).then((like_docs) => {
        setLikes(like_docs); // console.log("Mu! loaded " + loadedDoc)

        let liked_recipes_ids = like_docs.liked_recipes;
        if ( liked_recipes_ids != undefined) {

          let temp_recipes = [];
          // previously liked recipes will persist in the firestore map but be false
          Object.keys(liked_recipes_ids).forEach(function(key) {
              if(liked_recipes_ids[key] === true)
                temp_recipes.push(key)
          });
          console.log(temp_recipes)
          recipe_fetcher(temp_recipes); // Object.keys(props.recipemap)
        }

      });

    }, [store.firestore_user]);

    let getLikesDocsForUser = function(current_email) {
      return new Promise((resolve, reject) => {

        let likesRef = store.db.collection('recipe_likes').doc(current_email);

        likesRef.get().then(function(doc) {
          let data = doc.data();
          //data.id = doc.id;
          console.log(data)
          resolve(data);

        });
      });
    }

    // fetch by list of recipe ids
    const recipe_fetcher = (recipe_id_list) => {

      let temp_recipes = [];
      let ref;
      recipe_id_list.map( (recipe_id, idx) => {

        ref = store.db.collection('recipes').doc(recipe_id);
        ref.get().then(function(doc) {
            if (doc.exists) {

                let data = doc.data();
                data.id = doc.id;
                temp_recipes.push(data);
                if (idx == recipe_id_list.length - 1) {
                  setRecipes(temp_recipes);
                  setlistState(temp_recipes);
                  console.log(temp_recipes)
                }
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      })
    }

    const onDragEnd = result => {
        const { source, destination } = result;

        console.log(result)

        // dropped outside the list
        if (!destination) {
            return;
        }

        if(destination.droppableId.substring(0, 4) === 'list') {
          console.log("add item: " + result.draggableId + " to list: " + result.destination.droppableId )
          listState.splice(source.index, 1);
          return;
        }

        // if just reordered in same list
        if (source.droppableId === destination.droppableId) {
            const updated_items = reorder(
                listState,
                source.index,
                destination.index
            );

            let temp_selected = updated_items;
            setlistState(updated_items);

        } // moved to another list
    };

    //let likes_by_user_jxs = (likes != undefined) ? <ListContainer recipemap={likes.liked_recipes} noheader={true}/> : undefined;

    return (listState.length > 0) ? (
        <div style={{margin: 10}}>
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={classes.listDroppable}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
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

                                            <DraggableRecipe recipe={item}/>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>

              <div className={classes.listDroppable}>
                <Droppable droppableId="list_test1" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
            <div className={classes.listDroppable}>
              <Droppable droppableId="list_test2" direction="horizontal">
                  {(provided, snapshot) => (
                      <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}>
                          {provided.placeholder}
                      </div>
                  )}
              </Droppable>

          </div>
        </DragDropContext>
      </div>
    ) : null;

}


const useStyles = makeStyles({
  listDroppable: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 5
  },
  listimage: {
    maxHeight: '120px',
    maxWidth: '120px',
    minWidth: '120px',
    minHeight: '120px',
    objectFit: 'cover',
    borderRadius: 10
  }
});


// Put the things into the DOM!
export default ListPage
