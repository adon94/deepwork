import { Navigation } from 'react-native-navigation';
import { registerScreens } from './src/register';
import { colors } from './src/constants';

registerScreens();

// const mainScreen = 'app.MainView';
// const mainScreen = 'app.Main';
// const mainScreen = 'app.SelectApp'
const mainScreen = 'app.main'

Navigation.startSingleScreenApp({
    screen: {
        screen: mainScreen, // unique ID registered with Navigation.registerScreen
        navigatorStyle: { navBarHidden: true, statusBarColor: colors.tigerOrange, statusBarTextColorScheme: 'light' },//statusBarHidden: true }, // override the navigator style for the screen, see 'Styling the navigator' below (optional)
        navigatorButtons: {} // override the nav buttons for the screen, see 'Adding buttons to the navigator' below (optional)
    }
});
