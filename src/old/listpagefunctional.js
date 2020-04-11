import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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


function ListPageFunctional() {

    const [listState, setlistState] = React.useState({
        items: getItems(10),
        selected: getItems(5, 10)
    });

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    let id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };

    const getList = id => listState[id2List[id]];

    const onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                listState.selected = items;
            }

            setlistState(state);
        } else {
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

    // style={{margin: '100px'}}
    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity

    return (
        <div style={{margin: 10}}>
        <DragDropContext onDragEnd={onDragEnd}>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    margin: 5
                }}>
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
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    margin: 5
                }}>
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
        </DragDropContext>
      </div>
    );

}

// Put the things into the DOM!
export default ListPageFunctional
