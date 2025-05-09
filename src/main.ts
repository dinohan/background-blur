import { initializeCamera, initializeCanvas } from "./utils/initializeElements";

import "./style.css";
import { initializeTrackProcessor } from "./utils/trackProcessor";

async function main() {
  const videoElement = await initializeCamera();
  const resultCanvas = initializeCanvas();

  initializeTrackProcessor({ videoElement, resultCanvas });
}

window.addEventListener("load", main);
