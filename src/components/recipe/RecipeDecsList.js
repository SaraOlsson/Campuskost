import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import React from "react";
import RecipeDecsListItem from './RecipeDecsListItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {useTranslation} from "react-i18next";

function RecipeDecsList(props) {

    const classes = useStyles();
    const {t} = useTranslation('common');
  
    let temp_description = [
    {order: 0, text: "Knäck äggen i en bunke (default data)"},
    {order: 2, text: "Stek i pannan meed smör eller kokosolja"},
    {order: 1, text: "Vispa i mjöl, mjölk och salt"}
    ];
  
    let description = (props.description !==  undefined) ? props.description : temp_description;
  
    // sort by order
    description.sort( (desc1, desc2) => desc1.order - desc2.order );
  
    let descjsx = description.map((desc, idx) => {
      if(desc.type && desc.type === "HEADER")
        return <ListItem key={idx}><ListItemText classes={{ primary: classes.headerRow }} primary={ desc.text }/></ListItem>;
      else
        return <RecipeDecsListItem idx={idx} key={idx} desc={desc.text} len={description.length}/>
    });
  
    return (
      <div>
        <h3> {t('recipe.description')} </h3>
        <List dense={true} className={classes.ingredientslist}>
          {descjsx}
        </List>
      </div>
    );
  }

  const useStyles = makeStyles(theme => ({
    ingredientslist: {
     marginTop: '20px',
   },
   headerRow: {
    color:  theme.palette.campuskost.teal,
    fontWeight: 'bold'
   }
  }));

  export default RecipeDecsList;