/**
 * formats the current date
 * to a more readable date
 * e.g Aug. 14, 2019
 * @return {Date} a valid date for manipulation
 */
function formatDateNow() {
    let months = [
        'Jan.',
        'Feb.',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Aug.',
        'Sept.',
        'Oct.',
        'Nov.',
        'Dec.'
    ];
    let date = new Date();
    return new Date(
        `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    );
}

module.exports = formatDateNow;
