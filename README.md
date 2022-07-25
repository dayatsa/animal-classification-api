# animal-classification-api
Animal Classification API

Core Features:
- Animal Classification Using CNN 
- Transfer Learning from VGG16
- API with Tensorflow.js


## 1. Installation

1.1. Clone docker image:

    docker pull dayatsa/anclasapi:1.0
    
1.2. Create container:

    docker container create --name anclasapiserver -p 3000:3000 dayatsa/anclasapi:1.0
   
   
## 2. Run the Server:
2.1.1. Run the server on local:

    docker container start anclasapiserver
    
2.1.2. Check server logs:

    docker container logs anclasapiserver
    
    
## 2. Predict Image:
2.1.1. Predict image using Postman:

  Method POST:
  
    http://localhost:3000/predict
    
  Body
  
    key: image (select file)
    
    value: (select image)
 
