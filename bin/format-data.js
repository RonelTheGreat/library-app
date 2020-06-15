const toTitleCase = require('./to-title-case');

/**
 * formats data to title case
 * @param {String} data from the example above
 * @return {String} formatted string e.g. from author to Author
 */
let formatData = data => {
    let newData;

    // splits the data from
    // <dueTom#09305863576#{title}#{author}#{dateBorrowed}#{due}#{fine}>
    // to different segments
    newData = data.split('#');
    let state = newData[0];
    let contact = newData[1];
    let borr = newData[4];
    let due = newData[5];
    let fine = newData[6];

    let title = newData[2].split(' ');
    let author = newData[3].split(' ');

    // transform text to title case
    title = toTitleCase(title);
    author = toTitleCase(author);

    return `${state}#${contact}#${title}#${author}#${borr}#${due}#${fine}`;
};

module.exports = formatData;
