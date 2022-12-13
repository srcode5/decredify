#contract_details is a dictionary containing all contract terms and conditions, and tranche structure
#tranche thickness will be a list containing thickness from the senior-most tranche to the junior-most 
#tranche_current_principal will consist of outstanding principal at beginning of period

def contracts(contract_id):

    contracts = {
        'contract_1' : {
        'pool_name' : "Contract 1",
        'pool_exposure' : 100000000,
        'tranche_thickness' : [0.60, 0.30, 0.10],
        'tranche_ids':['senior', 'mezzanine', 'junior'],
        'tranche_initial_principal' : [60000000, 30000000],
        'tranche_current_principal' : [60000000, 30000000],
        'interest_rate_annualised' : 0.15,
        'tranche_yield_annualized' : [0.08, 0.16],
        'term_in_years' : 3,
        'principal_payment_freq_ntimes_year' : 12,
        'int_payment_freq_ntimes_year' : 12,
        'int_accrual_freq_ntimes_year': 12,
        'grace_period_in_days' : 5,
        'late_fees_annualised' : 0.01,
        'contract_start_date' : '1-Nov-2022',
        'previous_payment_date' : '30-Nov-2022',
        'cash_reserves': 0,}
    }
    
    return contracts[contract_id]