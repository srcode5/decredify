import numpy as np
from scipy.stats import norm
from datetime import datetime
from datetime import timedelta  
import json
import base64
from algosdk import account, mnemonic, constants
from algosdk.v2client import algod
from algosdk.future import transaction
from accounting import *
from contracts import *

#run the sandbox with testnet using: ./sandbox up testnet (after cd to the sandbox directory)
def make_periodic_payment(contract_id,
                          current_payment_date,
                          current_payment_amt,
                          senior_tranche_wallets,
                          senior_tranche_shares,
                          mezz_tranche_wallets,
                          mezz_tranche_shares,
                          junior_tranche_wallets,
                          jnuior_tranche_shares,
                          underwriters_wallets,
                          underwriters_shares,
                          raters_wallets,
                          raters_reliabilty_scores,
                          auditors_wallets,
                          auditors_reliability_scores,
                          sender_address,
                          sender_pk):
    
    """
    """
    
    contract_details = contracts(contract_id)
    
    senior_tranche_os, senior_interest_paid, senior_principal_paid, mezzanine_tranche_os, mezz_interest_paid, mezz_principal_paid, junior_tranche_pmt, underwriter_pmt, raters_pmt, auditors_pmt, cash_reserves = cashflow_dist(contract_id,current_payment_date, current_payment_amt)
    
    algod_address = "http://localhost:4001"
    algod_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    algod_client = algod.AlgodClient(algod_token, algod_address)
    
    print("Sender address: {}".format(sender_address))
    account_info = algod_client.account_info(sender_address)
    print("Account balance: {} microAlgos".format(account_info.get('amount')))
    
    # build transaction
    params = algod_client.suggested_params()
    
    unsigned_atomic_txn_group1 = []
    unsigned_atomic_txn_group2 = []
    signed_atomic_txn_group1 = []
    signed_atomic_txn_group2 = []
    
    for i in range(len(senior_tranche_wallets)):
        sr_int_amt = int(senior_tranche_shares[i]*senior_interest_paid)
        print("sr int amt {}".format(sr_int_amt))
        unsigned_int_txn_sr = transaction.PaymentTxn(sender_address, 
                                              params, 
                                              senior_tranche_wallets[i], 
                                              sr_int_amt,
                                                     None,
                                                     "Sr Tranche Interest".encode())
        
        unsigned_atomic_txn_group1.append(unsigned_int_txn_sr)
        #signed_int_txn_sr = unsigned_int_txn_sr.sign(sender_pk)
        #signed_atomic_txn_group1.append(signed_int_txn_sr)
        
        sr_p_amt = int(senior_tranche_shares[i]*senior_principal_paid)
        print("sr principal amt {}".format(sr_p_amt))
        unsigned_principal_txn_sr = transaction.PaymentTxn(sender_address, 
                                              params, 
                                              senior_tranche_wallets[i], 
                                              sr_p_amt, 
                                                           None, 
                                                           "Sr Tranche Principal".encode())
        
        unsigned_atomic_txn_group2.append(unsigned_principal_txn_sr)
        #signed_principal_txn_sr = unsigned_principal_txn_sr.sign(sender_pk)
        #signed_atomic_txn_group2.append(signed_principal_txn_sr)
        
    for i in range(len(mezz_tranche_wallets)):
        unsigned_int_txn_mezz = transaction.PaymentTxn(sender_address, 
                                              params, 
                                              mezz_tranche_wallets[i], 
                                              int(mezz_tranche_shares[i]*mezz_interest_paid),
                                                     None,
                                                     "Mezzanine Tranche Interest".encode())
        
        unsigned_atomic_txn_group1.append(unsigned_int_txn_mezz)
        #signed_int_txn_mezz = unsigned_int_txn_mezz.sign(sender_pk)
        #signed_atomic_txn_group1.append(signed_int_txn_mezz)
        
        unsigned_principal_txn_mezz = transaction.PaymentTxn(sender_address, 
                                              params, 
                                              mezz_tranche_wallets[i], 
                                              int(mezz_tranche_shares[i]*mezz_principal_paid), 
                                                           None, 
                                                           "Mezzanine Tranche Principal".encode())
        
        unsigned_atomic_txn_group2.append(unsigned_principal_txn_mezz)
        #signed_principal_txn_mezz = unsigned_principal_txn_mezz.sign(sender_pk)
        #signed_atomic_txn_group2.append(signed_principal_txn_mezz)
        
        
    for i in range(len(junior_tranche_wallets)):
        unsigned_txn_jr = transaction.PaymentTxn(sender_address, 
                                              params, 
                                              junior_tranche_wallets[i], 
                                              int(jnuior_tranche_shares[i]*junior_tranche_pmt),
                                                     None,
                                                     "Jr Tranche Payment".encode())
        
        unsigned_atomic_txn_group2.append(unsigned_txn_jr)
        #signed_int_txn_jr = unsigned_txn_jr.sign(sender_pk)
        #signed_atomic_txn_group2.append(signed_int_txn_jr)
        
    for i in range(len(underwriters_wallets)):
        unsigned_txn_underwriter = transaction.PaymentTxn(sender_address, 
                                              params, 
                                              underwriters_wallets[i], 
                                              int(underwriters_shares[i]*underwriter_pmt),
                                                     None,
                                                     "Underwriter Payment".encode())
        
        unsigned_atomic_txn_group1.append(unsigned_txn_underwriter)
        #signed_txn_underwriter = unsigned_txn_underwriter.sign(sender_pk)
        #signed_atomic_txn_group1.append(signed_txn_underwriter)

    for i in range(len(raters_wallets)):
        
        raters_score_sum = sum(raters_reliabilty_scores)
        raters_shares = [(i / raters_score_sum) for i in raters_reliabilty_scores]
        unsigned_txn_raters = transaction.PaymentTxn(sender_address, 
                                              params, 
                                              raters_wallets[i], 
                                              int(raters_shares[i]*raters_pmt),
                                                     None,
                                                     "Raters Payment".encode())
        
        unsigned_atomic_txn_group1.append(unsigned_txn_raters)
        #signed_txn_raters = unsigned_txn_raters.sign(sender_pk)
        #signed_atomic_txn_group1.append(signed_txn_raters)
        
    for i in range(len(auditors_wallets)):
        
        auditors_score_sum = sum(auditors_reliability_scores)
        auditors_shares = [(i / auditors_score_sum) for i in auditors_reliability_scores]
        
        unsigned_txn_auditors = transaction.PaymentTxn(sender_address, 
                                              params, 
                                              auditors_wallets[i], 
                                              int(auditors_shares[i]*auditors_pmt),
                                                     None,
                                                     "Auditors Payment".encode())
        
        unsigned_atomic_txn_group1.append(unsigned_txn_auditors)
        #signed_txn_auditors = unsigned_txn_auditors.sign(sender_pk)
        #signed_atomic_txn_group1.append(signed_txn_auditors)
        
    gid1 = transaction.calculate_group_id(unsigned_atomic_txn_group1)
    gid2 = transaction.calculate_group_id(unsigned_atomic_txn_group2)
    
    for ut in unsigned_atomic_txn_group1:
        ut.group = gid1
        
    for ut in unsigned_atomic_txn_group2:
        ut.group = gid2
        
    for ut in unsigned_atomic_txn_group1:
        st = ut.sign(sender_pk)
        signed_atomic_txn_group1.append(st)
        
    for ut in unsigned_atomic_txn_group2:
        st = ut.sign(sender_pk)
        signed_atomic_txn_group2.append(st)
        
    txid1 = algod_client.send_transactions(signed_atomic_txn_group1)
    print("Successfully sent transaction for periodic payments (interest and fees) with txID: {}".format(txid1))
    
    txid2 = algod_client.send_transactions(signed_atomic_txn_group2)
    print("Successfully sent transaction for principal payment with txID: {}".format(txid2))
    
    # wait for confirmation
    try:
        confirmed_txn1 = transaction.wait_for_confirmation(algod_client, txid1, 4)
        confirmed_txn2 = transaction.wait_for_confirmation(algod_client, txid2, 4)
    except Exception as err:
        print(err)
        return
    
    print("Confirmed Transaction information for periodic payments: {}".format(json.dumps(confirmed_txn1, indent=4)))
    print("Confirmed Transaction information for principal payments: {}".format(json.dumps(confirmed_txn2, indent=4)))
    print("Account balance: {} microAlgos".format(account_info.get('amount')))
    print("Fee: {} microAlgos".format(params.fee))