import { NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import path from "path";
import { Readable } from "stream";

const VIDEO_PATH = path.join(process.cwd(), "images", "home-page-videos", "3.mp4");

export async function GET(request: Request) {
  const range = request.headers.get("range");
  const { size } = statSync(VIDEO_PATH);

  if (range) {
    const bytesPrefix = "bytes=";
    if (!range.startsWith(bytesPrefix)) {
      return new NextResponse("Invalid range", { status: 416 });
    }

    const rangeParts = range.substring(bytesPrefix.length).split("-");
    const start = Number.parseInt(rangeParts[0], 10);
    const end = rangeParts[1] ? Number.parseInt(rangeParts[1], 10) : size - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start > end) {
      return new NextResponse("Invalid range", { status: 416 });
    }

    const chunkSize = end - start + 1;
    const nodeStream = createReadStream(VIDEO_PATH, { start, end });
    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;

    return new NextResponse(webStream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": "video/mp4",
      },
    });
  }

  const nodeStream = createReadStream(VIDEO_PATH);
  const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;
  return new NextResponse(webStream, {
    headers: {
      "Content-Length": size.toString(),
      "Content-Type": "video/mp4",
    },
  });
}
