import type { NextFunction, Request, Response } from "express";
import { brotliCompress, constants, gzip } from "zlib";

const MIN_BYTES_TO_COMPRESS = 1024;

function pickEncoding(acceptEncoding: string | undefined): "br" | "gzip" | null {
  if (!acceptEncoding) return null;
  const value = acceptEncoding.toLowerCase();
  if (value.includes("br")) return "br";
  if (value.includes("gzip")) return "gzip";
  return null;
}

function isCompressibleContentType(contentTypeHeader: string | number | string[] | undefined): boolean {
  const contentType = String(contentTypeHeader ?? "").toLowerCase();
  return (
    contentType.startsWith("text/") ||
    contentType.includes("application/json") ||
    contentType.includes("application/javascript") ||
    contentType.includes("application/xml") ||
    contentType.includes("application/rss+xml") ||
    contentType.includes("application/xhtml+xml") ||
    contentType.includes("image/svg+xml")
  );
}

export function compressionMiddleware(req: Request, res: Response, next: NextFunction): void {
  const encoding = pickEncoding(req.headers["accept-encoding"]);
  if (!encoding) {
    next();
    return;
  }

  const rawSend = res.send.bind(res);
  res.send = ((body?: any) => {
    if (res.getHeader("Content-Encoding")) {
      return rawSend(body);
    }

    const bodyBuffer = Buffer.isBuffer(body)
      ? body
      : typeof body === "string"
        ? Buffer.from(body)
        : body != null
          ? Buffer.from(String(body))
          : Buffer.alloc(0);

    if (
      bodyBuffer.length < MIN_BYTES_TO_COMPRESS ||
      !isCompressibleContentType(res.getHeader("Content-Type"))
    ) {
      return rawSend(body);
    }

    const finalize = (compressed: Buffer) => {
      res.setHeader("Vary", "Accept-Encoding");
      res.setHeader("Content-Encoding", encoding);
      res.setHeader("Content-Length", compressed.length);
      rawSend(compressed);
    };

    const onError = () => rawSend(body);

    if (encoding === "br") {
      brotliCompress(
        bodyBuffer,
        { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } },
        (error, compressed) => {
          if (error || !compressed) return onError();
          finalize(compressed);
        }
      );
      return res;
    }

    gzip(bodyBuffer, { level: 6 }, (error, compressed) => {
      if (error || !compressed) return onError();
      finalize(compressed);
    });
    return res;
  }) as Response["send"];

  next();
}
