const shortid = require('short-id')

// These backend calls will call the smart contracts in the contracts folder after we have deployed them
function routes(app, db){

    // For Anyone
    app.post('/register', (req, res) => {

    });

    // For Anyone
    app.post('/login', (req, res) => {

    });

    // For Anyone: Apply for a loan with a spending limit and interest rate
    // based on the liquidity pools that exist. Senior, Junior, and Mezzanine Tranches
    app.post('/apply-for-loan', (req, res) => {

    });

    // For Backers: Add liquidity to a particular pool
    app.post('/add-pool-liquidity', (req, res) => {

    });


    // When someone requests a loan, send a loan approval form to
    // nine auditors (9 randomly chosen backer in a particular liquidity pool). 
    app.post('/send-loan-approval-forms', (req, res) => {

    });

    // Process a vote to approve or disapprove a loan. If 5 yes votes are reached for the loan, the loan is passed. If 5 no's are
    // reached for the loan, then the loan is rejected.
    app.post('/vote-loan', (req, res) => {

    });

    // Get data from loans that were approved, disapproved, and pending.
    // Each loan will have info on its credit line, interest rate, lender, person who received the loan, timeframe, 
    // liquidity pool, and approval data
    // After processing loans of varying interest rates and credit lines for each liquidity pool, we can plot graphs representing
    // these data to put in our presentation.
    app.get('/get-loan-data', (req, res) => {

    });
}

module.exports = routes;