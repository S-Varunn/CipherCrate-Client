import { BACKGROUND_URI } from "./ImageUrls";
export const ChangeBackground = (route) => {
  let body = document.getElementById("background-image");
  body.style.background = `url('${BACKGROUND_URI[route]}')`;
  body.style.backgroundSize = "cover";
  // body.style.backgroundRepeat = "no-repeat";
};
