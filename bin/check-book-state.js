const formatDateNow = require('./format-date-now');

/**
 * check book state
 * i.e. if it is due tomorrow, overdue
 * due today, not due or already notified
 * @param {object} book the actual book from DB
 * @return {String} data formatted to be passed
 * to arduino via serial comm
 * <dueTom#09305863576#{title}#{author}#{dateBorrowed}#{due}#{fine}>
 */
function checkBookState(book) {
    // create a new date
    let dateBorrowed = Math.round(
        new Date(book.dateBorrowed).getTime() / (1000 * 3600 * 24)
    );

    // get book's due date
    let dueDate = Math.round(
        new Date(book.dueDate).getTime() / (1000 * 3600 * 24)
    );

    let dateNow = Math.round(formatDateNow().getTime() / (1000 * 3600 * 24));

    // add 1 day to the date now
    // for reference
    let refDate = formatDateNow().setDate(new Date().getDate() + 1);
    let dateTom = Math.round(new Date(refDate).getTime() / (1000 * 3600 * 24));

    let dataForArduino;

    // already been notified
    // check if same date
    if (book.notif.isNotified) {
        // grab what date the book is notified
        let dateNotified = Math.round(
            new Date(book.notif.dateNotified).getTime() / (1000 * 3600 * 24)
        );

        // if already been notified
        // return a message
        if (dateNotified === dateNow) {
            dataForArduino = `<notified#>`;

            return dataForArduino;
        }
    }

    // current transaction
    // if date tomorrow is less than due date and
    // date borrowed is not now and
    // date tomorrow is not equal to due date
    if (dateTom < dueDate && dateBorrowed === dateNow && dateTom !== dueDate) {
        dataForArduino = `<current#${book.borrower.contact}#${book.title}#${book.author}#${book.dateBorrowed}#${book.dueDate}#${book.fine}>`;

        return dataForArduino;
    }

    // book is NOT due
    // if not the current transaction
    // and date tomorrow is less than due date
    if (dateTom < dueDate) {
        dataForArduino = `<notDue#>`;
        return dataForArduino;
    }

    //book is due tomorrow
    // if date tomorrow is equal to
    // due date of the book
    if (dateTom === dueDate) {
        dataForArduino = `<dueTom#${book.borrower.contact}#${book.title}#${book.author}#${book.dateBorrowed}#${book.dueDate}#${book.fine}>`;

        return dataForArduino;
    }

    //book is due today
    // if date tomorrow minus the due
    // date of the book is one
    if (dateTom - dueDate === 1) {
        dataForArduino = `<dueToday#${book.borrower.contact}#${book.title}#${book.author}#${book.dateBorrowed}#${book.dueDate}#${book.fine}>`;

        return dataForArduino;
    }

    //book is overdue
    // if date tomorrow minus the due date
    // is greater than one
    // meaning several days have past
    if (dateTom - dueDate > 1) {
        dataForArduino = `<overdue#${book.borrower.contact}#${book.title}#${book.author}#${book.dateBorrowed}#${book.dueDate}#${book.fine}>`;

        return dataForArduino;
    }
}

module.exports = checkBookState;
