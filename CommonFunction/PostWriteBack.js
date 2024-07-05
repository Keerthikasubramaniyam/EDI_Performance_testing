import { check } from "k6";
import http from "k6/http";

import { CommonValidatorHandler } from "../CommonFunction/CommonReusables.js";
module.exports = {
  POST_EDIWriteBack(envVariables, testdata, statusToValidate) {
    // console.log("testdata-------------------------", testdata);
    const response = http.post(`${envVariables.BASE_URL}/v1/mde/writeback/`, testdata.body(), {
      headers: {
        Authorization: `Bearer ${envVariables.BEARER_TOKEN}`,
        "Cache-Control": "no-cache",
        "content-type": "multipart/form-data; boundary=" + testdata.boundary,
      },
      // tags: { name: "POST/EDIWriteback" },
    });
    const result = CommonValidatorHandler("POST/EDIWriteback", response, statusToValidate, envVariables);
    // console.log(result);
    return { response, result };
  },
};
