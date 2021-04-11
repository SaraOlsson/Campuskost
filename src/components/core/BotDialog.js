import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { FadeIn } from 'react-anim-kit'
//
// RCE CSS
import 'react-chat-elements/dist/main.css'
//
import Chatbot from 'react-chatbot-kit'
import ActionProvider from './chatbot/ActionProvider'
import config from './chatbot/chatbotConfig'
import MessageParser from './chatbot/MessageParser'


export default function BotDialog(props) {

  const classes = useStyles()

  // const handleClose = (chosedYes) => {
  //   props.onAlertClose(chosedYes)
  // }

  return !props.open ? null : (
    
      <div className={classes.appChatbotContainer}>
        <FadeIn left by={100}>
        <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        />
        </FadeIn>
    </div>
  )
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
  })
