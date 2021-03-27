import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import React, {useState, useEffect} from 'react'
import { getTokenOrRefresh } from '../../logic/token_util';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')
// docs: https://docs.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/?view=azure-node-latest
// docs (speechrecognizer): https://docs.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest

export default function AudioRecordLong(props) {

    const classes = useStyles()
    const [token, setToken] = useState('') 
    const [displayText, setDisplayText] = useState('...')
    const [text, setText] = useState('') // raw result
    const [theRecognizer, setTheRecognizer] = useState(null) // raw result
    const [recordList, setRecordList] = useState([]) // raw result

    console.log(recordList)

    useEffect(() => {

      //console.log(token)
      if(token !== '')
          console.log('got token now. Activate sttFromMic')
  
    },[token])

    useEffect(() => {

      const newList = [...recordList];
      newList.push(text);
      setRecordList(newList);
  
    },[text])

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
    setTheRecognizer(recognizer)

    setDisplayText('speak into your microphone...')

    recognizer.startContinuousRecognitionAsync(() => {
      console.log("recording started")
    }, (err) => {
      console.log("error: " + err)
    })

    //  The event recognized signals that a final recognition result is received.
    recognizer.recognized = function(s, e){
      let text_result = e.result.text
      console.log('recognized text', text_result);
      // script += e.result.text;
      setText(text_result)
      
    };
  }

  // const addRecognized = (record) => {
  //   const newList = [...recordList];
  //   newList.push(record);
  //   setRecordList(newList);
  // }

  const stopRecord = () => {
    console.log("stop now")

    theRecognizer.stopContinuousRecognitionAsync(() => {
      console.log("recording stopped")
    }, (err) => {
      console.log("error: " + err)
    })
  }

  const getRecognized = () => {
    console.log("getRecognized")

    let listenNow = theRecognizer.recognized
    console.log(listenNow)
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

      <Button
        variant="contained"
        color="primary"
        onClick={() => stopRecord()}
      >
        {'Stop recording'}
      </Button> 

      <Button
        variant="contained"
        color="primary"
        onClick={() => getRecognized()}
      >
        {'Get Recognized'}
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