// ./src/azure-cognitiveservices-computervision.js

// Azure SDK client libraries
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

// List of sample images to use in demo
// import RandomImageUrl from './DefaultImages';

// Authentication requirements
const key = process.env.REACT_APP_COMPUTERVISIONKEY;
const endpoint = process.env.REACT_APP_COMPUTERVISIONENDPOINT;

console.log(`key = ${key}`)
console.log(`endpoint = ${endpoint}`)

// Cognitive service features
const visualFeatures = [
    "ImageType",
    "Faces",
    "Adult",
    "Categories",
    "Color",
    "Tags",
    "Description",
    "Objects",
    "Brands"
];

export const isConfigured = () => {
    const result = (key && endpoint && (key.length > 0) && (endpoint.length > 0)) ? true : false;
    console.log(`key = ${key}`)
    console.log(`endpoint = ${endpoint}`)
    console.log(`ComputerVision isConfigured = ${result}`)
    return result;
}

// Computer Vision detected Printed Text
const includesText = async (tags) => {
    return tags.filter((el) => {
        return el.name.toLowerCase() === "text";
    });
}
// Computer Vision detected Handwriting
const includesHandwriting = async (tags) => {
    return tags.filter((el) => {
        return el.name.toLowerCase() === "handwriting";
    });
}
// Wait for text detection to succeed
const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

// not working yet. Do the analyzeImage fuction really accept an image file?
export const computerVisionFile = async (file) => {

    // authenticate to Azure service
    const computerVisionClient = new ComputerVisionClient(
        new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

    let src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAADCAYAAABfwxXFAAAARklEQVQIWwXBMQqAMBREwbd/E/D+R/MAtloIIoqNmHVG536nUmiAZaIX3HjS0bpd6VUoQELx4RKy0bwcaQ7NIhmUTFeYHH4VSRtq9/vJ3AAAAABJRU5ErkJggg=="
    
    // analyze image
    const analysis = await computerVisionClient.analyzeImage(src, { visualFeatures });

    // all information about image
    return {...analysis};
}

// Analyze Image from URL
export const computerVision = async (url) => {

    // authenticate to Azure service
    const computerVisionClient = new ComputerVisionClient(
        new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

    // get image URL - entered in form or random from Default Images
    const adultURLImage = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/celebrities.jpg';
    const urlToAnalyze = url || adultURLImage
    
    // analyze image
    const analysis = await computerVisionClient.analyzeImage(urlToAnalyze, { visualFeatures });
    //const analysis = await computerVisionClient.describeImage(urlToAnalyze, { visualFeatures });
    // const analysis = await computerVisionClient.ad

    // text detected - what does it say and where is it
    if (includesText(analysis.tags) || includesHandwriting(analysis.tags)) {
        analysis.text = await readTextFromURL(computerVisionClient, urlToAnalyze);
    }

    // all information about image
    return { "URL": urlToAnalyze, ...analysis};
}
// analyze text in image
const readTextFromURL = async (client, url) => {
    
    let result = await client.read(url);
    let operationID = result.operationLocation.split('/').slice(-1)[0];

    // Wait for read recognition to complete
    // result.status is initially undefined, since it's the result of read
    const start = Date.now();
    console.log(`${start} -${result?.status} `);
    
    while (result.status !== "succeeded") {
        await wait(500);
        console.log(`${Date.now() - start} -${result?.status} `);
        result = await client.getReadResult(operationID);
    }
    
    // Return the first page of result. 
    // Replace[0] with the desired page if this is a multi-page file such as .pdf or.tiff.
    return result.analyzeResult; 
}