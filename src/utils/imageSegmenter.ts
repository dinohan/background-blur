import { ImageSegmenter } from "@mediapipe/tasks-vision";

import { FilesetResolver } from "@mediapipe/tasks-vision";

export const createImageSegmenter = async (
  canvas: HTMLCanvasElement | OffscreenCanvas
) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm"
  );

  return ImageSegmenter.createFromOptions(vision, {
    canvas,
    runningMode: "VIDEO",
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter_landscape/float16/latest/selfie_segmenter_landscape.tflite",
      delegate: "GPU",
    },
  });
};
