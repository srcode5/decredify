import React, {useState} from "react";
import tw from "twin.macro";
import styled from "styled-components";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css'
import {useSelector} from "react-redux";
import { createBuyerProfile, createSellerProfile, getTypeUser, createSellerProfileAlreadyBuyer } from "actions/auth.js";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { ReactComponent as SvgDecoratorBlob1 } from "images/svg-decorator-blob-6.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "images/svg-decorator-blob-7.svg";
import { ReactComponent as SignUpIcon } from "feather-icons/dist/icons/user-plus.svg";
import Footer from "components/footers/FiveColumnWithBackground.js";
import AnimationRevealPage from "../helpers/AnimationRevealPage.js";
import Header from "../components/headers/light.js";
import FormUserDetails from "./FormUserDetails.js";
import FormPersonalDetails from "./FormPersonalDetails.js";
import Confirm from "./Confirm.js";
import Success from "./Success.js";
import {Select} from "antd";
import { toast } from "react-toastify";
const { Option } = Select;
const HeaderContainer = tw.div`w-full flex flex-col items-center`;
const Subheading = tw(SubheadingBase)`mb-4`;
const Heading = tw(SectionHeading)`w-full`;
const Description = tw(SectionDescription)`w-full text-center`;
const FormContainer = tw.div`w-full flex-1 mt-8`;
const PlanDurationSwitcher = tw.div`block w-full max-w-xs sm:inline-block sm:w-auto border-2 rounded-full px-1 py-1 mt-8`;
const SwitchButton = styled.button`
  ${tw`w-1/2 sm:w-32 px-4 sm:px-8 py-3 rounded-full focus:outline-none text-sm font-bold text-gray-700 transition duration-300`}
  ${props => props.active && tw`bg-blue-500 text-gray-100`}
`;
const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const PhoneInput1 = tw(PhoneInput)`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const PlansContainer = tw.div`flex justify-center flex-col md:flex-row items-center md:items-start relative`;
const Plan = styled.div`
  ${tw`w-full max-w-72 mt-16 md:mr-12 md:last:mr-0 text-center px-8 rounded-lg relative text-gray-900 bg-white flex flex-col shadow-raised`}

  ${props =>
    props.featured &&
    css`
      ${tw`border-2 border-gray-200 shadow-none`}
    `}
`;

const PlanHeader = styled.div`
  ${tw`flex flex-col leading-relaxed py-8 -mx-8 bg-gray-100 rounded-t-lg`}
  .name {
    ${tw`font-bold text-xl`}
  }
  .price {
    ${tw`font-bold text-4xl sm:text-5xl my-1`}
  }
  .slash {
    ${tw`text-xl text-gray-500`}
  }
  .duration {
    ${tw`lowercase text-gray-500 font-medium tracking-widest`}
  }
  .mainFeature {
    ${tw`text-gray-500 text-sm font-medium tracking-wide`}
  }
`;
const PlanFeatures = styled.div`
  ${tw`flex flex-col -mx-8 px-8 py-8 flex-1 text-sm`}
  .feature {
    ${tw`mt-5 first:mt-0 font-semibold text-gray-500`}
  }
`;

const PlanAction = tw.div`px-4 pb-8`;
const BuyNowButton = styled(PrimaryButtonBase)`
  ${tw`rounded-full tracking-wider py-4 w-full text-sm hover:shadow-xl transform hocus:translate-x-px hocus:-translate-y-px focus:shadow-outline`}
`;

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-64 w-64 opacity-25 transform -translate-x-2/3 -translate-y-1/2`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-64 w-64 opacity-25 transform translate-x-2/3 translate-y-1/2 fill-current text-teal-300`}
`;

/**
 * Purpose: Enable different kinds of profiles to be created for different kinds of users. One profile for buyers (customers) and 
 * another profile for sellers (restaurants). This will help us separate the kinds of data that need to be collected and stored
 * for both customers and restaurants. This webpage is still a Work in Progress, and is not in the scope of the FRD.
 */
export default ({submitButtonText = "Create Profile",
SubmitButtonIcon = SignUpIcon,
  subheading = "FIRST THINGS FIRST",
  heading = "Let's Create Your Profile.",
  description = "",
  forms = null,
  primaryButtonText = "Buy Now",
  planDurations = [
    {
      text: "Month",
      switcherText: "Buyer",
    },
    {
      text: "Year",
      switcherText: "Seller",
    }
  ]
}, roundedHeaderButton=true) => {

  const [buyerStep, setBuyerStep] = useState(0);
  const [sellerStep, setSellerStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("United States");
  const [address, setAddress] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [storefrontName, setStorefrontName] = useState("");
  const [SSN, setSSN] = useState("");
  const [EIN, setEIN] = useState("");
  const [radio, setRadio] = useState("Individual Seller");
  const [city, setCity] = useState("");
  const [legalBusinessName, setLegalBusinessName] = useState("");
  const [userType, setUserType] = useState("");
  const [sellerPlan, setSellerPlan] = useState("");
  const [buyerPlan, setBuyerPlan] = useState("");
  const defaultForms = [
    ,
    {
      name: "Pro Plan",
      durationPrices: ["$49", "$499"],
      mainFeature: "Suited for High-Growth Restaurants",
      featured: true
    }
  ];
  if (!forms) forms = defaultForms;
  const {auth} = useSelector((state) => ({...state}));
  const {token}  = auth;
  const [activeDurationIndex, setActiveDurationIndex] = useState(0);
  // Proceed to next step
  const handleSubmitBuyer = async (e) => {
    e.preventDefault();
    if (!state) {
      toast.error("State / Territory field required");
      return;
    } else {
      console.table({firstName, lastName, phoneNumber, address, state, zip, country})
        try {
          const res = await createBuyerProfile(token, {
            firstName: firstName,
            middleInitial: middleInitial,
            lastName: lastName,
            phoneNumber: phoneNumber,
            address: address,
            city: city,
            state: state,
            zipCode: zip,
            country: country,
          });
          toast.success("Buyer profile creation success!");
          window.location.href = "/request"; 
        } catch (err) {
          toast.error("Error creating profile. Try again.");
        }
      }   
    }
  const handleSubmitSellerAlreadyBuyer = async (e) => {
    e.preventDefault();
    try {
      const res = await createSellerProfileAlreadyBuyer(token, {
        sellerType: radio,
        SSN: SSN,
        EIN: EIN,
        storefrontName: storefrontName,
        legalBusinessName: legalBusinessName
      });
      toast.success("Buyer profile updated to seller profile!");
      window.location.href = "/sell";
    } catch (err) {
      toast.error("Error creating seller profile");
    }
  }
  const handleSubmitSeller = async (e) => {
    e.preventDefault();
    if (!state) {
      toast.error("State / Territory field required");
      return;
    } else {
    try {
      const res = await createSellerProfile(token, {
        firstName: firstName,
        middleInitial: middleInitial,
        lastName: lastName,
        phoneNumber: phoneNumber,
        address: address,
        city: city,
        state: state,
        zipCode: zip,
        country: country,
        storefrontName: storefrontName,
        legalBusinessName: legalBusinessName,
        SSN: SSN,
        EIN: EIN,
        sellerType: radio,
      });
      toast.success("Seller profile created!");
      window.location.href = "/sell";
    } catch (err) {
      toast.error("Error creating profile. Try again.");
    }
  }
  }

  const getUserType = async () => {
    try {
      let res = await getTypeUser(token, {});
      if (res.data.type === "buyer") {
        setUserType("buyer");
        setActiveDurationIndex(1);
      } else if (res.data.type === "seller") {
        setUserType("seller");
      } else if (res.data.type === "") {
        setUserType("");
      }
      console.log(res);
    } catch (err) {
      toast.error("Error getting user type");
    }
  }

  getUserType();
  return (
    <AnimationRevealPage>
      <Header roundedHeaderButton={roundedHeaderButton} />
      <Container>
        <ContentWithPaddingXl>
        <HeaderContainer>
          {userType === "" && subheading && <Subheading>{subheading}</Subheading>}
          {userType === "buyer" && subheading && <Subheading>You're Already a Buyer</Subheading>}
          {userType === "seller" && subheading && <Subheading>You're Already a Buyer and Seller.</Subheading>}
          {userType === "" && <Heading>{heading}</Heading>}
          {userType === "buyer" && <Heading>Become a Seller.</Heading>}
          {userType === "seller" && <Heading>Upgrade Your Seller Account for Extra Perks.</Heading>}
        {userType !== "seller" &&<PlanDurationSwitcher>
          {planDurations.map((planDuration, index) => (
            <SwitchButton active={activeDurationIndex === index} key={index} onClick={() => setActiveDurationIndex(index)}>{planDuration.switcherText}</SwitchButton>
          ))}
        </PlanDurationSwitcher>}
        </HeaderContainer>
        {activeDurationIndex === 0 && (userType === "" && userType !== "seller") && <FormContainer><Form>
                <Input required placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                <Input placeholder="Middle Initial (Optional)" value={middleInitial} onChange={e => setMiddleInitial(e.target.value)}/>
                <Input required placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)}/>
                <PhoneInput1
                  placeholder="Enter phone number"
                  defaultCountry="US"
                  value={phoneNumber}
                  onChange={setPhoneNumber}/>
                <Input required placeholder="Address" value={address} onChange={e => setAddress(e.target.value)}/>
                <Input required placeholder="City" value={city} onChange={e => setCity(e.target.value)}/>
                <br></br><br></br>
                <Select
                  placeholder="Select State / Territory"
                  onChange={(value) => setState(value)}
                  value={state?state:undefined}
                  className="w-400 m-2"
                  size="large"
                  required
                >
                	<Option value="AL">Alabama</Option>
	<Option value="AK">Alaska</Option>
	<Option value="AZ">Arizona</Option>
	<Option value="AR">Arkansas</Option>
	<Option value="CA">California</Option>
	<Option value="CO">Colorado</Option>
	<Option value="CT">Connecticut</Option>
	<Option value="DE">Delaware</Option>
	<Option value="DC">District Of Columbia</Option>
	<Option value="FL">Florida</Option>
	<Option value="GA">Georgia</Option>
	<Option value="HI">Hawaii</Option>
	<Option value="ID">Idaho</Option>
	<Option value="IL">Illinois</Option>
	<Option value="IN">Indiana</Option>
	<Option value="IA">Iowa</Option>
	<Option value="KS">Kansas</Option>
	<Option value="KY">Kentucky</Option>
	<Option value="LA">Louisiana</Option>
	<Option value="ME">Maine</Option>
	<Option value="MD">Maryland</Option>
	<Option value="MA">Massachusetts</Option>
	<Option value="MI">Michigan</Option>
	<Option value="MN">Minnesota</Option>
	<Option value="MS">Mississippi</Option>
	<Option value="MO">Missouri</Option>
	<Option value="MT">Montana</Option>
	<Option value="NE">Nebraska</Option>
	<Option value="NV">Nevada</Option>
	<Option value="NH">New Hampshire</Option>
	<Option value="NJ">New Jersey</Option>
	<Option value="NM">New Mexico</Option>
	<Option value="NY">New York</Option>
	<Option value="NC">North Carolina</Option>
	<Option value="ND">North Dakota</Option>
	<Option value="OH">Ohio</Option>
	<Option value="OK">Oklahoma</Option>
	<Option value="OR">Oregon</Option>
	<Option value="PA">Pennsylvania</Option>
	<Option value="RI">Rhode Island</Option>
	<Option value="SC">South Carolina</Option>
	<Option value="SD">South Dakota</Option>
	<Option value="TN">Tennessee</Option>
	<Option value="TX">Texas</Option>
	<Option value="UT">Utah</Option>
	<Option value="VT">Vermont</Option>
	<Option value="VA">Virginia</Option>
	<Option value="WA">Washington</Option>
	<Option value="WV">West Virginia</Option>
	<Option value="WI">Wisconsin</Option>
	<Option value="WY">Wyoming</Option> 
  <Option value="AS">American Samoa</Option>
<Option value="GU">Guam</Option>
<Option value="MP">Northern Mariana Islands</Option>
<Option value="PR">Puerto Rico</Option>
<Option value="UM">United States Minor Outlying Islands</Option>
<Option value="VI">Virgin Islands</Option> 
<Option value="AA">Armed Forces Americas</Option>
<Option value="AP">Armed Forces Pacific</Option>
<Option value="AE">Armed Forces Others</Option>		                   
                      
                </Select>
                <Input required placeholder="Zip Code" value={zip} onChange={e => setZip(e.target.value)}/>
                <Input required placeholder="Country" value={country} onChange={e => setCountry("United States")}/>
                
                
                <SubmitButton type="submit" onClick={handleSubmitBuyer}>
                  <span className="text">{submitButtonText}</span>
                </SubmitButton>
              </Form> </FormContainer>}
           {activeDurationIndex === 1 && userType === "" && <FormContainer><Form>
            <Input required placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)}/>
            <Input required placeholder="Middle Initial (Optional)" value={middleInitial} onChange={e => setMiddleInitial(e.target.value)}/>
            <Input required placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)}/>
            <br></br><br></br>
            <input type="radio" value="Individual Seller" checked={radio === "Individual Seller"} onChange={(e) => {setRadio(e.target.value)}}/>
            <label>       Individual Seller</label><br></br>
            <input type="radio" value="Corporate Seller" checked={radio === "Corporate Seller"} onChange={(e) => {setRadio(e.target.value)}}/>
            <label>       Corporate Seller</label><br></br>
            <Input required hidden={radio !== "Corporate Seller"} placeholder="Legal Business Name" value={legalBusinessName} onChange={e => setLegalBusinessName(e.target.value)}/>
            <Input required hidden={radio !== "Individual Seller"} placeholder="Storefront Name" value={storefrontName} onChange={e => setStorefrontName(e.target.value)}/>
            <PhoneInput1
                  placeholder="Enter phone number"
                  defaultCountry="US"
                  value={phoneNumber}
                  onChange={setPhoneNumber}/>
            <Input required placeholder="Address" value={address} onChange={e => setAddress(e.target.value)}/>
            <Input required placeholder="City" value={city} onChange={e => setCity(e.target.value)}/>
            <br></br><br></br>
            <Select
                  placeholder="Select State / Territory"
                  onChange={(value) => setState(value)}
                  value={state?state:undefined}
                  className="w-400 m-2"
                  size="large"
                  required
                >
                	<Option value="AL">Alabama</Option>
	<Option value="AK">Alaska</Option>
	<Option value="AZ">Arizona</Option>
	<Option value="AR">Arkansas</Option>
	<Option value="CA">California</Option>
	<Option value="CO">Colorado</Option>
	<Option value="CT">Connecticut</Option>
	<Option value="DE">Delaware</Option>
	<Option value="DC">District Of Columbia</Option>
	<Option value="FL">Florida</Option>
	<Option value="GA">Georgia</Option>
	<Option value="HI">Hawaii</Option>
	<Option value="ID">Idaho</Option>
	<Option value="IL">Illinois</Option>
	<Option value="IN">Indiana</Option>
	<Option value="IA">Iowa</Option>
	<Option value="KS">Kansas</Option>
	<Option value="KY">Kentucky</Option>
	<Option value="LA">Louisiana</Option>
	<Option value="ME">Maine</Option>
	<Option value="MD">Maryland</Option>
	<Option value="MA">Massachusetts</Option>
	<Option value="MI">Michigan</Option>
	<Option value="MN">Minnesota</Option>
	<Option value="MS">Mississippi</Option>
	<Option value="MO">Missouri</Option>
	<Option value="MT">Montana</Option>
	<Option value="NE">Nebraska</Option>
	<Option value="NV">Nevada</Option>
	<Option value="NH">New Hampshire</Option>
	<Option value="NJ">New Jersey</Option>
	<Option value="NM">New Mexico</Option>
	<Option value="NY">New York</Option>
	<Option value="NC">North Carolina</Option>
	<Option value="ND">North Dakota</Option>
	<Option value="OH">Ohio</Option>
	<Option value="OK">Oklahoma</Option>
	<Option value="OR">Oregon</Option>
	<Option value="PA">Pennsylvania</Option>
	<Option value="RI">Rhode Island</Option>
	<Option value="SC">South Carolina</Option>
	<Option value="SD">South Dakota</Option>
	<Option value="TN">Tennessee</Option>
	<Option value="TX">Texas</Option>
	<Option value="UT">Utah</Option>
	<Option value="VT">Vermont</Option>
	<Option value="VA">Virginia</Option>
	<Option value="WA">Washington</Option>
	<Option value="WV">West Virginia</Option>
	<Option value="WI">Wisconsin</Option>
	<Option value="WY">Wyoming</Option> 
  <Option value="AS">American Samoa</Option>
<Option value="GU">Guam</Option>
<Option value="MP">Northern Mariana Islands</Option>
<Option value="PR">Puerto Rico</Option>
<Option value="UM">United States Minor Outlying Islands</Option>
<Option value="VI">Virgin Islands</Option> 
<Option value="AA">Armed Forces Americas</Option>
<Option value="AP">Armed Forces Pacific</Option>
<Option value="AE">Armed Forces Others</Option>		                   
                      
                </Select>
            <Input required placeholder="Zip Code" value={zip} onChange={e => setZip(e.target.value)}/>
            <Input required placeholder="Country" value={country} onChange={e => setCountry(e.target.value)}/>
            
            <Input required hidden={radio === "Corporate Seller"} type="password" placeholder="SSN (nine digits)" pattern="/(^\d{9})/" value={SSN} onChange={e => setSSN(e.target.value)}/>
            <Input required hidden={radio === "Individual Seller"} type="password" placeholder="EIN (nine digits)" pattern="/(^\d{9})/" value={EIN} onChange={e => setEIN(e.target.value)}/>
            <SubmitButton type="submit" onClick={handleSubmitSeller}>
              <span className="text">{submitButtonText}</span>
            </SubmitButton>
          </Form> </FormContainer>}

          {activeDurationIndex === 1 && userType === "buyer" && <FormContainer><Form>
          <br></br><br></br>
            <input type="radio" value="Individual Seller" checked={radio === "Individual Seller"} onChange={(e) => {setRadio(e.target.value)}}/>
            <label>       Individual Seller</label><br></br>
            <input type="radio" value="Corporate Seller" checked={radio === "Corporate Seller"} onChange={(e) => {setRadio(e.target.value)}}/>
            <label>       Corporate Seller</label><br></br>
            <Input required hidden={radio !== "Corporate Seller"} placeholder="Legal Business Name" value={legalBusinessName} onChange={e => setLegalBusinessName(e.target.value)}/>
            <Input required hidden={radio !== "Individual Seller"} placeholder="Storefront Name" value={storefrontName} onChange={e => setStorefrontName(e.target.value)}/>
            <Input required hidden={radio === "Corporate Seller"} type="password" placeholder="SSN (nine digits)" pattern="/(^\d{9})/" value={SSN} onChange={e => setSSN(e.target.value)}/>
            <Input required hidden={radio === "Individual Seller"} type="password" placeholder="EIN (nine digits)" pattern="/(^\d{9})/" value={EIN} onChange={e => setEIN(e.target.value)}/>
            <SubmitButton type="submit" onClick={handleSubmitSellerAlreadyBuyer}>
              <span className="text">Create Seller Profile</span>
            </SubmitButton>
            </Form></FormContainer>}
        
        </ContentWithPaddingXl>
      </Container>
      <Footer />
      </AnimationRevealPage>
  );
};
