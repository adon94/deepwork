import { Dimensions } from 'react-native';
import deviceInfo from 'react-native-device-info';

export const id = deviceInfo.getUniqueID();
export const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export const colors = {
    normalText: '#141414',
    subText: '#AFAFAF',
    tigerOrange: '#e67e22',//'#d35400',
    tigerRGB: 'rgba(211, 84, 0, 1)',
    paleTiger: '#FF9550',
    background: '#FFFFFF',
    gold: '#ffd700',
    noGoalIcon: 'ios-flash-outline',
    behindColor: '#e67e22',//'#d35400',
    behindText: '#FFFFFF',
    touchableText: '#2980b9',
}

export const formatSeconds = (seconds) => {
    seconds = Math.round(seconds);
    let h = 0,
        m = 0,
        s = 0;

    if (seconds > 3599) {
        h = Math.floor(seconds / 3600);
        seconds = seconds - h * 3600;
        m = Math.floor(seconds / 60);
        s = Math.floor(seconds - m * 60);

        // h = h.toString().length <= 1 ? "0" + h : h;
        m = m.toString().length <= 1 ? "0" + m : m;
        s = s.toString().length <= 1 ? "0" + s : s;

        return h + ':' + m + ':' + s;
    } else if (seconds > 59) {
        m = Math.floor(seconds / 60);
        s = Math.floor(seconds - m * 60);
    } else {
        s = Math.floor(seconds);
    }

    // m = m.toString().length <= 1 ? "0" + m : m;
    s = s.toString().length <= 1 ? "0" + s : s;

    return m + ":" + s;
}