const accepts = require("accepts");
const typeis = require("type-is");
const parseRange = require("range-parser");
const parseurl = require("parseurl");
const qs = require("qs");
const cookie = require("cookie");
const net = require("net");

module.exports = function (
  { req, res },
  options = {
    subdomainOffset: 2,
    proxy: false,
    proxyIpHeader: "X-Forwarded-For",
    maxIpsCount: 0,
    proxyHostHeader: "X-Forwarded-Host",
    proxyProtocolHeader: "X-Forwarded-Proto",
  }
) {
  // Set default values
  options.subdomainOffset = options.subdomainOffset || 2;
  options.proxy = options.proxy || false;
  options.proxyIpHeader = options.proxyIpHeader || "X-Forwarded-For";
  options.maxIpsCount = options.maxIpsCount || 0;
  options.proxyHostHeader = options.proxyHostHeader || "X-Forwarded-Host";
  options.proxyProtocolHeader =
    options.proxyProtocolHeader || "X-Forwarded-Proto";

  Object.defineProperties(req, {
    cookies: {
      get() {
        return cookie.parse(this.get("Cookie") ?? "") ?? null;
      },
    },

    fullUrl: {
      get() {
        return this.origin ? this.origin + decodeURI(this.url) : null;
      },
    },

    host: {
      get() {
        let host;
        if (options.proxy) {
          host = this.get(options.proxyHostHeader);
        }
        host = host || this.get("Host");
        // Note: X-Forwarded-Host is normally a single value, but it is safe to return first value.
        return host ? host.split(/\s*,\s*/, 1)[0] : null;
      },
    },

    hostname: {
      get() {
        const host = this.host;
        if (!host) return null;

        // IPv6 literal support
        var offset = host[0] === "[" ? host.indexOf("]") + 1 : 0;
        var index = host.indexOf(":", offset);

        return index !== -1 ? host.substring(0, index) : host;
      },
    },

    ip: {
      get() {
        let ip;
        if (options.proxy) {
          ip = this.get(options.proxyIpHeader);
        }
        ip = ip || this.socket.remoteAddress;
        return ip ? ip.split(/\s*,\s*/, 1)[0] : null;
      },
    },

    ips: {
      get() {
        let ip;
        if (options.proxy) {
          ip = this.get(options.proxyIpHeader);
        }
        ip = ip || this.socket.remoteAddress;
        ips = ip ? ip.split(/\s*,\s*/) : [];
        if (options.maxIpsCount > 0) {
          ips = ips.slice(-options.maxIpsCount);
        }
        return ips;
      },
    },

    origin: {
      get() {
        return this.protocol && this.host
          ? this.protocol + "://" + this.host
          : null;
      },
    },

    path: {
      get() {
        const url = parseurl(this);
        return url?.pathname ? decodeURI(url.pathname) : null;
      },
    },

    protocol: {
      get() {
        let protocol;
        if (options.proxy) {
          protocol =
            this.get(options.proxyProtocolHeader)?.toLowerCase() === "https"
              ? "https"
              : "http";
        }
        protocol = protocol || (this.socket.encrypted ? "https" : "http");
        // Note: X-Forwarded-Proto is normally a single value, but it is safe to return first value.
        return protocol ? protocol.split(/\s*,\s*/, 1)[0] : null;
      },
    },

    query: {
      get() {
        return qs.parse(parseurl(this)?.query ?? "") ?? {};
      },
    },

    secure: {
      get() {
        return this.protocol === "https";
      },
    },

    subdomains: {
      get() {
        let hostname = this.hostname;
        if (!hostname) return [];
        return !net.isIP(hostname)
          ? hostname.split(".").reverse().slice(options.subdomainOffset)
          : [hostname];
      },
    },

    xhr: {
      get() {
        let requestedWith = this.get("X-Requested-With") || "";
        return requestedWith.toLowerCase() === "xmlhttprequest";
      },
    },

    accepts: {
      value: function (...type) {
        let accept = accepts(this);
        return accept.types.apply(accept, type);
      },
    },

    acceptsCharsets: {
      value: function (...charsets) {
        let accept = accepts(this);
        return accept.charsets.apply(accept, charsets);
      },
    },

    acceptsEncodings: {
      value: function (...encodings) {
        let accept = accepts(this);
        return accept.encodings.apply(accept, encodings);
      },
    },

    acceptsLanguages: {
      value: function (...languages) {
        let accept = accepts(this);
        return accept.languages.apply(accept, languages);
      },
    },

    get: {
      value: function (name) {
        name = name?.toLowerCase();

        if (name === "referer" || name === "referrer") {
          return this.headers?.referrer || this.headers?.referer;
        }

        return this.headers[name] ?? null;
      },
    },

    header: {
      value: function (name) {
        return this.get(name);
      },
    },

    is: {
      value: function (...types) {
        return typeis.is(this.get("Content-Type"), types);
      },
    },

    range: {
      value: function (size, options = {}) {
        let range = this.get("Range");
        if (!range) return;
        return parseRange(size, range, options);
      },
    },
  });
  return req;
};
