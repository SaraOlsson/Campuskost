import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import React from "react";
import RecipeDecsListItem from '../components/RecipeDecsListItem';


function RecipeDecsList(props) {

    const classes = useStyles();
  
    let temp_description = [
    {order: 0, text: "Knäck äggen i en bunke (default data)"},
    {order: 2, text: "Stek i pannan meed smör eller kokosolja"},
    {order: 1, text: "Vispa i mjöl, mjölk och salt"}
    ];
  
    let description = (props.description !==  undefined) ? props.description : temp_description;
  
    // sort by order
    description.sort( (desc1, desc2) => desc1.order - desc2.order );
  
    let descjsx = description.map((desc, idx) =>
      <RecipeDecsListItem idx={idx} key={idx} desc={desc.text} len={description.length}/>
    );
  
    return (
      <div>
        <h3> Gör så här </h3>
        <List dense={true} className={classes.ingredientslist}>
          {descjsx}
        </List>
      </div>
    );
  }

  const useStyles = makeStyles({
    ingredientslist: {
     marginTop: '20px',
   }
  });

  export default RecipeDecsList;