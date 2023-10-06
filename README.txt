    #Project:
        Video File Handling with Node.js

    #Description:
        This project is used to Download a large video from a specified directoryId(which we refered ad downloadDirectoryID in the project) into a filePath with filename which we defined. 
        And simulataneously the downloaded file from the filepath will be uploaded into another directory(which is refered as uploadDirectoryId) with a specified uploadFile name. here the file will be uploaded in chunks.
        While uploading the video file, the file is mode into chunks with size of 5Mb and each chunk is uploaded into the desired directory.
        It also provided us to monitor the status of the process.

        serviceAccountCredentials are the contains information about our googleApi credentials. so these need to be secure and thus placed in gitignore.
        To obtain those credentials
            - first create a new project in google cloud console.
            - enable Api& services in Apis & Services
            - Then navigate to Apis & services and click on credentials and create service account credentials.
            - After creating credentials those will be downloaded to our machine and load them in our project as serviceAccountCredentials.json file.

        Also share the google drive directories with the credentials.client_email so that we can manage those directories.

    #Project Setup:
    - Install Node.js & NPM

    - Cloning Repository : 'https://github.com/JayanthSagarapu/VideoDownload_Upload.git'
    
    - Create the serviceAccountCredentials.json file with the credentials

    
    #Install Dependencies : 
        npm Install
    
    
    #Run the application:
        npm start


    #To test the application:
        Open "http://localhost:4000/public/upload.html" in the browser after running the application,where get a form in which we give the directoryId's and uploadFileName.
        here for frontend i didnt used reactjs. Simply made it using html,js




