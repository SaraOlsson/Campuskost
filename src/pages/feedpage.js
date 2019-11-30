import React, {useState, useEffect} from 'react';
import { BrowserRouter as Link} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

function FeedPage(props) {

  const [images, setImages] = useState(default_content());
  const [recipes, setRecipes] = useState(undefined);
  const [docs, setDocs] = useState(undefined);

  useEffect(() => {
    // someFetcher();
  }, []);

  const classes = useStyles();
  let recpiesRef = props.db.collection('recipes');

  function default_content() {
    let images_array = [];
    for(let i = 0; i < 3; i++)
      images_array.push(<ImageContainer key={i} listId={i} data={{title: "Pannkaka", user: "Sara"}}/>);
    return images_array;
  }

  const someFetcher = async () => {

    recpiesRef.get()
      .then(snapshot => {

        let images_array = [];
        let recipe_docs = [];

        snapshot.forEach(doc => {
          images_array.push(<ImageContainer key={doc.id} listId={doc.id} data={doc.data()}/>);
          recipe_docs.push(doc.data());
        })

        setImages(images_array);
        setRecipes(recipe_docs);

      })
      .catch(err => {
        console.log('Error getting documents', err);
    });

  }

  return (
    <div>
      <h1>Nya recept!</h1>
      <div className={classes.imageContainer}>{images}</div>
    </div>
  );

}

function ImageContainer(props) {

  const classes = useStyles();

  return (
    <Link to={"/recipe/" + props.data.title } >
      <div>
      <div className={classes.foodImg}></div>
      {props.data.title}
      </div>
    </Link>
  );
}

const useStyles = makeStyles({
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 50,

  },
  foodImg: {
    backgroundColor: 'pink',
    height: 100,
    width: 100,
    margin: 5,
    borderRadius: 20
  },
});

export default FeedPage;
