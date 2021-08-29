const Quote = require('../models/quote');
const { normalizeErrors } = require('../helpers/mongoose');

exports.allQuotes = function (req, res) {
    Quote.find({})
        .exec(function (err, foundQuotes) {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }
            return res.json(foundQuotes);
        });
};

exports.randomQuote = function (req, res) {
    Quote.countDocuments().exec(function(err, count) {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        var random = Math.floor(Math.random() * count);
        Quote.findOne().skip(random).exec(
            function (err, randomQuote) {
                if (err) {
                    return res.status(422).send({ errors: normalizeErrors(err.errors) });
                }
                res.json(randomQuote);
            }
        );
    });
};
  

exports.quotesByCategory = function (req, res) {
    const category = req.params.category.toLowerCase();
    Quote.find({ category })
        .exec(function (err, foundQuotes) {
            if (err) {
                return res.status(422).send({ errors: [{ title: 'Error!', detail: 'Could not find quotes!' }] });
            }
            return res.json(foundQuotes);
        });
};

exports.addQuotes = function (req, res) {
    const { category, quote } = req.body;
    const user = req.user;
    const date = Date.now;

    if (!category || !quote) {
        return res.status(422).send({ errors: [{ title: 'Missing data!', detail: 'Please provide category and quotes!' }] });
    }

    const newQuote = new Quote({
        category, quote, date, user
    });

    newQuote.save(function (err) {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        return res.json({ 'isCreated': 'true' })
    });
};
