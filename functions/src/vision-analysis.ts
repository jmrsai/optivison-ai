
import * as functions from 'firebase-functions';
import {Firestore} from '@google-cloud/firestore';
// The following library is NOT SUPPORTED in Genkit flows
// and should only be used in traditional Cloud Functions.
import {PredictionServiceClient} from '@google-cloud/aiplatform';

// Initialize clients
const firestore = new Firestore();
const clientOptions = {
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
};
const predictionServiceClient = new PredictionServiceClient(clientOptions);

exports.diagnoseEyeImage = functions.storage.object().onFinalize(async (object) => {
  // 1. Get the image URI from the trigger event
  const imageUri = `gs://${object.bucket}/${object.name}`;
  
  if (!object.name) {
    console.log("Object name is undefined, exiting.");
    return null;
  }
  const userId = object.name.split('/')[0]; // Assuming you store images as "userId/imageName.jpg"

  // 2. Prepare the request for your deployed Vertex AI model
  // TODO: Replace with your project ID and endpoint ID
  const endpoint = `projects/YOUR_PROJECT_ID/locations/us-central1/endpoints/YOUR_ENDPOINT_ID`; 
  
  const request = {
    endpoint,
    // The format of the instance depends on your model's expected input.
    // This example assumes a model that accepts a GCS URI in the 'content' field.
    // You may need to base64 encode the image if your model expects that.
    instances: [{ content: imageUri }],
  };

  try {
    // 3. Call the AI model
    const [response] = await predictionServiceClient.predict(request);
    
    if (!response.predictions || response.predictions.length === 0) {
        console.error('No predictions received from Vertex AI.');
        return null;
    }
    const diagnosisResult = response.predictions[0];

    // 4. Save the result to Firestore
    await firestore.collection('diagnoses').add({
        userId: userId,
        imagePath: imageUri,
        diagnosis: diagnosisResult,
        createdAt: new Date(),
    });

    console.log('Diagnosis complete:', diagnosisResult);

  } catch(error) {
    console.error("Error during AI diagnosis or Firestore write:", error);
    // Optionally, write an error status to Firestore or another log
  }
  
  return null;
});
