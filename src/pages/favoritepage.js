import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';

import ListContainer from '../components/listcontainer';

function FavoritePage(props) {

  const [lists, setLists] = React.useState([]);

  const store = useSelector(state => state.fireReducer);

  useEffect(() => {

    if(props.otheruser) {

      console.log("list for user user: " + props.otheruser)
      listFetcher(props.otheruser);

    } else if(store.firestore_user) {
      console.log("list for firestore_user: " + store.firestore_user.username)
      listFetcher(store.firestore_user.username);

    }
  }, [store.firestore_user]);

  // fetch recipes for the user profile in view
  const listFetcher = (current_username) => {

    let citiesRef = store.db.collection('lists');
    let list_docs = [];

    let query = citiesRef.where('created_by', '==', current_username).get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }
        snapshot.forEach(doc => {
          // console.log(doc.id, '=>', doc.data());
          list_docs.push(doc.data());
        });
        setLists(list_docs);
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

  }

  let lists_jxs = lists.map((item, i) =>
    <ListContainer key={i} list={item}/>
  );

  let no_lists_text = (props.otheruser) ? props.otheruser + " har ännu inga sparade listor" : "Inga sparade listor ännu";

  return (

    <div>
    { !props.otheruser && <h3>Dina listor</h3> }
    { lists.length < 1 && <p> {no_lists_text} </p>}
    <div>
    { lists_jxs }
    </div>
    </div>

  );
}

export default FavoritePage;
