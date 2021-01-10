import { createMuiTheme } from '@material-ui/core/styles';
// import { yellow, white, red, purple } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    //primary: purple,
    primary: {
      light: '#757ce8',
      main: '#0081B3', //'#227c9d',
      dark: '#002884',
      contrastText: '#fff',
    },
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
    MuiFabRoot: { 
      height: 16 // working?
    },

    // IF want to override
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

    // not uppercase on buttons
    MuiButton: {
      root: {
        textTransform: 'unset !important'
      }
    },

    // remove line in expansion header
    MuiAccordion: {
      root: {
        '&::before': {
          display: 'none'
        }
      } 
    },

    // e.g. scroll in recipe/desciption edit view
    MuiAccordionDetails: {
      root: {
        padding: 15,
        display: 'block',
        paddingTop: 0,
        maxHeight: 200,
        overflowY: 'scroll'
      }
    },

    // remove shadow under e.g. expansion header in upload page
    MuiPaper: {
      elevation1: {
        boxShadow: 'none'
      }
    },

    // placement of gridlist
    MuiGridList: {
      root: {
        justifyContent: 'center',
        width: '100%',
        margin: 0
      }
    },

    // line under tab to indicate which is active
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

    // e.g. for recipe item
    MuiGridListTile: {
      tile: {
        height: '100%',
        display: 'block',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 20
      }
    }
    
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
