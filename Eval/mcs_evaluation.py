import random
import math
import scipy.stats
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

#we hold a portfolio of three senior tranches
#each is protected by a junior tranche of 20%
#each pool is to a single exposure of $1mio
#and has a single borrower with PD of 5%
#asset correlation assumed at 18%

PD = [0.01, .05, 0.1, 0.2, 0.3]
LGD = [0.45, 0.6, 0.8, 1] #as per BCBS Corporate LGD for unsecured exposures
R = [0.01, 0.18, 0.99] #18%, as per BCBS Corporate Asset Correlation Formula
n_portfolio = 3 #for Goldfinch
n = 1 #for Goldfinch, number of borrowers in each portfolio
exposure = 1 #exposure to each borrower
j_tranche_gf_pcent = 0.2
j_tranche_gf = j_tranche_gf_pcent * 1 #size of junior tranche in $ for each portfolio of $1mio
j_tranche_decredifi_pcent = 0.15
j_tranche_decredifi = j_tranche_decredifi_pcent * 3 #size of junior tranche in $ for single portfolio of $3mio
n_portfolio_decredifi = 1 #for decredifi
n_decredifi = 3 #number of borrowers in the pool

random.seed(1234)
iter = 20000 #number of realizations of the systematic factor

output_pd = []
output_r = []
output_lgd = []
output_gf_avg_l = []
output_gf_wcl = []
output_de_avg_l = []
output_de_wcl = []


for prob_d in PD:
    for l in LGD:
        for asset_r in R:
            #number of economic scenarios

            #initialize port loss to 0 for all scenarios
            port_loss = [0 for x in range(iter)] #for goldfinch, overall loss distribution
            port_loss1 = [0 for x in range(iter)] #for goldfinch, loss on pool-1
            port_loss2 = [0 for x in range(iter)] #for goldfinch, loss on pool-2
            port_loss3 = [0 for x in range(iter)] #for goldfinch, loss on pool-3
            port_loss_s = [0 for x in range(iter)] #for decredifi

            for i in range(iter):
                sys_fac = np.random.normal()

                #for each portfolio for goldfinch
                for j in range(n_portfolio):

                    #each portfolio consisting of n assets
                    #we find the loss for the senior tranche
                    for k in range(n):
                        if math.sqrt(asset_r) * sys_fac + math.sqrt(1-asset_r) * np.random.normal() < scipy.stats.norm.ppf(prob_d):

                            #senior tranche loss on pool-1 for goldfinch investor
                            if j == 0:
                                port_loss1[i] = port_loss1[i] + max(0, (exposure * l - j_tranche_gf))

                            if j == 1:
                                port_loss2[i] = port_loss2[i] + max(0, (exposure * l - j_tranche_gf))

                            if j == 2:
                                port_loss3[i] = port_loss3[i] + max(0, (exposure * l - j_tranche_gf))

                #overall port loss for senior_tranche investor in goldfinch
                port_loss[i] = port_loss1[i] + port_loss2[i] + port_loss3[i]
                assert(len(port_loss) == iter)

                #for each decredifi portfolio
                for j in range(n_portfolio_decredifi):

                    #each portfolio consisting of n assets
                    #we find the loss for the senior tranche
                    for k in range(n_decredifi):
                        if math.sqrt(asset_r) * sys_fac + math.sqrt(1-asset_r) * np.random.normal() < scipy.stats.norm.ppf(prob_d):
                            port_loss_s[i] = port_loss_s[i] + max(0, (exposure*l - j_tranche_decredifi))
                            
                assert(len(port_loss_s) == iter)

            print("\n")
            print("for pd {}".format(prob_d))
            print("for lgd {}".format(l))
            print("for asset_R {}".format(asset_r))

            #(n_portfolio*n*(1-j_tranche_gf_pcent))
            #/(n_portfolio_decredifi*n_decredifi*(1-j_tranche_decredifi_pcent))

            print("average loss for goldfinch sr tranche investor {}".format(np.mean(port_loss)/(n_portfolio*n*(1-j_tranche_gf_pcent))))
            print("WCL for goldfinch sr tranche investor {}".format(np.quantile(port_loss, 0.99)/(n_portfolio*n*(1-j_tranche_gf_pcent))))
            print("Max loss for goldfinch sr tranche investor {}".format(np.max(port_loss)/(n_portfolio*n*(1-j_tranche_gf_pcent))))

            print("average loss for decredifi sr tranche investor {}".format(np.mean(port_loss_s)/(n_portfolio_decredifi*n_decredifi*(1-j_tranche_decredifi_pcent))))
            print("WCL for goldfinch sr tranche investor {}".format(np.quantile(port_loss_s, 0.99)/(n_portfolio_decredifi*n_decredifi*(1-j_tranche_decredifi_pcent))))
            print("Max loss for goldfinch sr tranche investor {}".format(np.max(port_loss_s)/(n_portfolio_decredifi*n_decredifi*(1-j_tranche_decredifi_pcent))))

            output_pd.append(prob_d)
            output_lgd.append(l)
            output_r.append(asset_r)
            output_gf_avg_l.append(np.mean(port_loss)/(n_portfolio*n*(1-j_tranche_gf_pcent)))
            output_gf_wcl.append(np.quantile(port_loss, 0.99)/(n_portfolio*n*(1-j_tranche_gf_pcent)))
            output_de_avg_l.append(np.mean(port_loss_s)/(n_portfolio_decredifi*n_decredifi*(1-j_tranche_decredifi_pcent)))
            output_de_wcl.append(np.quantile(port_loss_s, 0.99)/(n_portfolio_decredifi*n_decredifi*(1-j_tranche_decredifi_pcent)))
            
df = None
df = pd.DataFrame(columns = ['PD', 'LGD', 'R', 'Avg_Loss_GF', 'WCL_GF', 'Avg_Loss_De', 'WCL_De'])

df['PD'] = output_pd
df['LGD'] = output_lgd
df['R'] = output_r
df['Avg_Loss_GF'] = output_gf_avg_l
df['WCL_GF'] = output_gf_wcl
df['Avg_Loss_De'] = output_de_avg_l
df['WCL_De'] = output_de_wcl

df.to_csv('gf_vs_decredifi.csv')
