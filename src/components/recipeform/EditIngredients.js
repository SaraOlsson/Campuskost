
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import React from 'react';
import DragNDrop from '../DragNDrop';
import Button from '@material-ui/core/Button';
import useInstructions from "./useInstructions"
import {useTranslation} from "react-i18next";
import '../../style/Animations.css';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const HEADER = "HEADER";
const ROW = "ROW";

const getListStyle = isDraggingOver => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
  ...draggableStyle
});

function IngredientsList(props) {

  const classes = useStyles();
  const {t} = useTranslation('common');  

  const {
    instructions: ingredients,
    onReorder,
    editObject,
    saveEdited,
    addInstruction,
    removeInstruction,
    customFieldsData,
    setCustomFieldsData,
    enterPress,
    getOrder,
    getMyItems,
    listClick
  } = useInstructions({
    propertyName: "ingredients",
    customFieldsDefault: {quantity: "", measure: "", name: ""},
    HEADER: HEADER,
    DEFAULT: ROW
  })

  const hasOrderProp = () => {

    if( ingredients.length < 1 )
      return false;
      
    return (ingredients[0].order !== undefined) ? true : false;
 
  }

  // content in each draggable item
  let ingredientsjsx = ingredients.map((ingred, idx) =>
  <React.Fragment key={idx}>
    <ListItem onClick={() => listClick(ingred)} className={(ingredients.indexOf(editObject) === idx ? 'testis' : '')} style={{minHeight: 40}}>
      <ListItemText
        classes={{ primary: (ingred.type === HEADER) ? classes.bold : '' }}
        primary={ ingred.quantity + " " + ingred.measure + " " + ingred.name }
      />

    </ListItem>
    { idx < ingredients.length - 1 && <Divider component="li" /> }

  </React.Fragment>
  );

  const onValueChange = (event) => {

    const {name, value} = event.target
    setCustomFieldsData(
        Object.assign({}, customFieldsData, {[name]: value.toLowerCase()})
    )
  }

  return (
    <div>

      <Grid className="test"
        container
        spacing={1}
        justify="center"
        alignItems="center"
      >

      <Grid item xs={12}>
        <List dense={true} className={classes.ingredientslist}>

          { hasOrderProp() ?
            <DragNDrop items={getMyItems(ingredients, ingredientsjsx)} getListStyle={getListStyle} getItemStyle={getItemStyle} onReorder={onReorder}/>
            :
            ingredientsjsx
          }

          { editObject === undefined &&

            <ListItem alignItems="center">
              <Button variant="contained" color="primary" onClick={() => addInstruction(ROW)} className={classes.marginRight10}>
                {t('upload.actions.add_ingredient')}
              </Button>
              <Button variant="contained" color="primary" onClick={() => addInstruction(HEADER)}>
              {t('upload.actions.add_header')}
              </Button>
            </ListItem>
          }

        </List>
      </Grid>

      {/* Adding new row or editing */}
      { editObject !== undefined &&

        <React.Fragment>

          {/* note: may not have type attribute */}
          { editObject.type !== HEADER &&

            <React.Fragment>
              <Grid item xs={3}>
                <TextField required variant="outlined" 
                label={t('upload.data.quantity')} 
                InputLabelProps={{shrink: true}} 
                value={customFieldsData.quantity} 
                name="quantity"
                onChange={onValueChange}
                />
              </Grid>
              {/* <Grid item xs={2}>
                <TextField variant="outlined" label="mått" InputLabelProps={{shrink: true}} 
                value={customFieldsData.measure} 
                name="measure"
                onChange={onValueChange} />
              </Grid> */}

            <Grid item xs={2}>
              <Select 
                required
                autoWidth={false}
                style={{minWidth: 120}}
                variant="outlined"
                label={t('upload.data.measure')}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={customFieldsData.measure}
                name="measure"
                onChange={onValueChange}
              >
                <MenuItem value={"dl"}>dl</MenuItem>
                <MenuItem value={"msk"}>msk</MenuItem>
                <MenuItem value={"tsk"}>tsk</MenuItem>
                <MenuItem value={"kryddmått"}>kryddmått</MenuItem>
                <MenuItem value={"stycken"}>stycken</MenuItem>
                <MenuItem value={"gram"}>gram</MenuItem>
                <MenuItem value={customFieldsData.measure}>{customFieldsData.measure}</MenuItem>
              </Select>
            </Grid>
            
            {/* <Grid item xs={2}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Mått</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={customFieldsData.measure}
                name="measure"
                onChange={onValueChange}
              >
                <MenuItem value={"dl"}>dl</MenuItem>
                <MenuItem value={"msk"}>msk</MenuItem>
                <MenuItem value={"tsk"}>tsk</MenuItem>
              </Select>
            </FormControl>
            </Grid> */}

            </React.Fragment>

          }

          <Grid item xs={editObject.type !== HEADER ? 5 : 10}>
            <TextField required variant="outlined" label={t('upload.data.ingredient')} InputLabelProps={{shrink: true}} 
            value={customFieldsData.name} 
            name="name"
            onChange={onValueChange}
            onKeyPress={(ev) => enterPress(ev)}/>
          </Grid>

          <Grid item xs={1}>
            <CheckCircleIcon onClick={saveEdited} className={classes.greenicon} />
          </Grid>
          <Grid item xs={1}>
            <DeleteForeverIcon onClick={removeInstruction} className={classes.redicon} />
          </Grid>
        
        </React.Fragment>
      }

      </Grid>

    </div>
  );
}


// material ui design
const useStyles = makeStyles(theme => ({
  body: {
    padding: 15
  },
  buttontext: {
    textTransform: 'unset'
  },
  input: {
    color: 'black',
    width: 200
  },
  loadedimage: {
    width: '100%',
    borderRadius: '4px'
  },
  root: {
    width: '100%',
  },
  formlabel: {
    marginRight: '30px'
  },
  imagediv: {
    background: '#fbfbfb',
    borderRadius: '4px',
    padding: '40px',
    marginTop: '8px'
  },
  uploaddiv: {
    background: theme.palette.campuskost.teal, 
    borderRadius: '4px',
    padding: '40px',
    marginTop: '8px'
  },
  greenicon: {
    color: theme.palette.campuskost.teal
  },
  redicon: {
    color: 'red'
  },
  newListItem: {
    background: '#3f51b5',
    color: 'white',
    borderRadius: '5px',
    width: '200px'
  },
  titlediv: {
    background: 'gray'
  },
  marginRight10: {
    marginRight: '10px'
  },
  bold: {
    fontWeight: 'bold'
  }
}));

export default IngredientsList;
