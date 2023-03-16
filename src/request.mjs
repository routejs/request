import parseNodeRequest from "./request/node.mjs";
const supportedServers = ["node"];

export default function request(context, options = {}) {
  // Create http request object
  if (
    options.server &&
    (typeof options.server === "string" || options.server instanceof String)
  ) {
    if (!supportedServers.includes(options.server.toLowerCase())) {
      throw new TypeError(`Error: ${options.server} is not supported`);
    }

    if (options.server.toLowerCase() === "node") {
      req = parseNodeRequest(context, options);
    }
  } else {
    // Create default http request object
    req = parseNodeRequest(context, options);
  }

  return req;
}