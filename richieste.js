const _URL = "http://localhost:3000";

function inviaRichiesta(method, url, parameters = {}) {
  let config = {
    baseURL: _URL,
    url: url,
    method: method,
    headers: {
      Accept: "application/json",
    },
    timeout: 5000,
    responseType: "json",
  };
  if (method.toUpperCase() == "GET") {
    config.headers["Content-Type"] =
      "application/x-www-form-urlencoded;charset=utf-8";
    config["params"] = parameters; // plain object or URLSearchParams object
  } else {
    config.headers["Content-Type"] = "application/json; charset=utf-8";
    config["data"] = parameters; // Accept FormData, File, Blob
  }
  return axios(config); // return a promise
}
