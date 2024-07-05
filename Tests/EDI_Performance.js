import http from "k6/http";
import { group, check } from "k6";
import { sleep } from "k6";
import file from "k6/x/file";
let envVariables = JSON.parse(open("../env.json"));
import { ExecutionType, updatedPayLoadValues } from "../CommonReusables.js";
import { FormData } from "https://jslib.k6.io/formdata/0.0.2/index.js";
import { POST_EDIWriteBack } from "../CommonFunction/PostWriteBack.js";

envVariables.START_TIME = Date.now();

var TEST_2_RUN = "smoke";
if (__ENV.TEST_2_RUN) {
  TEST_2_RUN = __ENV.TEST_2_RUN;
}

let ExecutionOptions_Scenarios;
switch (TEST_2_RUN) {
  case ExecutionType.smoke:
    ExecutionOptions_Scenarios = {
      sampleEDIFlow: {
        exec: "sampleEDIFlow",
        executor: "per-vu-iterations", //using per virtual users profile
        vus: 1,
        maxDuration: "10s",
        iterations: 1,
      },
    };
    break;
  case ExecutionType.stress:
    ExecutionOptions_Scenarios = {
      sampleEDIFlow: {
        exec: "sampleEDIFlow",
        executor: "ramping-vus",
        startVUs: 0,
        stages: [
          { duration: "10s", target: userSize },
          { duration: "15s", target: userSize },
          { duration: "10s", target: 0 },
        ],
        gracefulRampDown: "30s",
      },
    };
    break;
}

//Load Testing Config Details with threshold
export const options = {
  scenarios: ExecutionOptions_Scenarios,
  thresholds: {
    http_req_duration: ["p(95)<500", "p(99)<1500"],
  },
};
const filepath = "CompletedJobs.txt";
const raw_Payload = open("../TestData/remainingDB/30k_WithDateColumn.json");
const modifiedNoOfRecords = envVariables.NOOFROWS;
// console.log(data)
export function sampleEDIFlow() {
  const updated_payload = updatedPayLoadValues(raw_Payload, modifiedNoOfRecords);
  const formDatavalue = new FormData();
  formDatavalue.append("data", JSON.stringify(updated_payload.currentJsonPayload));
  // console.log(formDatavalue);s
  let postWriteBackResult = POST_EDIWriteBack(envVariables, formDatavalue, 200);
  if (postWriteBackResult.result) {
    const visualJobId = JSON.parse(postWriteBackResult.response.body).payload.visualJobId;
    console.log(`Completed Job Details : visualJobId: ${visualJobId},currentUser: ${__VU}, generatingRandomNumber: ${updated_payload.randomNumber},currentIteration: ${__ITER},currentTiming: ${new Date().toLocaleTimeString()}`);
    file.appendString(filepath, ` visualJobId: ${visualJobId},currentUser: ${__VU},generatingRandomNumber: ${updated_payload.randomNumber},currentIteration: ${__ITER},currentTiming: ${new Date().toLocaleTimeString()}\n`);
  }
}
