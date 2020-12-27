// MessageParser starter code
class MessageParser {
    constructor(actionProvider, state) {
      this.actionProvider = actionProvider;
      this.state = state;
    }

    containsWord(message, list) {
      return (list.some(function(v) { return message.indexOf(v) >= 0; })) // at least one
    }
  
    parse(message) {
      console.log(message)

      // if (message.includes("hej"))
      // {
      //   return this.actionProvider.handleMessageParser("Hej på dig med!");
      // }

      const greeting_substrings = ["hej", "hallå", "tja", "goddag"]
      if (this.containsWord(message, greeting_substrings)) {
        return this.actionProvider.handleMessageParser("Hej på dig med! Undrar du något?");
      }

      const contact_substrings = ["kontakt", "mail", "sammarbete"]
      if (this.containsWord(message, contact_substrings)) {
        return this.actionProvider.handleMessageParser("Det går bra att höra av sig till campuskost@gmail.com");
      }

      const advice_substrings = ["förslag", "mat ikväll", "vad ska jag laga"]
      if (this.containsWord(message, advice_substrings)) {
        return this.actionProvider.handleMessageParser("Pannkakor är alltid gott!");
      }


      return this.actionProvider.handleMessageParser();
    }
  }
  
  export default MessageParser;