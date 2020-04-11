import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

const grid = 15;

const getItemStyle = (isDragging, draggableStyle) => {

  // console.log("isDragging: " + isDragging)

  return {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0px 10px ${grid}px 0px`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : '#68bb8c', // 'lightgreen
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


function ListPageSafe() {

    const [listState, setlistState] = React.useState({
        items: getItems(10),
        selected: getItems(5, 10)
    });

    const classes = useStyles();

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    let id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };

    // get list content given id
    const getList = id => listState[id2List[id]];

    const onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if(destination.droppableId.substring(0, 4) === 'list') {
          // console.log("add to list")
          console.log("add item: " + result.draggableId + " to list: " + result.destination.droppableId )
          let sourceList = getList(source.droppableId);
          sourceList.splice(source.index, 1);
          //console.log(result)
          return;

        }

        // if just reordered in same list
        if (source.droppableId === destination.droppableId) {
            const updated_items = reorder(
                getList(source.droppableId),
                source.index,
                destination.index
            );

            let temp_selected = updated_items;

            setlistState({
              items: updated_items,
              selected: listState.selected
            });

        } else // if moved to another list
        {
          console.log("should not be here since only one list")

            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination
            );

            setlistState({
              items: result.droppable,
              selected: result.droppable2
            })

        }
    };


    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity

    return (
        <div style={{margin: 10}}>
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={classes.listDroppable}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {listState.items.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps
                                                    .style
                                            )}>
                                            {item.content}
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
    );

}

const useStyles = makeStyles({
  listDroppable: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 5
  }
});

/*

<div className={classes.listDroppable}>
    <Droppable droppableId="droppable2" direction="horizontal">
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}>
                {listState.selected.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps
                                        .style
                                )}>
                                {item.content}
                            </div>
                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
  </div>

  */

// Put the things into the DOM!
export default ListPageSafe
