import express from 'express';
const router = express.Router();

import {loadPools, makeTokenRequest} from '../controllers/request.js';

router.post('/load-pools', loadPools);
router.post('/make-token-request', makeTokenRequest);
//router.post('/register', register);
//router.post('/login', login);
// For Anyone: Apply for a loan with a spending limit and interest rate
// based on the liquidity pools that exist. Senior, Junior, and Mezzanine Tranches
//router.post('/apply-for-loan', applyForLoan);
// For Backers: Add liquidity to a particular pool
//router.post('/add-pool-liquidity', addPoolLiquidity);
// When someone requests a loan, send a loan approval form to
// nine auditors (9 randomly chosen backer in a particular liquidity pool). 
//router.post('/send-loan-approval-forms', sendLoanApprovalForms);
// Process a vote to approve or disapprove a loan. If 5 yes votes are reached for the loan, the loan is passed. If 5 no's are
// reached for the loan, then the loan is rejected.
//router.post('/vote-loan', voteLoan);
// Get data from loans that were approved, disapproved, and pending.
// Each loan will have info on its credit line, interest rate, lender, person who received the loan, timeframe, 
// liquidity pool, and approval data
// After processing loans of varying interest rates and credit lines for each liquidity pool, we can plot graphs representing
// these data to put in our presentation.
//router.post('/get-loan-data', getLoanData);
module.exports = router;