import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from "react";

function ListIngredients(props) {

    const classes = useStyles();
  
    let ingredients = (props.ingredients !==  undefined) ? props.ingredients : [];

    // sort by order
    ingredients.sort( (ingred1, ingred2) => ingred1.order - ingred2.order );
  
    let ingredientsjsx = ingredients.map((ingred, idx) =>
    <React.Fragment key={idx}>
      <ListItem>
        <ListItemText
          classes={{ primary: (ingred.type === "HEADER") ? classes.headerRow : '' }}
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

  const useStyles = makeStyles(theme => ({
    ingredientslist: {
     marginTop: '20px',
    },
    headerRow: {
      color: theme.palette.campuskost.teal,
      fontWeight: 'bold'
    }
  }));

  export default ListIngredients