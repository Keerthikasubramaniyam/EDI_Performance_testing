import lzutf8 from "https://unpkg.com/lzutf8";
import { check } from "k6";
let envVariables = JSON.parse(open("../env.json"));
const modifiedData = JSON.parse(open("/TestData/generateNewData.json"));
module.exports = {
  ExecutionType: {
    load: "load",
    smoke: "smoke",
    stress: "stress",
    soak: "soak",
  },
  DebugOrLog(start, textToLog) {
    var millis = Date.now() - start; // we get the ms ellapsed from the start of the test
    var time = Math.floor(millis / 1000); // in seconds
    // console.log(`${time}se: ${textToLog}`); // se = Seconds elapsed
    console.log(`${new Date()}--${__VU} - virtual user - ${textToLog}`);
  },

  CommonValidatorHandler(typeOfFlow, response, statusToValidate, envVariables) {
    const checkOptions = {};
    checkOptions[typeOfFlow] = (r) => r.status === statusToValidate;
    const isSuccessfulUpdate = check(response, checkOptions);
    if (!isSuccessfulUpdate) {
      module.exports.DebugOrLog(envVariables.START_TIME, `${typeOfFlow} failed with error code : ${response.status} ${response.body}`);
    } else {
      module.exports.DebugOrLog(envVariables.START_TIME, `${typeOfFlow} passed with status code : ${response.status}`);
    }
    return isSuccessfulUpdate;
  },

  updatedPayLoadValues(raw_Payload, modifiedNoOfRecords) {
    //modified json value
    const modifiedDataRecords = modifiedData.records;
    const lengthOfRecord = modifiedDataRecords.length;
    const randomNumber = Math.floor(Math.random() * lengthOfRecord);
    const generatedObj = modifiedDataRecords[randomNumber];
    console.log("generatedObj------", generatedObj);
    const modifiedObject = {};
    if (envVariables.DATABASETYPE === "snowflake") {
      for (let key in generatedObj) {
        modifiedObject[key.toUpperCase()] = generatedObj[key];
      }
      console.log(modifiedObject);
    }
    // generating keysToUpdate value
    let currentJsonPayload = JSON.parse(raw_Payload);
    let currentCompressedData = currentJsonPayload["data"];
    const deCompressedData = JSON.parse(lzutf8.decompress(currentCompressedData, { inputEncoding: "Base64" }));
    let updateDataRecords = deCompressedData.updateData.records;
    let updateDataConditions = deCompressedData.updateData.conditions;
    console.log("updateDataRecords.legth", updateDataRecords.length);
    if (updateDataRecords.length !== modifiedNoOfRecords) {
      updateDataRecords.splice(modifiedNoOfRecords);
      updateDataConditions.splice(modifiedNoOfRecords);
    }
    for (let eachValue = 0; eachValue < updateDataRecords.length; eachValue++) {
      if (updateDataRecords[eachValue]) {
        // console.log("updateDataRecords[eachValue]--------before", updateDataRecords[eachValue]);
        updateDataRecords[eachValue] = Object.assign({}, updateDataRecords[eachValue], envVariables.DATABASETYPE === "snowflake" ? modifiedObject : generatedObj);
        // console.log("updateDataRecords[eachValue]aftre--------", updateDataRecords[eachValue]);
      } else {
        console.log("issue in payload");
      }
    }
    const UpdatedcompressedData = lzutf8.compress(JSON.stringify(deCompressedData), { outputEncoding: "Base64" });
    currentJsonPayload["data"] = UpdatedcompressedData;
    currentJsonPayload["incomingRowCount"] = modifiedNoOfRecords;
    return { currentJsonPayload, randomNumber };
  },
};
