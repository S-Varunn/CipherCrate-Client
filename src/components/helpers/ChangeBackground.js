import { BACKGROUND_URI } from "./ImageUrls";
export const ChangeBackground = (route) => {
  switch (route) {
    case "dashboard":
      let body = document.getElementById("background-image");
      console.log("body ", body);
      //   body.style.background = "url(" + BACKGROUND_URI.dashboard + ")";

      body.style.background =
        "url('https://images.unsplash.com/photo-1678294076236-e734ebb87e73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80')";

      break;
    default:
      console.log("Unsupported route: " + route);
  }
};
