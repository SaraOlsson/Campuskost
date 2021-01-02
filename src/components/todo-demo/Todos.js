import React from "react";
import { useSelector } from "react-redux";
import AddTodo from "./AddTodo";
import { useFirestoreConnect } from "react-redux-firebase";
import ToDoItem from "./ToDoItem";

const Todos = () => {
  const { displayName, uid } = useSelector((state) => state.firebase.auth);
  useFirestoreConnect({
    collection: `authusers/${uid}/todos`,
    storeAs: "todos",
  });
  const todos = useSelector((state) => state.firestore.data.todos);
  console.log(todos); // has value after a while
  return (
    <div>
      <h3>Hello {displayName}</h3>
      <h4>Todos</h4>
      <AddTodo />
      <ul
        style={{
          listStyleType: "none",
        }}
      >
        {todos &&
          Object.values(todos).map((todo, idx) => (
            <li key={idx + todo.title}>
              <ToDoItem
                title={todo.title}
                isDone={todo.isDone}
                todoID={todo.todoID}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Todos;