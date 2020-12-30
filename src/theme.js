import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';
import { yellow, white } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    //primary: purple,
    primary: {
      light: '#757ce8',
      main: '#0081B3', //'#227c9d',
      dark: '#002884',
      contrastText: '#fff',
    },
    // secondary: red,
    campuskost: {
      teal: '#43A58E',// '#17c3b2', //'#68bb8c'
      lightgrey: '#f1f1f1'
    }
  },
  status: {
    danger: 'orange',
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },

  overrides: {
    MuiFabRoot: { // Name of the component ⚛️ / style sheet
      height: 16 // working?
    },

    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#43A58E' // WORKS
      }
    },

    MuiOutlinedInput: {
      multiline: {
        backgroundColor: "white"
      }
    },

    MuiFormControl: {
      root: {
        margin: 5
      }
    },

    MuiButton: {
      root: {
        textTransform: 'unset !important'
      }
    },

    MuiExpansionPanel: {
      root: {
        '&::before': {
          display: 'none'
        }
      } 
    },

    MuiExpansionPanelDetails: {
      root: {
        padding: 15,
        display: 'block',
        paddingTop: 0,
        maxHeight: 200,
        overflowY: 'scroll'
      }
    },

    MuiGridList: {
      root: {
        justifyContent: 'center',
        width: '100%',
        margin: 0
      }
    },

    MuiTabs: {
      indicator: {
        backgroundColor: '#ffffff73 !important'
      }
    },

    MuiBox: {
      root: {
        padding: 0
      }
    },

    MuiFormControlLabel: {
      label: {
       marginLeft: 27
      }
    },
    
    // MuiOutlinedInput: {
    //   input: {
    //     padding: '8.5px 10px'
    //   }
    // }


    // MuiInputBase: {
    //   root: {
    //     width: '97%'
    //   }
    // }

  },


});

export default theme;
