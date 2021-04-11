import React, { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

function DragNDrop(props) {

  const [items, setItems] = useState(props.items)

  React.useEffect(() => {
    setItems(props.items)
  }, [props.items])

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const reordered_items = reorder(
      items,
      result.source.index,
      result.destination.index
    )

    setItems(reordered_items)
    props.onReorder(reordered_items)

  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  
return (
    <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="droppable">
        {(provided, snapshot) => (
        <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={props.getListStyle(snapshot.isDraggingOver)}
        >
            {items.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                    <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={props.getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                    )}
                    >
                        {item.content}
                    </div>
                )}
            </Draggable>
            ))}
            {provided.placeholder}
        </div>
        )}
    </Droppable>
    </DragDropContext>
    )
  
}

export default DragNDrop