const LZUTF8 = require("lzutf8");

const compress = (data) => {
  try {
    // console.log("info", `compressing data`);
    const compressedData = LZUTF8.compress(data, { outputEncoding: "Base64" });
    // console.log("info", `data compressed`);
    return compressedData;
  } catch (error) {
    throw new Error(`Compress failed, ${error}`);
  }
};

const decompress = (data) => {
  try {
    // console.log("info", `decompressing data`);
    const decompressedDataString = LZUTF8.decompress(data, { inputEncoding: "Base64" });
    // console.log("info", `decompressed data`);
    return decompressedDataString;
  } catch (error) {
    throw new Error(`decompression failed, ${error}`);
  }
};

const encodeBase64 = async (value) => {
  try {
    if (typeof value !== "string") {
      throw new Error("Input value must be a string");
    }
    if (value === "" || value === null) return "";
    const a = Buffer.from(value, "utf-8").toString("base64");
    return a;
  } catch (error) {
    throw new Error(`Invalid base64 value: ${error.message}`);
  }
};

const decodeBase64 = async (value) => {
  try {
    if (value === null || value === "") return null;
    if (typeof value !== "string") {
      throw new Error("Input value must be a string");
    }
    return Buffer.from(value, "base64").toString("utf-8");
  } catch (error) {
    throw new Error(`Invalid base64 value: ${error.message}`);
  }
};

module.exports = { compress, decompress, encodeBase64, decodeBase64 };
