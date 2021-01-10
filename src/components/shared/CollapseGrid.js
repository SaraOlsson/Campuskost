import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, {useState} from 'react';

function CollapseGrid(props) {

    const [expandedState, setExpandedState] = useState(false);
    const classes = useStyles();

    const onExpand = (e, expanded, id) => {
        
        setExpandedState(!expandedState);

        if(props.onExpand)
            props.onExpand(e, expanded, id);
    }

    let isExpanded = props.expandedCheck ? props.expandedCheck(props.controlName) : expandedState;

    return (
  
      
        <Accordion className={classes.expanel}
            onChange={(e, expanded) => onExpand(e, expanded, props.controlName)}
            expanded={isExpanded}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            aria-controls="additional-actions1-content"
            id="additional-actions1-header"
          >
  
          <FormLabel component="legend" className={classes.formlabel}> {props.label} </FormLabel>
  
          </AccordionSummary>
          <AccordionDetails>
            {props.children}
          </AccordionDetails>
        </Accordion>
      
  
    );
  
}

  
// material ui design
const useStyles = makeStyles(theme => ({
    expanel: {
      background: '#fbfbfb', 
      marginTop: '8px'
    },
    formlabel: {
      marginRight: '30px',
      color: 'black'
      /*fontWeight: 'bold'*/
    }
}));


export default CollapseGrid;
