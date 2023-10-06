const { google } = require("googleapis");
const { JWT } = require("google-auth-library");
const fs = require("fs");

let downloaded,
  uploaded = false;

let auth;

//storing the credentials for serviceAccountCredentials
const credential = require("../serviceAccountCredentials.json");

//creating JWT
auth = new JWT({
  email: credential.client_email,
  key: credential.private_key,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

//Downling video file from first directory using googleApi
const downloadFile = async (fileID, fileName) => {
  const drive = google.drive({ version: "v3", auth });

  //created a filepath to store the file
  const filePath = `c:\\Users\\sjaya\\Desktop\\${fileName}.mp4`;

  try {
    //getting the video that to be downloded in arraybuffer form
    const res = await drive.files.get(
      {
        fileId: fileID,
        alt: "media",
      },
      { responseType: "arraybuffer" }
    );

    const downloadedFile = Buffer.from(res.data);

    //storing the downloaded file in the given filepath
    fs.writeFileSync(filePath, downloadedFile);

    console.log("Downloaded");

    downloaded = true;

    return downloadedFile;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//uploading video to uploadDirectory with a uploadfileName
const uploadFileInChunks = async (
  filePath,
  uploadDirectoryId,
  uploadFileName
) => {
  const drive = google.drive({ version: "v3", auth });

  //Getting the fileSize and considering the chunk size as 5mb and counting number of chunks the file can be breaked into
  const fileSize = fs.statSync(filePath).size;
  const chunkSize = 5 * 1024 * 1024; //5Mb chunks
  const numberOfChunks = Math.ceil(fileSize / chunkSize);

  //Function to upload next chunk for each iteration from start to end of number of chunks
  let currentChunk = 1;

  const nextChunkUpload = async () => {
    let start = (currentChunk - 1) * chunkSize;
    let end = currentChunk * chunkSize;

    const chunkFiles = fs.createReadStream(filePath, { start, end });

    const requestBody = {
      name: uploadFileName,
      parents: [uploadDirectoryId],
    };

    const media = {
      mimeType: "video/mp4",
      body: chunkFiles,
    };
    try {
      //uploading or creating file for each chunk
      const file = await drive.files.create({
        requestBody,
        media,
      });

      //checking and updating the currentChunk and again calling the nextChunkupload function
      if (currentChunk < numberOfChunks) {
        currentChunk++;
        nextChunkUpload();
      } else {
        console.log("All chunks Uploaded");
        return true;
      }
    } catch (err) {
      console.log("Error in chunks upload", err);
      throw err;
    }
  };
  uploaded = nextChunkUpload();
};

//To get all the files in the given directory id, so that we choose which file to download
const directoryAllFiles = async (directoryId) => {
  const drive = google.drive({ version: "v3", auth });
  try {
    const list = await drive.files.list({
      q: `'${directoryId}' in parents`,
      fields: "files(id,name)",
    });
    return list.data.files;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//Download and Upload of file from one directory to other directory
const downloadAndUpload = async (req, res) => {
  const { downloadDirectoryId, fileNumber, uploadDirectoryId, uploadFileName } =
    req.body;
  try {
    //geting the list of files in directory and choosing the specified file
    const filesInDownloadDirectory = await directoryAllFiles(
      downloadDirectoryId
    );
    const fileToDownload = filesInDownloadDirectory[fileNumber - 1];

    await downloadFile(fileToDownload.id, uploadFileName);

    const filePath = `c:\\Users\\sjaya\\Desktop\\${uploadFileName}.mp4`;

    await uploadFileInChunks(filePath, uploadDirectoryId, uploadFileName);

    res.json({ status: "Downloaded & Uploaded File" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: "Error in downlaoding & uploading video" });
  }
};

//to get the status of the process
const getStatus = async (req, res) => {
  try {
    var status =
      downloaded && uploaded ? "Downloaded and Uploaded" : "Pending...";
    res.json({ status: status });
  } catch (error) {
    console.log(error);
    res.status(500).res.json({ status: "Error in Uploading" });
  }
};

module.exports = { downloadAndUpload, getStatus };
