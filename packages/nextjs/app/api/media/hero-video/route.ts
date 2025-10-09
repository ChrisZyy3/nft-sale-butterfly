import { NextResponse } from "next/server";
import { type ReadStream, createReadStream, statSync } from "fs";
import path from "path";

const VIDEO_PATH = path.join(process.cwd(), "images", "home-page-videos", "3.mp4");

export async function GET(request: Request) {
  let size: number;

  try {
    ({ size } = statSync(VIDEO_PATH));
  } catch (error) {
    console.error("Failed to load hero video", error);
    return new NextResponse("Video not found", { status: 404 });
  }

  if (request.method === "HEAD") {
    return new NextResponse(null, {
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Length": size.toString(),
        "Content-Type": "video/mp4",
      },
    });
  }

  const range = request.headers.get("range");

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
    const webStream = createWebStream(nodeStream);

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
  const webStream = createWebStream(nodeStream);
  return new NextResponse(webStream, {
    headers: {
      "Content-Length": size.toString(),
      "Content-Type": "video/mp4",
    },
  });
}

function createWebStream(stream: ReadStream) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;

      const close = () => {
        if (closed) return;
        closed = true;
        controller.close();
      };

      const error = (err: unknown) => {
        if (closed) return;
        closed = true;
        controller.error(err);
      };

      stream.on("data", chunk => {
        controller.enqueue(chunk instanceof Uint8Array ? chunk : Buffer.from(chunk));
      });
      stream.on("end", close);
      stream.on("close", close);
      stream.on("error", error);
    },
    cancel() {
      stream.destroy();
    },
  });
}
