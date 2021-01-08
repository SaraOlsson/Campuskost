import React, { useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {useTranslation} from "react-i18next";


export default function AddRecipeList() {

    const [listname, setListname] = useState("");

    const {t} = useTranslation('common')
    const firestore = useFirestore();
    const { email, uid } = useSelector((state) => state.firebase.auth);

    const handleChange = ({ currentTarget: { name, value } }) => {
        if (name === "addList") {
            setListname(value);
        }
    };

    const addNewTodo = (todo) => {
        firestore
          .collection("lists")
          .add({
            title: listname,
            created_by: email,
          })
          .then((docRef) => {
            docRef.update({
              listID: docRef.id,
            });
          });
          setListname("");
    };
      
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly'
        }}>

            <TextField
            label={"Titel"}
            variant="outlined"
            value={listname}
            onChange={(e) => setListname(e.target.value)}
            />
            <Button
              onClick={(event) => {
                event.preventDefault();
                addNewTodo(listname);
              }}
              variant="contained"
              color="primary"
            >
              {t('lists.actions.create_list')}
            </Button>

        </div>
      );
}