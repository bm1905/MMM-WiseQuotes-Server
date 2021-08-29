const User = require('./models/user');
const Quote = require('./models/quote');
const fakeDbData = require('./data.json');

class FakeDb {
    constructor() {
        this.quotes = fakeDbData.quotes;
        this.users = fakeDbData.users;
    }

    async cleanDb() {
        await User.deleteMany();
        await Quote.deleteMany();
    }

    pushDataToDb() {
        const user = new User(this.users[0]);
        this.quotes.forEach((quote) => {
            const newQuote = new Quote(quote);
            newQuote.user = user;
            user.quotes.push(newQuote);
            newQuote.save();
        });
        user.save();
    }

    async seedDb() {
        await this.cleanDb();
        this.pushDataToDb();
    }
}

module.exports = FakeDb;