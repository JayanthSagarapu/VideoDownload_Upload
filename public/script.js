const downloadDirectoryId = document.getElementById("downloadDirectoryId");
const uploadDirectoryId = document.getElementById("uploadDirectoryId");
const uploadFileName = document.getElementById("uploadFileName");
const uploadStatus = document.getElementById("uploadStatus");

async function downloadAndUpload() {
  const requestData = {
    downloadDirectoryId: downloadDirectoryId.value,
    uploadDirectoryId: uploadDirectoryId.value,
    uploadFileName: uploadFileName.value,
  };
  try {
    const res = await axios.post(
      "http://localhost:4000/googleDrive/downloadAndUpload",
      requestData
    );
    console.log(res);
    getStatus();
  } catch (error) {
    console.error(error);
    uploadStatus.textContent = "Error in uploading.";
  }
}

async function getStatus() {
  try {
    const res = await axios.get("http://localhost:4000/googleDrive/status");
    console.log(res);
    uploadStatus.textContent = res.data.status;
  } catch (err) {
    console.log(err);
    uploadStatus.textContent = "Error in uploading.";
  }
}
