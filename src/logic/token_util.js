import axios from 'axios';
import Cookie from 'universal-cookie';

export async function getTokenOrRefresh() {
    const cookie = new Cookie();
    const speechToken = cookie.get('speech-token');

    if (speechToken === undefined) {

        const speechKey = process.env.REACT_APP_SPEECH_KEY // ||  'd262551f0439400693076915358f17a5' //  
        const speechRegion = process.env.REACT_APP_SPEECH_REGION  // || 'northeurope' // 

        console.log("speechKey " + speechKey)
        console.log("speechRegion " + speechRegion)

        const headers = { 
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        try {
            const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
            

            // const res = await axios.get('/api/get-speech-token');
            const token = tokenResponse.data;
            const region = speechRegion;
            cookie.set('speech-token', region + ':' + token, {maxAge: 540, path: '/'});

            console.log('Token fetched from back-end: ' + token);
            return { authToken: token, region: region };
        } catch (err) {

            return { authToken: null, error: err.response.data };
        }
    } else {
        console.log('Token fetched from cookie: ' + speechToken);
        const idx = speechToken.indexOf(':');
        return { authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) };
    }
}