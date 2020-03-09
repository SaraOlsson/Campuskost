import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import _ from 'underscore';

import ListContainer from '../components/listcontainer';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

function FavoritePage(props) {

  const [lists, setLists] = React.useState([]);
  const [lists_by_user, setLists_by_user] = React.useState([]);

  const [myLists, setMyLists] = React.useState({});
  const [refList, setRefList] = React.useState([]);

  const store = useSelector(state => state.fireReducer);

  useEffect(() => {

    if(props.otheruser) {

      console.log("list for user user: " + props.otheruser)
        //listFetcher(props.otheruser);

    } else if(store.firestore_user) {
      console.log("list for firestore_user: " + store.firestore_user.username)
      //listFetcher(store.firestore_user.email);
      // likedFetcher();
      //testFetcher();

      // lists the user follows
      getListDocsForUser(store.firestore_user.email, false).then((loadedDocs) => {
        // successMessage is whatever we passed in the resolve(...) function above.
        // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
        console.log("Mjau! loaded " + loadedDocs)
        setLists(loadedDocs);

      });

      // lists created by the user
      getListDocsForUser(store.firestore_user.email, true).then((loadedDocs) => {
        // successMessage is whatever we passed in the resolve(...) function above.
        // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
        console.log("Woff! loaded " + loadedDocs)
        setLists_by_user(loadedDocs);

      });

      /*
      myFetchPromise_wrapper(store.firestore_user.username).then((loadedDocs) => {
        // successMessage is whatever we passed in the resolve(...) function above.
        // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
        console.log("Yay! loaded " + loadedDocs)
      }); */

    }

    myFirstPromise.then((successMessage) => {
      // successMessage is whatever we passed in the resolve(...) function above.
      // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
      console.log("Yay! " + successMessage)
    });




  }, [store.firestore_user]);


  var getListDocsForUser = function(current_email, mine) {
    return new Promise((resolve, reject) => {

      let replaced_email = current_email.replace(/\./g, ','); // replaces all dots
      let listsRef = store.db.collection('recipe_lists').where('list_followers.' + replaced_email, '==', true);
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
          console.log(list_docs)
          resolve(list_docs);

          // Aubergine-DefaultChef
        })
    });
  }

  var myFetchPromise_wrapper = function(current_username) {
    return new Promise((resolve, reject) => {

      let listsRef = store.db.collection('lists');
      let list_docs = [];

      let query = listsRef.where('created_by', '==', current_username).get()
        .then(snapshot => {

          snapshot.forEach(doc => {
            // console.log(doc.id, '=>', doc.data());
            list_docs.push(doc.data());
          });
          resolve(list_docs)
        })
    });
  }

  // takes ref to one doc and returns data+id
  var refPromise = function(ref) {
    return new Promise((resolve, reject) => {

      ref.get().then(function(doc) {
        let data = doc.data();
        data.id = doc.id;
        resolve(data);
      });

    });
  }

  // takes snapshot and loop through all docs, to one doc and returns data+id
  var snapshotPromise = function(snapshot, my_lists, current_email) {
    return new Promise((resolve, reject) => {

      let grouped_list = {}; // group by list id
      let list_docs = [];

      snapshot.forEach(doc => {
        // console.log(doc.id, '=>', doc.data());
        let data = doc.data();

        // if simple like (no specific list)
        if(data.list_ref == undefined){
          list_docs.push(data);
        } else {
          // if like belongs to a list

          refPromise(data.list_ref).then((loadedDoc) => {

            //console.log("Ooh! loaded: ")
            //console.log(loadedDoc)

            data.list_doc = loadedDoc;

            //console.log("my_lists " + my_lists)
            //console.log("current_email " + current_email)

            if(my_lists == true && data.list_doc.created_by == current_email || my_lists == false && data.list_doc.created_by != current_email)
            {
              let id_prop = data.list_doc.id;
              if (!grouped_list[id_prop]) {
                grouped_list[id_prop] = [];     // create new slot for this id
              }
              grouped_list[id_prop].push(data); // append to array of this id
            } else {
              console.log("new skipping recipe..")
            }
          });
        }
      });

      console.log("resolve now")
      //setMyLists({ ...myLists, grouped_list });
      resolve(grouped_list);

    });
  }


  const testFetcher = () => {
    let likesRef = store.db.collection('likes');
    //let grouped_by_list = {};

    let current_email = store.firestore_user.email;

    // get all recipes this user likes
    let query = likesRef.where('email', '==', current_email).get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }
        // wait for snapshot results
        let my_lists = true;
        snapshotPromise(snapshot, my_lists, current_email).then((snapresult) => {
          console.log("Ooh! snapresult: ")
          console.log(snapresult)
          // setMyLists(snapresult); // hm doesnt work
        });

      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

  }

  let myFirstPromise = new Promise((resolve, reject) => {
    // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
    // In this example, we use setTimeout(...) to simulate async code.
    // In reality, you will probably be using something like XHR or an HTML5 API.
    setTimeout( function() {
      resolve("Success!")  // Yay! Everything went well!
    }, 250)
  })

  // fetch recipes for the user profile in view
  const listFetcher = (current_username) => {

    let list_docs = [];

    let query = store.db.collection('lists').where('created_by', '==', current_username).get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }
        snapshot.forEach(doc => {
          //console.log(doc.id, '=>', doc.data());

          list_docs.push(doc.data());
        });
        setLists(list_docs);

      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

  }

  const likedFetcher = () => {

    let likesRef = store.db.collection('likes');
    let list_docs = [];

    let list_ids = [];
    let grouped_by_list = {};
    let obj_temp = {};

    let query = likesRef.where('email', '==', store.firestore_user.email).get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }
        snapshot.forEach(doc => {
          // console.log(doc.id, '=>', doc.data());
          let data = doc.data();
          if(data.list_ref == undefined){
            list_docs.push(data);
            //console.log("pushing..")
          } else {
            //console.log("one liked recipe belonged to a list")

            // uploadImage(function(returnValue_downloadURL) {
            let path_segments = data.list_ref._key.path.segments;
            let the_id = path_segments[path_segments.length-1];
            let prop = the_id;

            // console.log(data.list_ref)
            if (!grouped_by_list[prop]) {
              grouped_by_list[prop] = [];
            }
            grouped_by_list[prop].push(data);

            //console.log(grouped_by_list)

            // also append list doc
            /*
            data.list_ref.get().then(function(list_doc) {
              data.list_doc = list_doc.data();
              data.list_id = list_doc.id;

              let prop = list_doc.id
              if (!grouped_by_list[prop]) {
                grouped_by_list[prop] = [];
              }
              grouped_by_list[prop].push(data);
              list_ids.push(list_doc.id);
              obj_temp = { ...obj_temp, [`${prop}`]: grouped_by_list[prop] };
              console.log(obj_temp)
              // setMyLists({ ...myLists, [`${prop}`]: grouped_by_list[prop] });
              // setValid({ ...valid, ["title"]: true });

            }); */
          }
        });

        // setMyLists({ ...myLists, [`${prop}`]: grouped_by_list[prop] });
        setMyLists(grouped_by_list);
        //console.log(grouped_by_list)
        //let my_lists_temp = Object.values(grouped_by_list);
        //console.log(Object.values(grouped_by_list))

        setRefList(list_docs);
        return list_docs;
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

      //console.log("query:")
      //console.log(query)

  }



  let lists_jxs = lists.map((item, i) =>
    <ListContainer key={i} list={item} noheader={false}/>
  );

  let lists_by_user_jxs = lists_by_user.map((item, i) =>
    <ListContainer key={i} list={item} noheader={false} mine={true}/>
  );

  // if user profile view, this prop will be available
  let no_lists_text = (props.otheruser) ? props.otheruser + " har ännu inga sparade listor" : "Inga sparade listor ännu";
  // <ListContainer list={list_with_liked}/>

  let liked_list_jsx = (refList.length >= 1) ? <ListContainer refs={refList} noheader={true}/> : <p> Gillade recept.. </p>


  //console.log(myLists)

  let my_list_jsx = [];
  let lists_I_follow = [];
  let counter = 0;
  for (let [key, value] of Object.entries(myLists)) {
      //console.log(`${key}: ${value}`);

      console.log(value)

      //let ref_list = value.map(_obj => _obj.recipe_ref );
      //console.log(ref_list)
      my_list_jsx.push(<ListContainer key={counter} refs={value} onlyMine={true} myEmail={store.firestore_user.email}/>);
      lists_I_follow.push(<ListContainer key={counter} refs={value} onlyMine={false} myEmail={store.firestore_user.email}/>)
      counter = counter + 1;
  }

/*
  let my_lists_jsx = myLists.map((list_info, i) =>

    <ListContainer key={i} refs={list_info}/>
  ); */

  // <p> - kanske listor som <i>billig vecka, bra matlådemat</i> eller <i>att prova</i> ? </p>
  // <p> Här kommer du se de listor skapade av andra använder som du följer 🍴💎 </p>

  return (

    <div>
    { !props.otheruser &&

      <ExpansionPanel style={{background: '#f1f1f1', marginTop: '8px', borderRadius: '15px'}}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{fontWeight: 'bold'}}> Gillade recept</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>

          {liked_list_jsx}

        </ExpansionPanelDetails>
      </ExpansionPanel>

    }
    { !props.otheruser && <h3>Listor</h3> }
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
    { false && lists_I_follow.length < 1 && <p> {no_lists_text} </p>}

    { (true || lists.length > 0) &&
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

    </div>

  );
}

/*

<div>
{ lists_jxs }
</div>

*/

/*

<React.Fragment>
<h3>Gillade recept</h3>
{liked_list_jsx}
</React.Fragment>

*/

export default FavoritePage;
