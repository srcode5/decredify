import numpy as np
from scipy.stats import norm
from datetime import datetime
from datetime import timedelta
from credit_portfolio_risk import posterior_pd, pool_wcl, pool_lgd

def tranche_structure(pool_id, 
                      N_borrowers, 
                      pool_exposure, 
                      pool_on_chain_collateral, 
                      tranche_thickness, 
                      raters_assessment, 
                      exposures=None):
    """
    :param pool_id: unique_uuid for a pool
    :param N_borrowers: number of expected or actual borrowers in the underlying pool, based on T&C
    :param pool_exposure: total pool exposure in usdc
    :param pool_on_chain_collateral: pool crypto collateral at the inception, denominated in usdc
    :param tranche_thickness: proposed tranche thickness of all tranches other than senior most tranche
    :param raters_assessment: array of PD assigned by multiple raters to the Pool
    :returns
        boolean: True if tranche is a valid tranche
    
    """
    posterior_PD = posterior_pd(raters_assessment)
    
    pool_LGD = pool_lgd(pool_exposure = pool_exposure, pool_on_chain_collateral = pool_on_chain_collateral)

    pool_EL, pool_WCL = pool_wcl(posterior_pd = posterior_PD, N_borrowers=N_borrowers, pool_lgd = pool_LGD, 
                    exposures=exposures)
    
    print("Pool PD is {}".format(posterior_PD))
    print("Pool EL is {}".format(pool_EL))
    print("Pool WCL is {}".format(pool_WCL))
    print("Pool Junior tranche thickness is {}".format(tranche_thickness[0]))
    print("Sum of All Tranches below senior-most tranche is {}".format(sum(tranche_thickness)))
    
    assert tranche_thickness[0]>=pool_EL,"Tranche 0 should be thick enough to absorb pool expected losses"
    assert sum(tranche_thickness)>=pool_WCL,"Total thickness of all tranches below the senior-most tranche should absorb pool worst-case loss"
    
    print(str(pool_id) + " is a valid tranche structure")
    print("Allowed senior-most tranche could be " + str((100-sum(tranche_thickness)*100)) + "% of total pool")
    
    return True