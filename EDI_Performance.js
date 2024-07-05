const { updatedPayLoadValues } = require("./CommonReusables.js");
const { POST_EDIWriteBack } = require("./CommonFunction/PostWriteBack.js");
const { readFileSync, writeFileSync } = require("fs");
require("dotenv").config({ path: __dirname + "/.env" });
process.env.START_TIME = Date.now();
const filepath = "CompletedJobs.txt";
const inputJsonFile = JSON.parse(readFileSync(`./TestData/remainingDB/30k_WithDateColumn.json`, "utf8"));
const NoOfRecordModified = process.env.TOTAL_ROWS;
async function EDITableBulkEditorFlow() {
  const updated_payload = await updatedPayLoadValues(inputJsonFile, NoOfRecordModified);
  const wbPayload = {
    data: updated_payload.currentJsonPayload,
  };
  let postWriteBackResult = await POST_EDIWriteBack(process.env.BASE_URL, wbPayload, true, process.env.BEARER_TOKEN, "BulkEditor");
  console.log("Post Write Back Result:", postWriteBackResult.statusCode);
  await writeFileSync(filepath, ` visualJobId: ${postWriteBackResult.payload.visualJobId},generatingRandomNumber: ${updated_payload.randomNumber},currentTiming: ${new Date().toLocaleTimeString()}\n`);
}
EDITableBulkEditorFlow();
