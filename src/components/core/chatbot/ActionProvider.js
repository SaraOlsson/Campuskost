
// ActionProvider starter code
class ActionProvider {
    constructor(createChatBotMessage, setStateFunc, createClientMessage) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
        this.createClientMessage = createClientMessage;
    }

    getReplayOptionMessage = () => {
        
        let mess = this.createChatBotMessage(
        "Undrar du något annat? Välj ett alternativ så berättar jag gärna mer:",
        {
          withAvatar: false,
          delay: 5000,
          widget: "infoabout",
        }
        )

        return mess
    }

    handleMessageParser = (answer = "") => {
        // const messages = this.createChatBotMessage(
        //   "The message parser controls how the bot reads input and decides which action to invoke.",
        //   { widget: "messageParser", withAvatar: true }
        // );

        if(answer !== "")
        {
            const answer_mess = this.createChatBotMessage(answer)
            this.addMessageToBotState(answer_mess)
            return

        }

        const messages = this.createChatBotMessage(
          "Än så länge förstår jag inte vad du menar. Jag behöver träna lite!"
        );

    
        this.addMessageToBotState(messages);
        console.log("hey, in handleMessageParser")
    }

    addMessageToBotState = (messages) => {
        if (Array.isArray(messages)) {
            this.setState((state) => ({
            ...state,
            messages: [...state.messages, ...messages],
            }));
        } else {
            this.setState((state) => ({
            ...state,
            messages: [...state.messages, messages],
            }));
        }
    }

    handleAboutDocs = () => {
        console.log("want to know more about Campuskost!")
        const message1 = this.createChatBotMessage(
            "Campuskost är en plattform du kan använda för att samla recept som du själv eller andra skapat"
        );

        const message2 = this.createChatBotMessage(
            "Läs mer här om utvecklingen av Campuskost",
            {
                withAvatar: false,
                delay: 1500,
            }
        );
  
        this.addMessageToBotState([message1, this.getReplayOptionMessage()]);
    }

    handleUploadDocs = () => {
        console.log("want to know more about upload!")
        const message = this.createChatBotMessage(
            "För att ladda upp ett recept behöver du en titel, ingredienser, beskriving och en bild."
        );
  
        this.addMessageToBotState(message);
    }
}
  
export default ActionProvider;