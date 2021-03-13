import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
import 'firebase/auth';
import 'firebase/firestore';
import React, { Suspense, useEffect } from 'react';
import Draggable from 'react-draggable'; // The default
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

// import our css
import './App.css';
import BottomMenuBar from "./components/app/BottomMenuBar";
import TopMenuBar from './components/app/TopMenuBar';
import useAuthUser from './components/app/useAuthUser';
import BotDialog from "./components/core/BotDialog";
import useDataLoad from './components/core/useDataLoad';
import PrivateRoute from "./components/core/PrivateRoute";
import Snackbar from './components/app/SnackBar';
import Todos from "./components/todo-demo/Todos";
// import our page components
import {
  FeedPage,
  ListPage,
  LoginPage,
  NoticePage,
  ProfilePage,
  RecipePage,
  SearchPage,
  SettingsPage,
  TermsPage,
  UploadPage
} from './pages';
import * as serviceWorker from './serviceWorker';

//import {ErrorBoundary} from './pages/ErrorBoundary';
// require('dotenv').config(); // check if we need this

// main component of the app
function App() {

  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [openBotDialog, setOpenBotDialog] = React.useState(false);

  const classes = useStyles();
  
  const userEmail = useSelector(state => state.firebase.auth.email);

  useDataLoad(userEmail)
  useAuthUser()
  

  useEffect(() => {
    if(serviceWorker.hasUpdates === true) {
      setOpenUpdateDialog(true);
    }
  }, [serviceWorker.hasUpdates])

  const closeDialog = (action) => {
    setOpenUpdateDialog(false)
  };

  const closeBotDialog = (action) => {
    setOpenBotDialog(false)
  };

  let update_message = 'New content is available and will be used when all tabs for this page are closed';

  const onBotClick = () => {
    console.log("onBotClick!")
    setOpenBotDialog(!openBotDialog)
  }

  // const handleClickAway = (event) => {
  //   //console.log(event)
  //   //console.log("handleClickAway!")
  //   if(openBotDialog === true)
  //     setOpenBotDialog(false)
  // }  

  return (

    <Suspense fallback="loading">

    <div className={classes.body}>

      <div>

        <div className={classes.headerrow}>
          <TopMenuBar/>
        </div>

        <div id="chat" className={`${classes.mainContainer}`}>

          <Draggable onMouseDown={onBotClick} axis="y" bounds={{bottom: 0, top: -400}}>
            <div className={classes.botButton}>
            <Fab color="primary" aria-label="add">
              <ChatBubbleRoundedIcon onClick={onBotClick} />
            </Fab>
            </div>
          </Draggable>

          <BotDialog open={openBotDialog} onAlertClose={closeBotDialog}/>

          <Switch>
            <Route exact path="/home" component={FeedPage}/>
            <Route path="/login" component={LoginPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/profile/:username_url" component={ProfilePage} />
            <Route path="/upload/:id_param" component={UploadPage} />
            <Route path="/upload" component={UploadPage} />
            <Route path="/notices" component={NoticePage} />
            <Route path="/saved" component={ListPage} />
            <Route path="/recipe/:recipetitle/:id" component={RecipePage} />
            <Route path="/recipe/:id" component={RecipePage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/home" component={FeedPage}/>
            <Route path="/lists" component={ListPage}/>
            <Route path="/terms" component={TermsPage}/>
            <PrivateRoute path = "/todos">
              <Todos />
            </PrivateRoute>
            <Route component={FeedPage} />

          </Switch>

          <Snackbar open={openUpdateDialog} handleClose={closeDialog} message={update_message} action={""}/>
        </div>

        <div className={classes.footer}>
          <BottomMenuBar/>
          {/* <svg viewBox="0 0 1366 74" id="shape-wave" style={{fill: '#43a58e', marginBottom: -10}}> 
            <path fill-rule="evenodd" d="M0,6.92209776 C305.760417,-8.06143884 556.887773,1.27998827 753.38207,34.9463791 C949.876366,68.6127699 1154.08234,68.6127699 1366,34.9463791 L1366,74 L0,74 L0,6.92209776 Z">
            </path> 
        </svg> */}
        </div>

      </div>
      

    </div>
    </Suspense>

  );
}

/*
<PrivateRoute path = "/todos">
  <Todos />
</PrivateRoute>
*/


const useStyles = makeStyles({
  body: {
    padding: 15,
    paddingTop: '35px',
    maxWidth: 800,
    marginLeft: 'auto',
    marginRight: 'auto'
    // background: '#d4dcd5'
  },
  mainContainer: {
    paddingTop: '60px',
    paddingBottom: '50px'
  },
  footer: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: 100 + '%',
    display: 'flex',
    justifyContent: 'center'
  },
  headerrow: {
    position: 'fixed',
    left: 0,
    top: 0,
    width: 100 + '%',
    zIndex: 10
  },
  chatbubble: {
    background: 'teal',
    borderRaduis: '15px'
  },
  botButton: {
    position: 'fixed', 
    bottom: '70px', 
    right: '20px',
    zIndex: '10'
  }
});


export default App;
