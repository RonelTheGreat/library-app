/**
 * transform text into a title case
 * @param {String} str a string to transform
 * @return {String} a title cased string/word
 */
let toTitleCase = str => {
    return str
        .map(word => {
            let newWord = '';
            for (let i = 0; i < word.length; i++) {
                if (i === 0) {
                    newWord += word[i].toUpperCase();
                } else {
                    newWord += word[i];
                }
            }
            return newWord;
        })
        .join(' ');
};

module.exports = toTitleCase;
