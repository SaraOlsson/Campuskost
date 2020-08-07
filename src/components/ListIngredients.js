import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from "react";

function ListIngredients(props) {

    const classes = useStyles();
  
    let ingredients = (props.ingredients !==  undefined) ? props.ingredients : [];
  
    let ingredientsjsx = ingredients.map((ingred, idx) =>
    <React.Fragment key={idx}>
      <ListItem>
        <ListItemText
          primary={ ingred.quantity + " " + ingred.measure + " " + ingred.name }
        />
  
      </ListItem>
      { idx < ingredients.length - 1 && <Divider component="li" /> }
    </React.Fragment>
    );
  
    return (
      <div>
        <h3> Ingredienser </h3>
        <List dense={true} className={classes.ingredientslist}>
          {ingredientsjsx}
        </List>
      </div>
    );
  }

  const useStyles = makeStyles({
    ingredientslist: {
     marginTop: '20px',
    }
  });

  export default ListIngredients