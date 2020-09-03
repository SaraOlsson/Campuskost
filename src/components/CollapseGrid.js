import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, {useState} from 'react';
import '../style/GlobalCssButton.css';


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
  
      <Grid item xs={12}>
        <ExpansionPanel className={classes.expanel}
            onChange={(e, expanded) => onExpand(e, expanded, props.controlName)}
            expanded={isExpanded}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            aria-controls="additional-actions1-content"
            id="additional-actions1-header"
          >
  
          <FormLabel component="legend" className={classes.formlabel}> {props.label} </FormLabel>
  
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {props.children}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
  
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
