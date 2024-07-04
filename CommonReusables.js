const { compress, decompress } = require("./compressUtilities");
const { readFileSync, writeFileSync } = require("fs");
const modifiedData = JSON.parse(readFileSync("./TestData/generateNewData.json"));
require("dotenv").config({ path: __dirname + "/.env" });
module.exports = {
  async DebugOrLog(start, textToLog) {
    var millis = Date.now() - start; // we get the ms ellapsed from the start of the test
    var time = Math.floor(millis / 1000); // in seconds
    // console.log(`${time}se: ${textToLog}`); // se = Seconds elapsed
    console.log(`${new Date()} - ${textToLog}`);
  },
  async updatedPayLoadValues(currentJsonPayload, modifiedNoOfRecords) {
    //modified json value
    const modifiedDataRecords = modifiedData.records;
    const lengthOfRecord = modifiedDataRecords.length;
    const randomNumber = Math.floor(Math.random() * lengthOfRecord);
    console.log("randomNumber-----------------", randomNumber);
    const generatedObj = modifiedDataRecords[randomNumber];
    const modifiedObject = {};
    if (process.env.DATABASETYPE === "snowflake") {
      for (let key in generatedObj) {
        modifiedObject[key.toUpperCase()] = generatedObj[key];
      }
      // console.log(modifiedObject);
    }
    // generating keysToUpdate values
    let currentCompressedData = currentJsonPayload["data"];
    const deCompressedData = JSON.parse(await decompress(currentCompressedData));
    let updateDataRecords = deCompressedData.updateData.records;
    let updateDataConditions = deCompressedData.updateData.conditions;
    if (updateDataRecords.length !== modifiedNoOfRecords) {
      updateDataRecords.splice(modifiedNoOfRecords);
      updateDataConditions.splice(modifiedNoOfRecords);
    }
    for (let eachValue = 0; eachValue < updateDataRecords.length; eachValue++) {
      console.log(" updateDataRecords[eachValue]------------before", updateDataRecords[eachValue]);
      if (updateDataRecords[eachValue]) {
        updateDataRecords[eachValue] = await Object.assign({}, updateDataRecords[eachValue], process.env.DATABASETYPE === "snowflake" ? modifiedObject : generatedObj);
        console.log(" updateDataRecords[eachValue]------------after", updateDataRecords[eachValue]);
      } else {
        console.log("issue in payload");
      }
    }
    const updatedCompressData = await compress(JSON.stringify(deCompressedData));
    currentJsonPayload["data"] = updatedCompressData;
    currentJsonPayload["incomingRowCount"] = modifiedNoOfRecords;
    // console.log("lengthOfRecordafter", lengthOfRecord);
    // console.log("step1................", UpdatedcompressedData);
    return { currentJsonPayload, randomNumber };
  },
};
