import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import React, {useState, useEffect} from 'react'
import { getTokenOrRefresh } from '../../logic/token_util';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')
// docs: https://docs.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/?view=azure-node-latest
// docs (speechrecognizer): https://docs.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest

export default function AudioRecord(props) {

    const classes = useStyles()
    const [token, setToken] = useState('') 
    const [displayText, setDisplayText] = useState('...')
    const [text, setText] = useState('') // raw result
    const [recordList, setRecordList] = useState([]) // raw result

    useEffect(() => {

      //console.log(token)
      if(token !== '')
          console.log('got token now. Activate sttFromMic')
  
    },[token])

    useEffect(() => {
      getTokenOrCookie()
    },[])

    const getTokenOrCookie = async () => {
      console.log("check for valid speech key/region")

      const tokenRes = await getTokenOrRefresh();
      console.log(tokenRes)
  }

  // sv-SE
  const sttFromMic = async () => {
    const tokenObj = await getTokenOrRefresh();
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
    speechConfig.speechRecognitionLanguage = 'sv-SE' //  'en-US';
    
    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

    setDisplayText('speak into your microphone...')

    recognizer.recognizeOnceAsync(result => {
        let displayText;
        if (result.reason === ResultReason.RecognizedSpeech) {
            displayText = `RECOGNIZED: Text=${result.text}`
            setText(result.text)
            setRecordList([...recordList, result.text])
        } else {
            displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
        }

        setDisplayText(displayText)
    });
  }
  
  return (
  
    <div>
      <h3> Record tests</h3>
      <Button
        variant="contained"
        color="primary"
        onClick={() => sttFromMic()}
      >
        {'Record Audio'}
      </Button>      

      <div>
        <code>{displayText}</code>
      </div>

      <div>
        {
          recordList.map( (r, idx) => 
            <p key={idx}>{r}</p>
          )
        }
      </div>

    </div>
  
    )
  }

  const useStyles = makeStyles({
    login_div: {
      background: '#f5f5f5',
      padding: '1em',
      margin: '0.5em',
      borderRadius: '15px'
    }
  })