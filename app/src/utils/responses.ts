import { Response } from 'express';

export function captureResponseBody(res: Response): Promise<string> {
  return new Promise<string>((resolve) => {
    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);
    const chunks: Buffer[] = [];

    res.write = (chunk: any, ...args: any[]) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      return originalWrite(chunk, ...args);
    };

    res.end = (chunk: any, ...args: any[]) => {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const responseBody = Buffer.concat(chunks).toString('utf8');
      resolve(responseBody);

      return originalEnd(chunk, ...args);
    };
  });
}
