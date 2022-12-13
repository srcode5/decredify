import numpy as np
from scipy.stats import norm
from datetime import datetime
from datetime import timedelta

#this internal function gives the posterior Pool PD combining the prior PD with multiple raters assessment of the pool risk

def posterior_pd(raters_assessment):
    """
    :param raters_assessment: array of PD assigned by multiple raters to the Pool
    :return:
        posterior_PD: final PD to be used to compute pool worst case loss
    """
    prior_PD = 0.0576
    N = len(raters_assessment)
    credibility_weight = min(0.75, np.sqrt(max(0, (N-3)/10)))
    median_PD = np.median(raters_assessment)
    posterior_PD = (1-credibility_weight)*prior_PD + credibility_weight * median_PD
    
    return posterior_PD

def pool_wcl(posterior_pd, N_borrowers, pool_lgd=1, target_sr_tranche_rating = 'AA', exposures=None):
    """
    :param posterior_pd: output of posterior_pd function
    :param N_borrowers: number of expected or actual borrowers in the underlying pool, based on T&C
    :param pool_lgd: Expected loss given default of the underlying pool, based on collateralization levels
    :exposures: array of actual exposure to the borrowers in the pool. If none, then assumed to be uniform / equal
    :return:
        pool_el: expected average loss on the pool. Junior tranche should be >= pool_el
        pool_wcl: expected worst-case loss (in %) on the pool based on its credit quality
                  Junior + Mezzanine tranche >= pool_wcl
    """
    if exposures is not None:
        pcent_exposures = exposures/np.sum(exposures)
        HHI = np.sum(np.square(pcent_exposures))
        effective_N = 1/HHI
    else:
        effective_N = N_borrowers
        
    assert target_sr_tranche_rating in ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'C']
    
    if target_sr_tranche_rating in ['AAA', 'AA', 'A']:
        asrf_add_on = 1.31
    elif target_sr_tranche_rating == 'BBB':
        asrf_add_on = 1.25
    elif target_sr_tranche_rating == 'BB':
        asrf_add_on = 1.06
    elif target_sr_tranche_rating == 'B':
        asrf_add_on = 0.78
    else:
        asrf_add_on = 0.24
        
    NDM = 1 + np.sqrt(max(1, 10-effective_N))*0.05
    #print(NDM)
    
    expected_loss = posterior_pd * pool_lgd
    
    #refer annexure-1 for derivation
    worst_case_pd = norm.cdf((norm.ppf(posterior_pd) + asrf_add_on)/0.91)
    
    #or use the following formula if norm cdf and inverse cdf fx are not availble
    #worst_case_pd = 0.2313*np.log(posterior_pd)+1.0764
    
    pool_wcl = pool_lgd * worst_case_pd * NDM
        
    return expected_loss, pool_wcl

#this internal function computes pool lgd considering on_chain collateral
def pool_lgd(pool_exposure, pool_on_chain_collateral, haircut=0.25):
    """
    :param pool_exposure: total pool exposure in usdc
    :param pool_on_chain_collateral: pool crypto collateral at the inception, denominated in usdc
    :return
        pool_lgd: expected loss given default on the pool i.e. (1- recovery_rate)
    """
    pool_lgd = max(0,(1-pool_on_chain_collateral*(1-haircut)/pool_exposure))
    
    return pool_lgd

#this external function checks if a tranching structure is valid, starting from junior-most tranche
#i.e. junior and mezzanine tranches are of min required thickness to prevent pool losses from hitting senior tranches