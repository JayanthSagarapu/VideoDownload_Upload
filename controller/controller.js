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
const uploadFile = async (filePath, uploadDirectoryId, uploadFileName) => {
  const drive = google.drive({ version: "v3", auth });

  //Obtaining the video from the previous stored downloaded file
  const videoFile = fs.createReadStream(filePath);

  const requestBody = {
    name: uploadFileName,
    parents: [uploadDirectoryId],
  };

  const media = {
    mimeType: "video/mp4",
    body: videoFile,
  };
  try {
    const file = await drive.files.create({
      requestBody,
      media,
    });
    console.log("uploaded", file.data);
    uploaded = true;
  } catch (err) {
    console.log(err);
    throw err;
  }
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
  const { downloadDirectoryId, uploadDirectoryId, uploadFileName } = req.body;
  try {
    const filesInDownloadDirectory = await directoryAllFiles(
      downloadDirectoryId
    );
    const fileToDownload = filesInDownloadDirectory[0];

    await downloadFile(fileToDownload.id, uploadFileName);

    const filePath = `c:\\Users\\sjaya\\Desktop\\${uploadFileName}.mp4`;

    await uploadFile(filePath, uploadDirectoryId, uploadFileName);

    res.json({ status: "Downloaded & Uploaded File" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: "Error in downlaoding & uploading video" });
  }
};

//to get the status of the process
const getStatus = async (req, res) => {
  try {
    var status = downloaded && uploaded ? "Downloaded and Uploaded" : "Pending";
    res.json({ status: status });
  } catch (error) {
    console.log(error);
    res.status(500).res.json({ status: "Error in Uploading" });
  }
};

module.exports = { downloadAndUpload, getStatus };
