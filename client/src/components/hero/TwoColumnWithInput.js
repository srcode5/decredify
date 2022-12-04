import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
//eslint-disable-next-line
import { css } from "styled-components/macro";

import Header from "../headers/light.js";

import { ReactComponent as SvgDecoratorBlob1 } from "../../images/svg-decorator-blob-1.svg";
import DesignIllustration from "../../images/front.png";
import PartnersLogoStripImage from "../../images/hotdesk.png";
import {useSelector, useDispatch} from 'react-redux';
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import {useState} from "react";
import { toast } from "react-toastify";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col lg:flex-row lg:items-center max-w-screen-xl mx-auto py-20 md:py-24`;
const LeftColumn = tw.div`relative lg:w-5/12 text-center max-w-lg mx-auto lg:max-w-none lg:text-left`;
const RightColumn = tw.div`relative mt-12 lg:mt-0 flex-1 flex flex-col justify-center lg:self-end`;

const Heading = tw.h1`font-bold text-3xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-900 leading-tight`;
const Paragraph = tw.p`my-5 lg:my-8 text-base xl:text-lg`;

const SubmitButton = tw(PrimaryButtonBase)`inline-block mt-8`

const Actions = styled.div`
  ${tw`relative max-w-md text-center mx-auto lg:mx-0`}
  input {
    ${tw`sm:pr-48 pl-8 py-4 sm:py-5 rounded-full border-2 w-full font-medium focus:outline-none transition duration-300  focus:border-primary-500 hover:border-gray-500`}
  }
  button {
    ${tw`w-full sm:absolute right-0 top-0 bottom-0 bg-blue-500 text-gray-100 font-bold mr-2 my-4 sm:my-2 rounded-full py-4 flex items-center justify-center sm:w-40 sm:leading-none focus:outline-none hover:bg-blue-700 transition duration-300`}
  }
`;

const IllustrationContainer = tw.div`flex justify-center lg:justify-end items-center`;

// Random Decorator Blobs (shapes that you see in background)
const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none opacity-5 absolute left-0 bottom-0 h-64 w-64 transform -translate-x-2/3 -z-10`}
`;

const Input = tw.input`mt-6 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`
const Textarea = styled(Input).attrs({as: "textarea"})` ${tw`h-24`}`

const PartnersLogoStrip = styled.div`
  ${tw`mt-12 lg:mt-20`}
  p {
    ${tw`uppercase text-sm lg:text-xs tracking-wider font-bold text-gray-500`}
  }
  img {
    ${tw`mt-4 w-full lg:pr-16 xl:pr-32 opacity-50`}
  }
`;

export default ({ roundedHeaderButton, }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const {auth} = useSelector((state) => ({...state}));
  const getStarted = () => {
    if (email !== "") {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      <Header roundedHeaderButton={roundedHeaderButton} />
      <Container>
        <TwoColumn>
          <LeftColumn>
            <Heading class="bold_text">
              <div><i><span tw="text-blue-500">Stake</span>  <span tw="text-orange-300">tokens.</span></i> <br></br>          
              <i><span class="tab" tw="text-blue-500">Earn</span> <span tw="text-orange-300">flexible yields.</span></i></div>
            </Heading>
            <Paragraph>
            Deposit your stablecoin into high-yield pools giving loans to real, verified businesses.
            </Paragraph>
            {auth === null && (<Actions>
              <input required type="text" placeholder="Your E-mail Address" value={email} onChange={e => setEmail(e.target.value)}/>
              <SubmitButton type="submit" onClick={() => {getStarted() ? window.location.href = "/signup" : toast.error("Enter a valid email")}}>Get Started</SubmitButton>

            </Actions>)}
    
            <PartnersLogoStrip>
            </PartnersLogoStrip>
          </LeftColumn>
          <RightColumn>
            <IllustrationContainer>
              <img tw="min-w-0 w-full max-w-lg xl:max-w-lg" src={"https://saltlending.com/wp-content/uploads/2022/05/Crypto-Backed-Loan.svg"} alt="Design Illustration" />
            </IllustrationContainer>
          </RightColumn>
        </TwoColumn>
        <DecoratorBlob1 />
      </Container>
    </>
  );
};
