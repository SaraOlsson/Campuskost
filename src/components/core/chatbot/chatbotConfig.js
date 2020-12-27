// Config starter code
import { createChatBotMessage } from "react-chatbot-kit";
import {StartOptions} from "./widgets/StartOptions"
import React from "react"
import PersonIcon from '@material-ui/icons/Person';
import FaceIcon from '@material-ui/icons/Face';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';

const onClose = () => {
    console.log("WOW close")
}

const config = {
  initialMessages: [
      createChatBotMessage(`Hej! Du kanske är ny på Campuskost?`),
      createChatBotMessage(
        "Välj ett alternativ så berättar jag gärna mer:",
        {
          withAvatar: false,
          delay: 500,
          widget: "infoabout",
        }
      ),
  ],
  botName: "Chefina",
  state: {
    myProp: "wow"
  },
  widgets: [
    {
        widgetName: "infoabout",
        widgetFunc: (props) => <StartOptions {...props} />,
        mapStateToProps: ["myProp"],
    }
  ],
  customComponents: {
    botAvatar: () => <ChatbotMessageAvatar/>,
    header: () => <ChatbotHeader onClose={onClose}/>,
  }
}



const ChatbotHeader = (props) => {

    return (
        <div className="react-chatbot-kit-chat-header">
            Chatta med Chefina 
            <Button 
                onClick={() => props.onClose()}
                style={{
                    position: 'absolute',
                    right: '10px',
                    color: '#68bb8c'
                }}>
                { false && <CancelIcon/> }
            </Button>

        </div>
    )
}

const ChatbotMessageAvatar = () => {
    return (
      <div className="react-chatbot-kit-chat-bot-avatar">
        <div className="react-chatbot-kit-chat-bot-avatar-container">
          <FaceIcon/>
        </div>
      </div>
    );
  };

export default config

//           <p className="react-chatbot-kit-chat-bot-avatar-letter">A</p>
/*

widgets: [
    {
      widgetName: "overview",
      widgetFunc: (props) => <Overview {...props} />,
      mapStateToProps: ["myProp"],
    },
    {
      widgetName: "messageParser",
      widgetFunc: (props) => <MessageParser {...props} />,
      mapStateToProps: ["myProp"],
    },
    {
      widgetName: "actionProviderDocs",
      widgetFunc: (props) => <ActionProviderDocs {...props} />,
      mapStateToProps: ["myProp"],
    },
  ],
  */