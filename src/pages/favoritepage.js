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
  const [likes, setLikes] = React.useState(undefined);

  const [myLists, setMyLists] = React.useState({});
  const [refList, setRefList] = React.useState([]);

  const store = useSelector(state => state.fireReducer);

  useEffect(() => {

    if( !( props.otheruser || store.firestore_user))
      return;

    let current_email = (props.otheruser) ? props.otheruser.email : store.firestore_user.email;
    console.log("list for firestore_user: " + current_email)

    // lists the user follows
    getListDocsForUser(current_email, false).then((loadedDocs) => {
      setLists(loadedDocs); //console.log("Mjau! loaded " + loadedDocs)
    });

    // lists created by the user
    getListDocsForUser(current_email, true).then((loadedDocs) => {
      setLists_by_user(loadedDocs); //console.log("Woff! loaded " + loadedDocs)
    });

    // lists likes for the user
    getLikesDocsForUser(current_email).then((loadedDoc) => {
      setLikes(loadedDoc); // console.log("Mu! loaded " + loadedDoc)
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
          resolve(list_docs);
        })
    });
  }

  // fix not found
  var getLikesDocsForUser = function(current_email) {
    return new Promise((resolve, reject) => {

      let likesRef = store.db.collection('recipe_likes').doc(current_email);

      likesRef.get().then(function(doc) {
        let data = doc.data();
        //data.id = doc.id;
        resolve(data);
      });

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

          {likes_by_user_jxs}

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

export default FavoritePage;
