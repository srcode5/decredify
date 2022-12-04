import React, {useState} from 'react';
import {useSelector} from "react-redux";
import Header from "../components/headers/light.js";
import Footer from "components/footers/FiveColumnWithBackground.js";
import AnimationRevealPage from "../helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components";
import EmailIllustrationSrc from "images/email-illustration.svg";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import {RainbowDatePicker} from "components/misc/DatePicker.js";
import { DatePicker } from "react-rainbow-components";
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import CurrencyInput from 'react-currency-input-field';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { styled as styled1} from '@stitches/react';
import Dropdown from 'components/misc/Dropdown';
import { formatValue } from 'react-currency-input-field';
import { makeTokenRequest } from "actions/request";
import {toast} from "react-toastify";
import {Select} from "antd";
import addNotification from 'react-push-notification';
import { BsFillQuestionDiamondFill } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const { Option } = Select;

const contentStyle = { background: '#e91d63' };
const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
const arrowStyle = { color: '#000' }; // style for an svg element

const StyledContent = styled1(DropdownMenu.Content, {
  minWidth: 130,
  backgroundColor: 'white',
  borderRadius: 6,
  padding: 5,
  boxShadow: '0px 5px 15px -5px hsla(206,22%,7%,.15)',
});

const StyledItem = styled1(DropdownMenu.Item, {
  fontSize: 13,
  padding: '5px 10px',
  borderRadius: 3,
  cursor: 'default',

  '&:focus': {
    outline: 'none',
    backgroundColor: 'dodgerblue',
    color: 'white',
  },
});

const StyledArrow = styled1(DropdownMenu.Arrow, {
  fill: 'white',
});

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


const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto`;
const TextColumn = styled(Column)(props => [
  tw`md:w-7/12 mt-16 md:mt-0`,
  props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);

const Image = styled.div(props => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-contain bg-no-repeat bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(SectionHeading)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`

const Form = tw.form`mt-8 md:mt-10 text-sm flex flex-col max-w-sm mx-auto md:mx-0`
const Input = tw.input`mt-6 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`

const Textarea = styled(Input).attrs({as: "textarea"})`
  ${tw`h-24`}`

const SubmitButton = tw(PrimaryButtonBase)`inline-block mt-8`

/**
 * Purpose: Enable users to request an ERC-20 token to be deployed for their restaurants, and store the token deployment request in a collection called 
 * "tokens" on MongoDB. The Decredify team, after thorough off-chain verification and KYC, will then approve the token to be issued 
 * upon every purchase through our platform for the restaurant.
 */

export default ({ subheading = <span tw="text-blue-500">FOR RESTAURANTS ONLY</span>,
heading = <>Deploy <span tw="text-blue-500">a new ERC-20 Token.</span><wbr/></>,
submitButtonText = "Deploy Token",
formAction = "#",
formMethod = "get",
textOnLeft = true, roundedHeaderButton=true, }) => {
  const {auth} = useSelector((state) => ({...state}));
  const {token}  = auth;
  const [ownerWallet, setOwnerWallet] = useState(window.localStorage.getItem("walletAddress"));
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenRequest, setTokenRequest] = useState(window.localStorage.getItem("tokenRequest"));
  const [preview, setPreview] = useState(
    null
  );

  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
 
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(ownerWallet, tokenName, tokenSymbol);
    try {
      const res = await makeTokenRequest ({"ownerWalletAddress": ownerWallet, "name": tokenName, "symbol": tokenSymbol});
      toast.success("Token Deployment Request Made!")
      window.localStorage.setItem("tokenRequest", true);
      window.location.reload();
    }
    catch (err) {
      toast.error(err.response.data);
    }
   
    }
    return (
      <>
        <AnimationRevealPage>
            <Header roundedHeaderButton={roundedHeaderButton} />
            
            <Container>
                <TwoColumn>
                    <ImageColumn>
                    <Image imageSrc={EmailIllustrationSrc} />
                    </ImageColumn>
                    <TextColumn textOnLeft={textOnLeft}>
                    <TextContent>
                      
                        {subheading && <Subheading>{subheading}</Subheading>}
                        <Heading>{heading}</Heading>{tokenRequest ? (<p><b>Your token application is pending.</b></p>) :
                        (<Form action={formAction} method={formMethod} onSubmit={handleSubmit}>

                        

                        <p>Owner Wallet Address</p>
                        <Input required type="text" name="subject" placeholder="Owner Wallet Address" value={ownerWallet} ></Input><br></br><br></br>
                        <Input required type="text" name="subject" placeholder="Custom Token Name" value={tokenName} onChange={e => setTokenName(e.target.value)}></Input><br></br><br></br>
                        <Input required type="text" name="subject" placeholder="Custom Token Symbol" value={tokenSymbol} onChange={e => setTokenSymbol(e.target.value)}></Input><br></br><br></br>
                        
                        
                        <SubmitButton type="submit">{submitButtonText}</SubmitButton>
                        
                        </Form>)}

                    </TextContent>
                    </TextColumn>
                </TwoColumn>
            </Container>
            <Footer />
        </AnimationRevealPage>
      </>
    );
  };
  


