import React, { useState, useEffect } from "react";
import Header from "../components/headers/light.js";
import Footer from "components/footers/FiveColumnWithBackground.js";
import AnimationRevealPage from "../helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import Web3 from "web3";
import {ethers} from "ethers";
import { Card, Avatar, Badge } from "antd";
import { motion } from "framer-motion";
import { css } from "styled-components/macro";
import styled from "styled-components";
import { HomeOutlined } from "@ant-design/icons";
import SmallCardOne from "../components/cards/SmallCard";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { useSelector } from "react-redux";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading } from "components/misc/Headings.js";
import { ReactComponent as StarIcon } from "images/star-icon.svg";
import { ReactComponent as SvgDecoratorBlob1 } from "images/svg-decorator-blob-5.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "images/svg-decorator-blob-7.svg";

import {toast} from "react-toastify";
import { SettingOutlined } from "@ant-design/icons";
import moment from "moment";
import {Input} from "mdbreact";
import { MDBCol, MDBIcon } from "mdbreact";
import SearchField from "react-search-field";
import Icon from 'react-component-bytesize-icons';
import Countdown from 'react-countdown';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import Popup from 'reactjs-popup';
import ContactUsForm from "components/forms/TwoColContactUsWithIllustrationFullForm.js";
import {Subheading as SubheadingBase } from "components/misc/Headings.js";
import Heart from "react-animated-heart";
import {likedRequest} from "actions/auth";
import {userFinder} from "../actions/request.js";

const { Meta } = Card;
const { Ribbon } = Badge;



 
const Message = (props) => (
    <div>
        Trash icon: <Icon name="trash"/>
    </div>
);

const HeaderRow = tw(motion.div)`flex justify-between items-center flex-col flex flex-wrap xl:flex-row `;
const TabsControl = tw.div`flex flex-wrap bg-pink-200 px-2 py-2 rounded leading-none mt-12 xl:mt-0`;


const TabControl = styled.div`
  ${tw`cursor-pointer px-6 py-3 mt-2 sm:mt-0 sm:mr-2 last:mr-0 text-gray-600 font-medium rounded-sm transition duration-300 text-sm sm:text-base w-1/2 sm:w-auto text-center`}
  &:hover {
    ${tw`bg-blue-300 text-gray-700`}
  }
  ${props => props.active && tw`bg-blue-500! text-gray-100! rounded!`}
  }
`;
const Heading = tw(SectionHeading)``;
const TabContent = tw(motion.div)`mt-6 flex flex-wrap sm:-mr-10 md:-mr-6 lg:-mr-12`;
const CardOneContainer = tw.div`mt-2 mb-2 w-full sm:w-1/5 md:w-1/3 lg:w-1/5 sm:pr-5 md:pr-3 lg:pr-5`;
const CardOne = tw(motion.a)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;
const CardOneImageContainer = styled.div`
  ${props => css`background-image: url("${props.imageSrc}");`}
  ${tw`h-40 xl:h-40 bg-center bg-cover relative rounded-t`}
`;

const Form = tw.form`mx-auto max-w-xs`;
const CardOneRatingContainer = tw.div`leading-none absolute inline-flex bg-orange-300 top-0 left-0 ml-2 mt-1 rounded-full px-3 py-1 items-end`;
const CardOneQuality = styled.div`
  ${tw`mr-1 text-sm font-bold flex items-end text-black`}
  svg {
    ${tw`w-4 h-4 fill-current text-orange-400 mr-1`}
  }
`;

const contentStyle = { background: '#e91d63' };
const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
const arrowStyle = { color: '#000' }; // style for an svg element

const CardOneHoverOverlay = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.5);
  ${tw`absolute inset-0 flex justify-center items-center`}
`;
const CardOneButton = tw(PrimaryButtonBase)`text-sm`;
const CardIcon = tw(PrimaryButtonBase)`text-xs`;
const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const FormContainer = tw.div`w-full flex-1 mt-8`;
const CardOneReview = tw.div`font-medium text-xs text-gray-600`;

const Text = styled.div`
  ${tw`text-sm  text-white font-display`}
  p {
    ${tw`mt-2 leading-loose`}
  }
  h1 {
    ${tw`text-3xl font-bold mt-10`}
  }
  h2 {
    ${tw`text-2xl font-bold mt-8`}
  }
  h3 {
    ${tw`text-xl font-bold mt-6`}
  }
  ul {
    ${tw`list-disc list-inside`}
    li {
      ${tw`ml-2 mb-3`}
      p {
        ${tw`mt-0 inline leading-normal`}
      }
    }
  }
`;
const Textarea = styled(Input).attrs({as: "textarea"})`
  ${tw`h-24`}
`

const CardOneText = tw.div`p-3 text-gray-900 h-32`;
const CardOneTitle = tw.h5`text-lg font-semibold group-hover:text-primary-500`;
const CardOneContent = tw.p`mt-1 text-xs font-medium text-gray-600`;
const CardOnePrice = tw.p` text-lg font-bold`;
const CardOneTimer = tw.p` text-xs justify-end`;

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-64 w-64 opacity-15 transform translate-x-2/3 -translate-y-12 text-pink-400`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-80 w-80 opacity-15 transform -translate-x-2/3 text-primary-500`}
`;

const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));  

/**
 * Purpose: Webpage to send tokens from current customer's address to another wallet address on the testnet. Currently has 
 * functionality to send ETH to other wallet addresses, and once newer restaurant tokens are approved they will be added to
 * the app's functionality for sending/receiving tokens.
 */
export default ({ roundedHeaderButton=true, }) => {
  /**
   * 
   * This function enables the Metamask popup to show, allowing the customer to sign the transaction after the user clicks "Send".
   */
  const startPayment = async ({ setError, setTxs, ether, addr }) => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
  
      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      ethers.utils.getAddress(addr);
      const tx = await signer.sendTransaction({
        to: addr,
        value: ethers.utils.parseEther(ether)
      });
      console.log({ ether, addr });
      console.log("tx", tx);
      setTxs([tx]);
    } catch (err) {
      setError(err.message);
    }
  };

    const [error, setError] = useState();
    const [txs, setTxs] = useState([]);
  
    /**
     * 
     * This function is immediately executed upon clicking "Send" in the submit button of the form rendered on the page.
     * This function invokes the startPayment function above, which enables the customer to sign the transaction of sending
     * a certain amount of tokens to another wallet address. Currently, the token used is ETH, but as more and more tokens are
     * approved by the Decredify team, they will show up in a dropdown menu along with ETH!
     */
    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      toast.success("Loan requested! Stay on the lookout for an email should your loan be approved.")
      /*await startPayment({
        setError,
        setTxs,
        ether: data.get("ether"),
        addr: data.get("addr")
      });*/
    };

    return (
      <>

        <AnimationRevealPage>
            <Header roundedHeaderButton={roundedHeaderButton} />
            <Container>
      <ContentWithPaddingXl>
        <HeaderRow>
          <Heading>Request a DeFi Loan</Heading>
        </HeaderRow>
        <FormContainer>
        <Form className="m-4" onSubmit={handleSubmit}>
        <div>
            <br/>
            <br/>
            <h2><b>Loan Amount</b></h2>
                
            
            <div>
                <Input
                  name="amt"
                    type="text"
                    placeholder="100"
                />
            </div>
            <br/>
            <h2><b>Token</b></h2>
            <div>
                <Input
                name="token"
                    type="text"
                    placeholder="0.0" 
                /> 
            </div>
            <br/>
            <br/>
            <h2><b>Time Period</b></h2>
                
            
            <div>
                <Input
                  name="time"
                    type="text"
                />
            </div>
            <br/>
            <br/>
            <h2><b>Credit Score (optional)</b></h2>
                
            
            <div>
                <Input
                  name="time"
                    type="text"
                />
            </div>
            <br/>
            <div>
                <SubmitButton
                    type="submit"
                >Request Loan</SubmitButton>
            </div>
        </div>
        </Form>
                
              
            </FormContainer>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            
        
      </ContentWithPaddingXl>
      </Container>
      <Footer />
      </AnimationRevealPage>
    </>
    );
  };
