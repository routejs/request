const parseNodeRequest = require("./request/node.cjs");
const supportedServers = ["node"];

module.exports = function request(context, options = { server: "node" }) {
  // Set default values
  options.server = options.server || "node";
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
};
