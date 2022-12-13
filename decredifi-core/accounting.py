import numpy as np
from scipy.stats import norm
from datetime import datetime
from datetime import timedelta  
import json
import base64
from algosdk import account, mnemonic, constants
from algosdk.v2client import algod
from algosdk.future import transaction
from contracts import *

#this is an internal function that allocates a payment towards interest and principal due
def allocate_payment(tranche_id, amount_paid, principal_os, interest_due, principal_due):
    """
    """
    
    amount_left_for_dist = amount_paid
    
    #use the amount_paid first towards the interest due
    interest_paid = min(interest_due, amount_left_for_dist)
    amount_left_for_dist -=interest_paid
    
    principal_paid = 0
    #use remaining amount towards principal due
    principal_paid = min(principal_due, amount_left_for_dist)
    amount_left_for_dist -= principal_paid

    principal_os -= principal_paid
    
    return (amount_left_for_dist, principal_os, interest_paid, principal_paid)


#this internal function distributes cashflows to various tranches and participants
def cashflow_dist(contract_id, current_payment_date,current_payment_amt):
    
    contract_details = contracts(contract_id)
    
    payment_freq = contract_details['int_payment_freq_ntimes_year']
    accrual_freq = contract_details['int_accrual_freq_ntimes_year']
    
    accrued_interest = [((i/accrual_freq))**(12/payment_freq) for i in contract_details['tranche_yield_annualized']]
    #print(accrued_interest)
    tranches = contract_details['tranche_ids']
    
    current_payment_date = datetime.strptime(current_payment_date, '%d-%b-%Y')
    contract_start_date = datetime.strptime(contract_details['contract_start_date'], '%d-%b-%Y')
    last_payment_date =  contract_start_date + timedelta(days=contract_details['term_in_years']*365)
    
    last_pmt = False
    
    #add existing cash reserves to amount available for waterfall distribution
    cash_reserves = contract_details['cash_reserves']
    current_payment_amt += cash_reserves
    cash_reserves = 0
    
    if  current_payment_date>= last_payment_date:
        print("This is the last pmt date {}. Surplus will be distributed to junior tranche".format(current_payment_date))
        last_pmt = True
    
    if len(tranches) == 3:
        senior_tranche_os = contract_details['tranche_current_principal'][0]
        senior_tranche_yield = accrued_interest[0]
        senior_tranche_accrued_int = senior_tranche_os * senior_tranche_yield
        senior_tranche_principal_due = senior_tranche_os / (contract_details['term_in_years']*
                                                           contract_details['principal_payment_freq_ntimes_year'])
        
        print("interest accrued for senior tranche is {}".format(senior_tranche_accrued_int))
        print("principal payment due for senior tranche is {}".format(senior_tranche_principal_due))
        
        amount_left_for_dist, senior_tranche_os, senior_interest_paid, senior_principal_paid = allocate_payment(tranches[0],
                                                                   current_payment_amt,
                                                                  senior_tranche_os,
                                                                  senior_tranche_accrued_int,
                                                                  senior_tranche_principal_due)
        
        #Bottom 10% of the interest cashflows to senior tranche holders are diverted to the ecosystem participants
        #If senior tranche holders get <=90% of interest due, then participants get nothing
        #so allocation to ecosystem participants is subordinate / junior to the dues to senior tranche holders
        
        underwriter_pmt= 0
        raters_pmt = 0
        auditors_pmt = 0
        
        if senior_interest_paid > 0.9 * senior_tranche_accrued_int:
            #excess above 90% interest due is diverted to raters/underwriters/auditors
            amount_dist_to_participants = senior_interest_paid - 0.9 * senior_tranche_accrued_int
            
            #payment to senior tranche holders is limited to 90% of the due amount
            senior_interest_paid = 0.9 * senior_interest_paid
            
            underwriter_pmt = 0.4 * amount_dist_to_participants
            raters_pmt = 0.3 * amount_dist_to_participants
            auditors_pmt = 0.3 * amount_dist_to_participants
            
        print("interest paid to senior tranche is {}".format(senior_interest_paid))
        print("principal paid to senior tranche is {}".format(senior_principal_paid))
        print("Periodic Fees paid to Underwriter is {}".format(underwriter_pmt))
        print("Periodic Fees paid to Raters is {}".format(raters_pmt))
        print("Periodic Fees paid to Auditor is {}".format(auditors_pmt))
        
        mezzanine_tranche_os = contract_details['tranche_current_principal'][1]
        mezzanine_tranche_yield = accrued_interest[1]
        mezzanine_tranche_accrued_int = mezzanine_tranche_os * mezzanine_tranche_yield
        mezzanine_tranche_principal_due = mezzanine_tranche_os / (contract_details['term_in_years']*
                                                           contract_details['principal_payment_freq_ntimes_year'])
        
        print("interest accrued for mezzanine tranche is {}".format(mezzanine_tranche_accrued_int))
        print("principal payment due for mezzanine tranche is {}".format(mezzanine_tranche_principal_due))
        
        amount_left_for_dist, mezzanine_tranche_os, mezz_interest_paid, mezz_principal_paid = allocate_payment(tranches[1],
                                                                      amount_left_for_dist,
                                                                  mezzanine_tranche_os,
                                                                  mezzanine_tranche_accrued_int,
                                                                  mezzanine_tranche_principal_due)
        
        print("interest paid to mezzanine tranche is {}".format(mezz_interest_paid))
        print("principal paid to mezzanine tranche is {}".format(mezz_principal_paid))
        
        
        #any amount left is saved as cash reserves
        cash_reserves += amount_left_for_dist
        
        junior_tranche_pmt = 0
        if last_pmt == True:
            junior_tranche_pmt = cash_reserves
            cash_reserves = 0
            print("Final payment made to junior tranche is {}".format(junior_tranche_pmt))
        
        print("cash_reserves {}".format(cash_reserves))
        print("senior_tranche_os {}".format(senior_tranche_os))
        print("mezzanine_tranche_os {}".format(mezzanine_tranche_os))
    
    
    output = (senior_tranche_os,
              senior_interest_paid,
              senior_principal_paid,
              mezzanine_tranche_os,
              mezz_interest_paid,
              mezz_principal_paid,
              junior_tranche_pmt,
              underwriter_pmt,
              raters_pmt,
              auditors_pmt,
              cash_reserves)
    
    return output
              