import React, {useState} from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import illustration from "images/signup-illustration.svg";
import googleIconImageSrc from "images/google-icon.png";
import {ethers} from 'ethers';
import twitterIconImageSrc from "images/twitter-icon.png";
import { ReactComponent as SignUpIcon } from "feather-icons/dist/icons/user-plus.svg";
import Header from "../components/headers/light.js";
import axios from 'axios';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSelector, useDispatch} from 'react-redux';
import { ContentWithPaddingXl } from "components/misc/Layouts";
import { SectionHeading } from "components/misc/Headings";

const Container = tw(ContainerBase)`min-h-screen bg-white text-white font-medium flex justify-center`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;
const Heading1 = tw(SectionHeading)`text-blue-500 mb-10`;
const HeadingRow = tw.div`flex`;

const SocialButtonsContainer = tw.div`flex flex-col items-center`;
const SocialButton = styled.a`
  ${tw`w-full max-w-xs font-semibold rounded-lg py-3 border text-gray-900 bg-gray-100 hocus:bg-gray-200 hocus:border-gray-400 flex items-center justify-center transition-all duration-300 focus:outline-none focus:shadow-outline text-sm mt-5 first:mt-0`}
  .iconContainer {
    ${tw`bg-white p-2 rounded-full`}
  }
  .icon {
    ${tw`w-4`}
  }
  .text {
    ${tw`ml-4`}
  }
`;

const DividerTextContainer = tw.div`my-12 border-b text-center relative`;
const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-pink-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-lg bg-contain bg-center bg-no-repeat`}
`;

/**
 * Purpose: Connect wallet to testnet and view payment history data on Etherscan.
 */
const Register = ({history, logoLinkUrl = "/",
illustrationImageSrc = illustration,
socialButtons = [
  {
    iconImageSrc: googleIconImageSrc,
    text: "Sign Up With Google",
    url: "https://google.com"
  },
],
submitButtonText = "Sign Up",
SubmitButtonIcon = SignUpIcon,
tosUrl = "/terms-of-service",
privacyPolicyUrl = "/privacy-policy",
signInUrl = "/login",
roundedHeaderButton=true,}) => {
  const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(localStorage.getItem("walletAddress"));
	const [userBalance, setUserBalance] = useState(localStorage.getItem("walletBalance"));
	const [connButtonText, setConnButtonText] = useState(localStorage.getItem("connButtonText") ? localStorage.getItem("connButtonText") : "Connect Wallet to Rinkeby");

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			console.log('MetaMask Here!');

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText(result[0]);
        console.log(result);
        localStorage.setItem("walletAddress", result[0]);
        localStorage.setItem("connButtonText", "Wallet Connected!")
				getAccountBalance(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());
	}

	const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
      localStorage.setItem("walletBalance", ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
    setUserBalance("Must reconnect wallet");
    localStorage.setItem("connButtonText", "Connect Wallet");
    setDefaultAccount("Must reconnect wallet");
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);
  return (<AnimationRevealPage>
    <Header roundedHeaderButton={roundedHeaderButton} />
    {<Container>
      <Content>
        <MainContainer>
          
            <FormContainer>
                <SubmitButton onClick={connectWalletHandler}>
                  {connButtonText}
                </SubmitButton>
                
              
            </FormContainer>
            <br></br>
            <br></br>
            <div className='accountDisplay'>
				<p><b>Address:</b> {defaultAccount}</p>
			</div>
			<div className='balanceDisplay'>
				<p><b>Balance: </b>{userBalance} ETH</p>
        
			</div>
      {connButtonText !== "Connect Wallet" && <p> <b>Wallet Connected!</b> </p>} 
      {connButtonText === "Connect Wallet" && <p> <b>Must Reconnect Wallet to Refresh Wallet Details!</b> </p>} 
      <div>
      <a href={`https://rinkeby.etherscan.io/address/${defaultAccount}`}>See Your Address on Etherscan</a>
      </div>
      
        </MainContainer>
        <IllustrationContainer>
          <IllustrationImage imageSrc={illustrationImageSrc} />
        </IllustrationContainer>
      </Content>
    </Container>}
    
  </AnimationRevealPage>);
};

export default Register;
