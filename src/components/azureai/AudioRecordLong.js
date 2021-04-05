import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import React, {useState, useEffect} from 'react'
import { getTokenOrRefresh } from '../../logic/token_util';
import {useTranslation} from "react-i18next";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')
// docs: https://docs.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/?view=azure-node-latest
// docs (speechrecognizer): https://docs.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest

export default function AudioRecordLong(props) {

  const classes = useStyles()
  const [token, setToken] = useState('') 
  const [displayText, setDisplayText] = useState('')
  const [text, setText] = useState('') // raw result
  const [theRecognizer, setTheRecognizer] = useState(null) // raw result
  const [recordList, setRecordList] = useState([]) // raw result

  const {t, i18n} = useTranslation('common');

  useEffect(() => {

    if(token !== '')
        console.log('got token now. Activate sttFromMic')

  },[token])

  useEffect(() => {

    const newList = [...recordList];
    newList.push(text);
    setRecordList(newList);

    props.recognizedText(text) // send to parent component

  },[text])

  useEffect(() => {
    getTokenOrCookie()
  },[])

  const getTokenOrCookie = async () => {
    const tokenRes = await getTokenOrRefresh();
  }

  // sv-SE
  const sttFromMic = async () => {
    const tokenObj = await getTokenOrRefresh();
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
    // speechConfig.speechRecognitionLanguage = 'sv-SE' //  'en-US';

    const language = i18n.language === 'sv' ? 'sv-SE' : 'en-US'
    speechConfig.speechRecognitionLanguage = language 
    
    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
    setTheRecognizer(recognizer)

    setDisplayText(t('upload.actions.speak_mic')) // 'speak into your microphone...')

    recognizer.startContinuousRecognitionAsync(() => {
      console.log("recording started")
    }, (err) => {
      console.log("error: " + err)
    })

    //  The event recognized signals that a final recognition result is received.
    recognizer.recognized = function(s, e){
      let text_result = e.result.text
      // console.log('recognized text', text_result);
      // script += e.result.text;
      setText(text_result)
      
      
    };
  }

  const stopRecord = () => {

    setDisplayText('')

    if(!theRecognizer)
      return

    theRecognizer.stopContinuousRecognitionAsync(() => {
      console.log("recording stopped")
    }, (err) => {
      console.log("error: " + err)
    })
  }

  return (
  
    <div style={{marginTop: 10}}>
      {/* <h3> Record tests</h3> */}
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<MicIcon/>}
        onClick={() => sttFromMic()}
      >
        {t('upload.actions.record_start')}
      </Button>

      <Button
        variant="contained"
        color="primary"
        startIcon={<MicOffIcon/>}
        onClick={() => stopRecord()}
      >
        {t('upload.actions.record_stop')}
      </Button>    

      <div>
        <code>{displayText}</code>
      </div>

      { props.showList && 
        <div>
          {
            recordList.map( (r, idx) => 
              <p key={idx}>{r}</p>
            )
          }
        </div>
      }

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