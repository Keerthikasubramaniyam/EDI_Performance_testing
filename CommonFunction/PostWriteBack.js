const axios = require("axios");
const FormData = require("form-data");
const { readFileSync, writeFileSync } = require("fs");
require("dotenv").config({ path: __dirname + "/.env" });
const logger = require("../log4js"); // Adjust the file name and path accordingly
module.exports = {
  async POST_EDIWriteBack(url, data = {}, isFormData = false, token = "", comments = "") {
    try {
      console.log("Sending POST request to:", url);
      logger.debug(`${comments} --> Sending POST request to: ${url}`);
      let headers = {};
      let postData;
      if (isFormData) {
        postData = new FormData();
        for (const key in data) {
          // console.log(key);
          await postData.append(key, JSON.stringify(data[key]));
          // console.log(postData);
        }
        headers = postData.getHeaders();
      } else {
        postData = data;
        headers["Content-Type"] = "multipart/form-data; boundary=" + postData.boundary;
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      logger.debug("request");
      await writeFileSync("compressed.txt", JSON.stringify(postData));
      const response = await axios.post(`${url}/v1/mde/writeback/`, postData, { headers });
      logger.debug("Response");
      logger.debug(`${comments} --> POST request successful:${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      logger.error(`${comments} --> POST request failed: ${error.meassage}`);
      logger.error(error);
      console.error("POST request failed:", error.meassage);
      if (comments != "writeback") throw error;
    }
  },
};
