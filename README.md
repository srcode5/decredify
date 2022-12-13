#### This image gives a quick code overview. Refer steps given below for step-wise instructions on how to run the code

![decredifi_code_overview_image](DeCrediFi_Code_Demo.gif=250x250 "DeCrediFi_Code_Overview")


#### Step-1: decredify-core would need Algorand Sandbox Setup for recording the transactions on Algorand Testnet
```
git clone https://github.com/algorand/sandbox.git
cd sandbox
./sandbox up testnet
```
Refer https://github.com/algorand/sandbox for detailed instructions


#### Step-2: Create Test wallet addresses (or use the ones we provide), and goto Testnet faucet to fund them
#create few test accounts on TestNet and fund them
```
from algosdk import account
from algosdk import mnemonic

private_key, public_address = account.generate_account()
print("Base64 Private Key: {}\nPublic Algorand Address: {}\n".format(private_key, public_address))
mnemonic.from_private_key(private_key)
```
##### https://dispenser.testnet.aws.algodev.network/ to goto faucet for dispensing miniAlgos


#### Step-3: Check if a tranche structure is valid
##### This function will internally call four functions: posterior_pd, pool_wcl, pool_lgd, tranche_structure
```
from tranche_structure import *

check_if_valid = tranche_structure(pool_id ="Test Pool",
                                  N_borrowers = 5,
                                  pool_exposure = 1000000,
                                  pool_on_chain_collateral = 100000,
                                  tranche_thickness = [0.10, 0.40],
                                  raters_assessment = [0.02, 0.06, 0.08, 0.10, 0.12, 0.13, 0.14],
                                  exposures=[100000, 200000, 200000, 200000, 300000])
                                  
**Expected output:**
Pool PD is 0.08441611455822787
Pool EL is 0.07808490596636078
Pool WCL is 0.4866604158510466
Pool Junior tranche thickness is 0.1
Sum of All Tranches below senior-most tranche is 0.5
Test Pool is a valid tranche structure
Allowed senior-most tranche could be 50.0% of total pool
```

**this should generate an error as this is not a valid tranche structure**
#this should generate assertion error "Tranche 0 should be thick enough to absorb pool expected losses"
```
check_if_valid = tranche_structure(pool_id ="Test Pool",
                                  N_borrowers = 5,
                                  pool_exposure = 1000000,
                                  pool_on_chain_collateral = 100000,
                                  tranche_thickness = [0.050, 0.350],
                                  raters_assessment = [0.02, 0.06, 0.08, 0.10, 0.12, 0.13, 0.14],
                                  exposures=[100000, 200000, 200000, 200000, 300000])
 ```
                                  
**this should also throw an error**
#this should generate assertion error "Total thickness of all tranches below the senior-most tranche should absorb pool worst-case loss"
```
check_if_valid = tranche_structure(pool_id ="Test Pool",
                                  N_borrowers = 5,
                                  pool_exposure = 1000000,
                                  pool_on_chain_collateral = 100000,
                                  tranche_thickness = [0.10, 0.30],
                                  raters_assessment = [0.02, 0.06, 0.08, 0.10, 0.12, 0.13, 0.14],
                                  exposures=[100000, 200000, 200000, 200000, 300000])
 ```                                
#### Step-4: Distribute periodic cashflows to tranche investors using waterfall mechanism
##### this function would internally call allocate_payment, cashflow_dist, make_periodic_payment functions
##### Make sure you have Algorand Testnet running before this command
  
###### One can use their wallet addresses instead of these test addresses
```
contract_id = 'contract_1'
current_payment_date = '1-Dec-2022'
current_payment_amt = 3300000
senior_tranche_wallets = ['QWUL5NQD5YOLIGEUXM3AS6DCTQ4OXGT4KYDIAEKVKIECTACXUNC5GSKBDU',
                          'C7XYL6DO35S5VQHD75OSBFB65ZHXRDW2C7JNRQMPGNL3BTIV43HZEWAJCE',
                          'O6AID3PCKXWL67IBNWAVEYYF3CT7UUGAKAVRKLRBZTYJU7SYYPDQABGRXU']
senior_tranche_shares = [0.5, 0.25, 0.25]
mezz_tranche_wallets = ['6FUNO2OAYXZCJUST6TFDIHDPAND5ZDX5W6WGCSE5OLUSWMOL43DP7RDHYQ',
                        'HRUDQUTZ54AOP4K5H6PYKEBG55FAFERCJQ7OUWJFKVHOI3Q2HW7325J62Q']
mezz_tranche_shares = [0.6, 0.4]
junior_tranche_wallets = ['W4ZRYEDYWSPZIVXCFJJQ25J6HG7HF4SXJVJYZQBR3O4F5JG4JSYHUXDDSQ',
                         '3QVCRMS54GZMQL2UBP2GELRQWGUYNUXKRHNVSWIYMVUQEDC2ZFYZHQLMIE']
jnuior_tranche_shares = [0.6, 0.4]
underwriters_wallets = ['W4ZRYEDYWSPZIVXCFJJQ25J6HG7HF4SXJVJYZQBR3O4F5JG4JSYHUXDDSQ',
                         '3QVCRMS54GZMQL2UBP2GELRQWGUYNUXKRHNVSWIYMVUQEDC2ZFYZHQLMIE']
underwriters_shares = [0.6, 0.4]
raters_wallets = ['VTJD63RUH2WSJNF6GWG7TNW2J6N4O3ZWYGHSNBAYAIQP7HKWAISVRA6RYI',
                  'PGQQQDWB765BWKQH77SAWABKCFGHZK2X4OQU6ICHXS5N3HAABJKPYJMOME']
raters_reliabilty_scores = [20, 10]
auditors_wallets = ['NEEGNRE5PDIXFBZZT3HUZFAEBBFYTNKXVBIVGEAK54JA6LHFEJS5AP4CFE',
                   'BZPR56X7ABHZM5CT6P2FNRTLUMTUGPXP7MUQLOK344WQNZTXT6NECOTKLM']
auditors_reliability_scores= [10, 10]
sender_address = 'P47ZGF6XCZVDE7K54KBNO5TKN5ONCJ7D3ZZV2CCG4R466VLMCV6BQWLYRE'
sender_pk= 'qj1kJp8sw35twC2ACDrJeaoeYimE8LBeXNhTZydYQWJ/P5MX1xZqMn1d4oLXdmpvXNEn495zXQhG5HnvVWwVfA=='

from waterfall_mechanism import *

#calling the allocation function
make_periodic_payment(contract_id,
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
                          sender_pk)
                          
**Expected output**
interest accrued for senior tranche is 400000.0
principal payment due for senior tranche is 1666666.6666666667
interest paid to senior tranche is 360000.0
principal paid to senior tranche is 1666666.6666666667
Periodic Fees paid to Underwriter is 16000.0
Periodic Fees paid to Raters is 12000.0
Periodic Fees paid to Auditor is 12000.0
interest accrued for mezzanine tranche is 400000.0
principal payment due for mezzanine tranche is 833333.3333333334
interest paid to mezzanine tranche is 400000.0
principal paid to mezzanine tranche is 833333.3333333333
cash_reserves 0.0
senior_tranche_os 58333333.333333336
mezzanine_tranche_os 29166666.666666668
Sender address: P47ZGF6XCZVDE7K54KBNO5TKN5ONCJ7D3ZZV2CCG4R466VLMCV6BQWLYRE
Account balance: 13264653 microAlgos
sr int amt 180000
sr principal amt 833333
sr int amt 90000
sr principal amt 416666
sr int amt 90000
sr principal amt 416666
Successfully sent transaction for periodic payments (interest and fees) with txID: HEVNBFUI6ZWGR34BI5GOVL6NYIJN5ORE3JWQYC2QADOB2BCGHIIA
Successfully sent transaction for principal payment with txID: 2HHB3AFRGTL54NQ5IEEQSELQ4N7HTTRTC7QWXWITH6EEKDMJZQTQ
Confirmed Transaction information for periodic payments: {
    "confirmed-round": 26052707,
    "pool-error": "",
    "txn": {
        "sig": "INHICbRGyjwcpZ8u2yL4qS3aLg/1eCuGVN+P73AGlA1BUeTxDmb8axFlxKYB55RlI1dUHCy6MgjkQJNpTn8cBQ==",
        "txn": {
            "amt": 180000,
            "fee": 1000,
            "fv": 26052704,
            "gen": "testnet-v1.0",
            "gh": "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
            "grp": "6ANLyZsK+Yh8JHNua24e8Y9Pzl70tTtPFCqiPrmHrSA=",
            "lv": 26053704,
            "note": "U3IgVHJhbmNoZSBJbnRlcmVzdA==",
            "rcv": "QWUL5NQD5YOLIGEUXM3AS6DCTQ4OXGT4KYDIAEKVKIECTACXUNC5GSKBDU",
            "snd": "P47ZGF6XCZVDE7K54KBNO5TKN5ONCJ7D3ZZV2CCG4R466VLMCV6BQWLYRE",
            "type": "pay"
        }
    }
}
Confirmed Transaction information for principal payments: {
    "confirmed-round": 26052707,
    "pool-error": "",
    "txn": {
        "sig": "nYMC61aIMRPwfGow3tIaU+7Hb+M0VcA3vqK/UpQIZYu3JF8JSk5OhaPre6uqEofiFZ55GZGqi4vFjxgPwLgfBA==",
        "txn": {
            "amt": 833333,
            "fee": 1000,
            "fv": 26052704,
            "gen": "testnet-v1.0",
            "gh": "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
            "grp": "9JivT7w1QfxhGeQZqYom2K40JNdfx8+kTypiJY7LsV4=",
            "lv": 26053704,
            "note": "U3IgVHJhbmNoZSBQcmluY2lwYWw=",
            "rcv": "QWUL5NQD5YOLIGEUXM3AS6DCTQ4OXGT4KYDIAEKVKIECTACXUNC5GSKBDU",
            "snd": "P47ZGF6XCZVDE7K54KBNO5TKN5ONCJ7D3ZZV2CCG4R466VLMCV6BQWLYRE",
            "type": "pay"
        }
    }
}
Account balance: 13264653 microAlgos
Fee: 0 microAlgos
```
