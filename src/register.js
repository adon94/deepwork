import { Navigation } from "react-native-navigation";
// import Main from "./screens/Main";
import Main from "./Main";

export function registerScreens() {
  Navigation.registerComponent("app.main", () => Main);
}