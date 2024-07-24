const currentShift = () => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 9 && hours < 18) {
        return 'day';
    } else {
        return 'night';
    }
}

module.exports = { currentShift };
