const supertest = require("supertest");
const requestWrapper = require("../index.cjs");

describe("Request test", () => {
  test("Get header", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.header("x-name"));
    })
      .get("/")
      .set("X-Name", "abc")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("abc");
      });
  });

  test("Get header application/json", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.get("content-type"));
    })
      .get("/")
      .set("Content-Type", "application/json")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("application/json");
      });
  });

  test("Check request is json", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.is("json", "html"));
    })
      .get("/")
      .set("Content-Type", "application/json")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("json");
      });
  });

  test("Check request accepts json", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.accepts("json"));
    })
      .get("/")
      .set("Accept", "application/json")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("json");
      });
  });

  test("Check request accepts html", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(JSON.stringify(req.accepts("html")));
    })
      .get("/")
      .set("Accept", "application/json")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("false");
      });
  });

  test("Check request accepts language en", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.acceptsLanguages("en"));
    })
      .get("/")
      .set("Accept-Language", "en")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("en");
      });
  });

  test("Check request accepts language sp", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(JSON.stringify(req.acceptsLanguages("sp")));
    })
      .get("/")
      .set("Accept-Language", "en, hi")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("false");
      });
  });

  test("Check request accepts charset utf-8", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.acceptsCharsets("utf-8"));
    })
      .get("/")
      .set("Accept-Charset", "utf-8")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("utf-8");
      });
  });

  test("Check request accepts charset utf-16", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(JSON.stringify(req.acceptsCharsets("utf-16")));
    })
      .get("/")
      .set("Accept-Charset", "utf-8")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("false");
      });
  });

  test("Check request accepts encoding gzip", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.acceptsEncodings("gzip"));
    })
      .get("/")
      .set("Accept-Encoding", "gzip")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("gzip");
      });
  });

  test("Check request accepts encoding deflate", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(JSON.stringify(req.acceptsEncodings("deflate")));
    })
      .get("/")
      .set("Accept-Encoding", "gzip")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("false");
      });
  });

  test("Get query string", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.query.name);
    })
      .get("/?name=abc")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("abc");
      });
  });

  test("Get query string", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(JSON.stringify(req.query));
    })
      .get("/?name[]=abc&name[]=10")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe(JSON.stringify({ name: ["abc", "10"] }));
      });
  });

  test("Get url path", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.path);
    })
      .get("/blog/post/id?id=20")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("/blog/post/id");
      });
  });

  test("Get request host", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.host);
    })
      .get("/")
      .set("Host", "localhost:3000")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("localhost:3000");
      });
  });

  test("Get request hostname", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.hostname);
    })
      .get("/")
      .set("Host", "localhost:3000")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("localhost");
      });
  });

  test("Get request subdomains", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req }, { subdomainOffset: 1 });
      res.end(JSON.stringify(req.subdomains));
    })
      .get("/")
      .set("Host", "blog.localhost:3000")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe(JSON.stringify(["blog"]));
      });
  });

  test("Get request protocol", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.protocol);
    })
      .get("/")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("http");
      });
  });

  test("Get request origin", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.origin);
    })
      .get("/")
      .set("Host", "localhost:3000")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("http://localhost:3000");
      });
  });

  test("Get full url", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.fullUrl);
    })
      .get("")
      .set("Host", "localhost:3000")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("http://localhost:3000/");
      });
  });

  test("Get full url", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.fullUrl);
    })
      .get("/blog?id=100&special=^./$")
      .set("Host", "localhost:3000")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("http://localhost:3000/blog?id=100&special=^./$");
      });
  });

  test("Get cookie", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(req.cookies.name);
    })
      .get("/")
      .set("Cookie", "name=abc")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("abc");
      });
  });

  test("Get ip", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req }, { proxy: true });
      res.end(req.ip);
    })
      .get("/")
      .set("X-Forwarded-For", "192.168.0.1, 192.168.1.2")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("192.168.0.1");
      });
  });

  test("Get ips", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req }, { proxy: true });
      res.end(req.ips.join(","));
    })
      .get("/")
      .set("X-Forwarded-For", "192.168.0.1, 192.168.1.2")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("192.168.0.1,192.168.1.2");
      });
  });

  test("Get secure", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(JSON.stringify(req.secure));
    })
      .get("/")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("false");
      });
  });

  test("Get xhr", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(JSON.stringify(req.xhr));
    })
      .get("/")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("false");
      });
  });

  test("Get xhr", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(JSON.stringify(req.xhr));
    })
      .get("/")
      .set("X-Requested-With", "XMLHttpRequest")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("true");
      });
  });

  test("Get range", async () => {
    await supertest(function (req, res) {
      req = requestWrapper({ req });
      res.end(JSON.stringify(req.range(500)));
    })
      .get("/")
      .set("Range", "Range: bytes=0-500")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe(JSON.stringify([{ start: 0, end: 499 }]));
      });
  });
});
