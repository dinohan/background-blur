import { assert } from "./type.utils";

export async function initializeCamera() {
  const videoElement = document.querySelector<HTMLVideoElement>("#camera");
  assert(videoElement, "can't find video element");

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  videoElement.srcObject = stream;

  return videoElement;
}

export function initializeCanvas() {
  const resultCanvas =
    document.querySelector<HTMLCanvasElement>("#resultCanvas");
  assert(resultCanvas, "can't find result canvas");

  return resultCanvas;
}
