import { createImageSegmenter } from "./imageSegmenter";
import { createGetImageBitmapFunction } from "./webgl";
import { assert } from "./type.utils";

const BLUR_RADIUS = 10;
const FPS = 30;

async function blendMaskWithVideo({
  maskImage,
  videoElement,
  resultCtx,
}: {
  maskImage: ImageBitmap;
  videoElement: HTMLVideoElement;
  resultCtx: CanvasRenderingContext2D;
}) {
  const { width, height } = videoElement;

  // save default state
  resultCtx.save();
  resultCtx.clearRect(0, 0, width, height);

  // draw mask
  resultCtx.drawImage(maskImage, 0, 0, width, height);

  // draw video only on mask
  resultCtx.globalCompositeOperation = "source-in";
  resultCtx.drawImage(videoElement, 0, 0, width, height);

  // fill background with blur
  resultCtx.filter = `blur(${BLUR_RADIUS}px)`;
  resultCtx.globalCompositeOperation = "destination-atop";
  resultCtx.drawImage(videoElement, 0, 0, width, height);

  /**
   * restore to default state
   * same as
   * ```
   * resultCtx.filter = "none";
   * resultCtx.globalCompositeOperation = "source-over";
   * ```
   */
  resultCtx.restore();
}

export async function initializeTrackProcessor({
  videoElement,
  resultCanvas,
}: {
  videoElement: HTMLVideoElement;
  resultCanvas: HTMLCanvasElement;
}) {
  const taskCanvas = new OffscreenCanvas(
    videoElement.width,
    videoElement.height
  );
  const resultCtx = resultCanvas.getContext("2d");
  assert(resultCtx, "Can not get 2d context");

  const imageSegmenter = await createImageSegmenter(taskCanvas);
  const getImageBitmapFromMaskTexture =
    createGetImageBitmapFunction(taskCanvas);

  const render = () => {
    imageSegmenter.segmentForVideo(
      videoElement,
      performance.now(),
      async (result) => {
        const mask = result.confidenceMasks?.[0];
        assert(mask, "no mask found");
        const maskImage = await getImageBitmapFromMaskTexture(
          mask.getAsWebGLTexture()
        );

        blendMaskWithVideo({ maskImage, videoElement, resultCtx });
      }
    );
  };

  setInterval(render, 1000 / FPS);
  return resultCanvas.captureStream(FPS);
}
