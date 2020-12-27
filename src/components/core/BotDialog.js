import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { makeStyles } from '@material-ui/core/styles';

//
import Chatbot from "react-chatbot-kit";

import config from "./chatbot/chatbotConfig";
import MessageParser from "./chatbot/MessageParser";
import ActionProvider from "./chatbot/ActionProvider";
//


// RCE CSS
import 'react-chat-elements/dist/main.css';
// MessageBox component
import { MessageBox } from 'react-chat-elements';
import { MessageList } from 'react-chat-elements'

export default function BotDialog(props) {

  const classes = useStyles()

  const handleClose = (chosedYes) => {
    props.onAlertClose(chosedYes);
  };

  return !props.open ? null : (
      <div className={classes.appChatbotContainer}>
        <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        />
    </div>
  )

//   return (

//       <Dialog
//         open={props.open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
//         <DialogContent>

//         <Chatbot
//         config={config}
//         messageParser={MessageParser}
//         actionProvider={ActionProvider}
//         />

//         {/*
//         <MessageBox
//         position={'left'}
//         type={'text'}
//         text={'Hej! Jag heter Chefina, är du ny här?'}/>

//         <MessageList
//             className='message-list'
//             lockable={true}
//             toBottomHeight={'100%'}
//             dataSource={[
//                 {
//                     position: 'right',
//                     type: 'text',
//                     text: 'Hej, jo jag skulle vilja laga något nytt ikväll',
//                     date: new Date(),
//                 },
//                 {
//                     position: 'left',
//                     type: 'text',
//                     text: 'Okej! Vad sägs om halloumigryta?',
//                     date: new Date(),
//                 }
//             ]} /> */}


//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => handleClose(false)} color="primary">
//             {props.NoOptionText}
//           </Button>
//           <Button onClick={() => handleClose(true)} color="primary" autoFocus>
//             {props.yesOptionText}
//           </Button>
//         </DialogActions>
//       </Dialog>

//   );
}

const useStyles = makeStyles({
    appChatbotContainer: {
        margin: '40px 0',
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        right: '40px',
        bottom: '40px',
        zIndex: '9999',
        boxShadow: '5px 5px 13px rgba(91,81,81,.4)',
        borderRadius: '5px'
    }
  });
