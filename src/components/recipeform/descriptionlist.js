
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';
import React from 'react';
import '../../style/GlobalCssButton.css';
import Button from '@material-ui/core/Button';
import DragNDrop from '../DragNDrop';
import useInstructions from "./useInstructions"

const HEADER = "HEADER";
const DESC = "DESC";

const getListStyle = isDraggingOver => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
  ...draggableStyle
});

function DescriptionList(props) {

  const {
    instructions: descriptions,
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
    propertyName: "description",
    customFieldsDefault: {text: ""},
    HEADER: HEADER,
    DEFAULT: DESC
  })

  const classes = useStyles();

  let descriptionjsx = descriptions.map((desc, idx) =>
  <React.Fragment key={idx}>
    <ListItem 
      onClick={() => listClick(desc)} 
      className={(descriptions.indexOf(editObject) === idx ? 'testis' : '')} 
      style={{minHeight: 40, paddingLeft: 15}}>
      <ListItemText
        classes={{ primary: (desc.type === HEADER) ? classes.bold : '' }}
        primary={ getOrder(desc) + desc.text }
      />

    </ListItem>
    { idx < descriptions.length - 1 && <Divider component="li" /> }

  </React.Fragment>
  );

  return (
    <div >

      <Grid className="test"
        container
        spacing={1}
        justify="center"
        alignItems="center"
      >

      <Grid item xs={12}>
        <List dense={true} className={classes.ingredientslist}>

          
          <DragNDrop items={getMyItems(descriptions, descriptionjsx)} getListStyle={getListStyle} getItemStyle={getItemStyle} onReorder={onReorder}/>

          { editObject === undefined &&
            <ListItem alignItems="center">
              <Button variant="contained" color="primary" 
                onClick={() => addInstruction(DESC)} className={classes.marginRight10}>
                {"Lägg till beskrivning"}
              </Button>
              <Button variant="contained" color="primary" 
                onClick={() => addInstruction(HEADER)}>
                {"Lägg till rubrik"}
              </Button>
            </ListItem>
          }


        </List>
      </Grid>

      { (editObject !== undefined  ) &&

        <React.Fragment>

        <Grid item xs={10}>
          <TextField variant="outlined" label="steg" InputLabelProps={{shrink: true}} 
          value={customFieldsData.text} 
          onChange={ event => setCustomFieldsData({text: event.target.value})} 
          onKeyPress={(ev) => enterPress(ev)}/>
        </Grid>

        <Grid item xs={1}>
          <SaveIcon onClick={saveEdited} className={classes.greenicon} />
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

// .toLowerCase()
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

export default DescriptionList;
