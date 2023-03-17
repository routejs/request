declare interface context {
  res?: object;
  req: object;
}

declare interface options {
  server: string;
  subdomainOffset?: number;
  proxy?: boolean;
  proxyIpHeader?: string;
  maxIpsCount?: number;
  proxyHostHeader?: string;
  proxyProtocolHeader?: string;
}

declare interface Request {
  cookies: object;
  fullUrl: string | null;
  host: string | null;
  hostname: string | null;
  ip: string | null;
  ips: string[];
  origin: string | null;
  path: string | null;
  protocol: string | null;
  query: object;
  secure: boolean;
  subdomains: string[];
  xhr: boolean;
  accepts: (...type: string[]) => string | string[] | false;
  acceptsCharsets: (...charsets: string[]) => string | string[] | false;
  acceptsEncodings: (...encodings: string[]) => string | string[] | false;
  acceptsLanguages: (...languages: string[]) => string | string[] | false;
  get: (name: string) => string | null;
  header: (name: string) => string | null;
  is: (...types: string[]) => string | false;
  range: (size: number, options?: object) => object[];
}

declare function request(context: context, options?: options): Request;

export default request;
