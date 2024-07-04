const { updatedPayLoadValues } = require("./CommonReusables.js");
const { readFileSync } = require("fs");
const FormData = require("form-data");
const formData = new FormData();
process.env.START_TIME = Date.now();
const filepath = "CompletedJobs.txt";
const inputJsonFile = JSON.parse(readFileSync(`./TestData/30k_Sample.json`, "utf8"));
console.log("heelo");
// module.exports = {
async function sampleEDIFlow() {
  console.log("hello");
  const updated_payload = await updatedPayLoadValues(inputJsonFile);
  formData.append("data", JSON.stringify(updated_payload.currentJsonPayload));
  console.log("step1****************************", formData);
  // await writeFileSync("hello.txt", formData,"utf-8");
  // const requestURL = `${process.env.BASE_URL}/v1/mde/writeback/`;
  // let postWriteBackResult = await POST_EDIWriteBack(requestURL, formData, process.env.BASE_URL);
  // console.log(postWriteBackResult);
}
sampleEDIFlow();
