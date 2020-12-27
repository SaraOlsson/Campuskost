import firebase from 'firebase'; // REFACTOR
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import resizeImage from '../../logic/resizeImage';
import _ from "lodash"
import '../../style/GlobalCssButton.css';

const DEFAULT_DATA = {
    title: "",
    freetext: "",
    servings: "", // change to int
    cookingtime: ""
    //     ingredients: undefined, 
    //     descriptions: undefined, 
    //     image: undefined,
  }

function useUpload() {

    const [data, setData] = useState(DEFAULT_DATA)

    const [image, setImage] = useState(undefined);
    const [rawImage, setRawImage] = useState(undefined);
    const [smallImage, setSmallImage] = useState(undefined);
    const [newImage, setNewImage] = useState(false);
  
    const [id, setId] = useState(undefined);
    const [upload_wait, setUpload_wait] = useState(false);
    const [done, setDone] = useState(false);
    const [openImageDialog, setOpenImageDialog] = useState(false);
  
    
    const dispatch = useDispatch(); // be able to dispatch
    const store = useSelector(state => state.fireReducer);
    const firestore = useFirestore();
    const upload_store = useSelector(state => state.uploadReducer);
    const history = useHistory();
  
    const { id_param } = useParams();
  

    const defaultsDisp = () => {
      dispatch({
        type: "SETALLDEFAULT"
      })
    }
  
    const fieldDisp = (fieldName, payload) => {
      dispatch({
        type: "SETFIELD",
        field: fieldName,
        payload: payload
      })
    }
  
    const onValueChange = (event) => {
  
      const {name, value} = event.target
      setData(
          Object.assign({}, data, {[name]: value})
      )
  
    }
  
    useEffect(() => {
  
      const edit_mode = id_param !== undefined
      if (edit_mode)
      {
        console.log("MODE: edit")
        // load global state to local state
        setData(
          Object.assign({}, data, upload_store.data)
        )
  
      } else {
        console.log("MODE: new recipe")
      }
  
      return () => {
        console.log("leaving UploadPage") //. has_unsaved:" + upload_store.has_unsaved)
        if(_.isEmpty(upload_store.data) === false) // true)
          console.log("upload store is not empty")
      }
  
    }, []);
  
    const onImageDialogChoise = async (chosedYes, croppedImage = null) => {
  
      setOpenImageDialog(false);
  
      if(chosedYes === true) {
        setImage(croppedImage)
        fieldDisp("image", croppedImage)
        //imageDisp(croppedImage);
  
        let small_img = await resizeImage(croppedImage);
        setSmallImage(small_img)
  
      }
  
    }
  
    const onFileAdd = (files) => {
  
      //setValid({ ...valid, ["image"]: true });
  
      var reader = new FileReader();
      reader.onload = function(e) {
        setRawImage(e.target.result);
        setNewImage(true);
        setOpenImageDialog(true);
      }
  
      try {
        reader.readAsDataURL(files[0]);
      } catch(err) {
          console.log(err.message);
      }
  
    };
  
    const onFileRemove = () => {
      setRawImage(undefined);
      setImage(undefined);
    };
  
    const generateImageFilename = () => {
      return 'recept/' + data.title + '_' + store.auth_user.uid;
    };
  
    // upload image and callback with download URL
    const uploadImage = (callback) => {
      
      setUpload_wait(true);
      // Create a reference to the new image
      let storageRef = firebase.storage(); // REFACTOR TO HOOKS
      let image_filename = generateImageFilename() + '.jpg'
      let newImageRef = storageRef.ref(image_filename); // storageRef.ref('recept/' + title + '_image.jpg');
  
      // Upload image as a Base64 formatted image string.
      let uploadTask = newImageRef.putString(image, 'data_url');
  
      uploadTask.on('state_changed', function(snapshot){
        }, function(error) { // Handle unsuccessful uploads
        }, function() { // Handle successful uploads on complete
  
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            callback(downloadURL);
          });
      }); 
    }
  
    
  
    const uploadAction = async () => {
  
      if(!validUpload()) {
        alert("Upload data is not valid")
        return;
      }
  
      // make sure signed in, let pop up earlier..
      if(store.auth_user === undefined || store.firestore_user === undefined) {
        alert("you have to sign in first")
        return;
      }
  
      // prepare data
      let username = store.firestore_user.username;
      //let recipe_name = upload_store.title;
      let image_filename = generateImageFilename();
  
      let ref_to_user = store.firestore_user.email; // firestore.collection('users').doc(store.firestore_user.email);
      let firestore_timestamp = firebase.firestore.Timestamp.now();
  
      // if create new doc or edit
      //if(upload_store.editmode === false)
      if( id_param === undefined)
      {
        // when image is uploaded, continue with uploading the rest
        uploadImage(function(returnValue_downloadURL) {
          // use the return value here instead of like a regular (non-evented) return value
          let downloadURL = returnValue_downloadURL;
  
          firestore
          .collection("recipes")
          .add({
            user: username,
            title: data.title,
            freetext: data.freetext,
            servings: data.servings,
            cookingtime: data.cookingtime,
            img_url: downloadURL,
            img_filename: image_filename,
            ingredients: upload_store.data.ingredients,
            description: upload_store.data.description,
            user_ref: ref_to_user,
            timestamp: firestore_timestamp
          })
          .then((docRef) => {
            docRef.update({
              recipeID: docRef.id,
            })
            // Document created successfully.
            console.log( "Document created/updated successfully.")
            uploadDone()
            setId(docRef.id)
          });
  
        }); // end of image upload callback
  
      } else {
  
        // UPDATE MODE
        let update_data = {
          title: data.title,
          freetext: data.freetext,
          servings: data.servings,
          cookingtime: data.cookingtime,
          img_filename: image_filename,
          ingredients: upload_store.data.ingredients,
          description: upload_store.data.description,
        };
  
        // either upload with or without image (no new imag needed of recipe _update_)
        if (newImage === false) {
  
          firestore.collection('recipes').doc(id_param).update(update_data);
          uploadDone();
  
        } else {
  
          await uploadImage(function(returnValue_downloadURL) {
            // use the return value here instead of like a regular (non-evented) return value
            update_data.img_url = returnValue_downloadURL;
            firestore.collection('recipes').doc(upload_store.recipe_id).update(update_data);
            uploadDone();
  
          }); // end of image upload callback
   
        }
  
        // to be able to direct to recipe page
        setId(upload_store.recipe_id);
      }
  
    };
  
    const uploadDone = () => {
      setUpload_wait(false);
      setDone(true);
      setData(DEFAULT_DATA)
      defaultsDisp();
    }
  
    const validUpload = () => {
      return ( validTitle() && validImage() && validIngredients() && validDescription() )
    }
  
    const validTitle = () => { return data.title ? true : false }
    const validImage = () => { return (upload_store.data.image || upload_store.data.img_url) ? true : false }
    const validIngredients = () => { return (upload_store.data.ingredients && upload_store.data.ingredients.length > 0) ? true : false }
    const validDescription = () => { return (upload_store.data.description && upload_store.data.description.length > 0) ? true : false }
  
    // when done, there's an option to go to recipe page
    const goToRecipe = () => {
      history.push("/recipe/" + data.title + "/" + id );
    };
  
    return {
        data,
        onValueChange,
        validUpload,
        uploadAction,
        upload_wait,
        done,
        goToRecipe,
        image,
        onFileAdd,
        onFileRemove,
        validTitle,
        validIngredients,
        validDescription,
        validImage,
        openImageDialog,
        onImageDialogChoise,
        rawImage
    }

}

export default useUpload