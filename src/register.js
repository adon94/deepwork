import { Navigation } from "react-native-navigation";
import Main from "./screens/Main";

export function registerScreens() {
  Navigation.registerComponent("app.main", () => Main);
}