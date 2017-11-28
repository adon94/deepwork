import deviceInfo from 'react-native-device-info';

export const id = deviceInfo.getUniqueID();

export const colors = {
    normalText: '#444444',
    subText: '#AFAFAF',
    tigerOrange: '#d35400',
    tigerRGB: 'rgba(211, 84, 0, 1)',
    paleTiger: '#FF9550',
    background: '#FFFFFF',
    gold: '#ffd700',
    noGoalIcon: 'ios-flash-outline'
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