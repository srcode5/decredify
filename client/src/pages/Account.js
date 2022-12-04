import React, { useState, useEffect } from "react";
import {useSelector} from "react-redux";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import {Tabs, Tab} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, ContentWithPaddingXl } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithBackground.js";
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { toast } from "react-toastify";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
const TwoColumn = tw.div``;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const HeadingRow = tw.div`flex`;
const Subheading = tw(SubheadingBase)`mb-4`;
const Heading = tw(SectionHeading)`text-gray-900 mb-10`;
const Text = styled.div`
  ${tw`text-lg  text-gray-800`}
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

const Form = tw.form`mt-8 md:mt-10 text-sm flex flex-col max-w-sm mx-auto md:mx-0`
const Input = tw.input`mt-6 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`

const Textarea = styled(Input).attrs({as: "textarea"})`
  ${tw`h-24`}`
const SubmitButton = tw(PrimaryButtonBase)`inline-block mt-8`

/**
 * Purpose: Work in progress account page that displays all kinds of metadata for restaurants and customers using our platform 
 * (will be linked as a button on the /signup page)
 * Not in the scope of the FRD
 */
export default ({ headingText = "Terms And Conditions" }) => {
  const {auth} = useSelector((state) => ({...state}));
  const {token}  = auth;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [userType, setUserType] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [sellerPlan, setSellerPlan] = useState("");
  const [storefrontName, setStorefrontName] = useState("");
  const [legalBusinessName, setLegalBusinessName] = useState("");

  const getUserDetails = async () => {
      try {
        let res = await getUser(token, {});
        console.log(res.data);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setMiddleInitial(res.data.middleInitial);
        setCountry(res.data.country);
        setState(res.data.state);
        setCity(res.data.city);
        setAddress(res.data.address);
        setZipCode(res.data.zipCode);
        setUserType(res.data.userType);
        setSellerType(res.data.sellerType);
        setSellerPlan(res.data.sellerPlan);
        setStorefrontName(res.data.storefrontName);
        setLegalBusinessName(res.data.legalBusinessName);
      } catch (err) {
          
      }
  }

  useEffect(getUserDetails, []);
  const handleBuyerProfile = async (e) => {
      e.preventDefault();
      window.location.href = "/buyer-profile";
  }
  return (
    <AnimationRevealPage>
      <Header />
      <Container>
        <ContentWithPaddingXl>
        <Subheading>BUYER PROFILE</Subheading>
          <HeadingRow>
          
            <Heading>Welcome, {firstName}!</Heading>
          </HeadingRow>
          <Tabs defaultActiveKey="Buyer Profile" id="uncontrolled-tab-example" className="mb-3">
  <Tab eventKey="Buyer Profile" title="Buyer Profile">
  <SubmitButton onClick={handleBuyerProfile}>Buyer Profile ==> </SubmitButton>
  </Tab>
  <Tab eventKey="Seller Profile" title="Seller Profile" disabled={userType === "buyer"}>
  <Subheading>{sellerPlan.toUpperCase()} TIER SELLER</Subheading>
  <SubmitButton onClick={() => window.location.href = "/seller-profile"}>Seller Profile ==> </SubmitButton>
  <br></br>
  {sellerPlan !== "Enterprise" ? <SubmitButton onClick={() => window.location.href = "/upgrade-seller-plan"}>Upgrade Seller Plan ==></SubmitButton> : <></>}
  </Tab>
</Tabs>
          
        </ContentWithPaddingXl>
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
};
