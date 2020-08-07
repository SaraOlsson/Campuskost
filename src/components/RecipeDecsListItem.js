import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import React, { useState } from "react";

function RecipeDecsListItem(props) {

    const [checked, setChecked] = useState(false);
    const classes = useStyles();
  
    let idx = props.idx;
  
    const onIngredClick = (idx) => {
      setChecked(!checked);
    }
  
    let icon = (checked === true ) ? <CheckBoxIcon className={classes.checkIcon}/> : <CheckBoxOutlineBlankIcon className={classes.checkIcon}/> ;
  
    return (
      <React.Fragment>
        <ListItem
          onClick={() => onIngredClick(idx)}
        >
          {icon}
          <ListItemText primary={ props.desc }/>
        </ListItem>
        { idx < props.len - 1 && <Divider component="li" /> }
      </React.Fragment>
    );
  }

  const useStyles = makeStyles({
    checkIcon: {
        marginRight: '10px',
        color: '#68bb8c'
      }
  });

export default RecipeDecsListItem;