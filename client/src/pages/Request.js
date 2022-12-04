import React, { useState, useEffect } from "react";
import Header from "../components/headers/light.js";
import Footer from "components/footers/FiveColumnWithBackground.js";
import AnimationRevealPage from "../helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import { motion } from "framer-motion";
import { css } from "styled-components/macro";
import styled from "styled-components";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { useSelector } from "react-redux";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading } from "components/misc/Headings.js";
import { ReactComponent as StarIcon } from "images/star-icon.svg";
import { ReactComponent as SvgDecoratorBlob1 } from "images/svg-decorator-blob-5.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "images/svg-decorator-blob-7.svg";
import {loadPools, findNumOffersForGivenRequestId} from "../actions/request.js";
import {toast} from "react-toastify";
import SearchField from "react-search-field";
import addNotification from 'react-push-notification';
import { BsFillQuestionDiamondFill } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row`;
const TabsControl = tw.div`flex flex-wrap bg-pink-200 px-2 py-2 rounded leading-none mt-12 xl:mt-0`;


const contentStyle = { background: '#e91d63' };
const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
const arrowStyle = { color: '#000' }; // style for an svg element


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
const CardContainer = tw.div` mt-4 mb-2 sm:w-full md:w-full lg:w-full sm:pr-10 md:pr-6 lg:pr-12`;
const Card = tw(motion.a)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;
const CardImageContainer = styled.div`
  ${props => css`background-image: url(${props.imageSrc});`}
  ${tw`h-56 xl:h-64 bg-center bg-cover relative rounded-t`}
`;
const CardRatingContainer = tw.div`leading-none absolute inline-flex bg-orange-300 top-0 left-0 ml-2 mt-1 rounded-full px-3 py-1 items-end`;
const CardQuality = styled.div`
  ${tw`mr-1 text-sm font-bold flex items-end text-black`}
  svg {
    ${tw`w-4 h-4 fill-current text-orange-400 mr-1`}
  }
`;

const CardHoverOverlay = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.5);
  ${tw`absolute inset-0 flex justify-center items-center`}
`;
const CardButton = tw(PrimaryButtonBase)`text-sm ml-1 mr-1`;

const CardReview = tw.div`font-medium text-xs text-gray-600`;

const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-primary-500`;
const CardContent = tw.p`mt-1 text-sm font-medium text-gray-600`;
const CardPrice = tw.p`mt-4 text-xl font-bold`;

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-64 w-64 opacity-15 transform translate-x-2/3 -translate-y-12 text-pink-400`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-80 w-80 opacity-15 transform -translate-x-2/3 text-primary-500`}
`;

const SubmitButton = tw(PrimaryButtonBase)`inline-block`


export default ({ roundedHeaderButton=true, }) => {
  const numFor = Intl.NumberFormat('en-us');
  const [preview, setPreview] = useState(
    null
  );
  const [search, setSearch] = useState("");
  const [tabs, setTabs] = useState([]);
  //const {auth} = useSelector((state) => ({...state}));
  // const {token} = auth;
  const updateRequests = async () => {
    try {
      console.log("Execute loadPools")
      const res = await loadPools ({});
      var imgs = ["https://img.freepik.com/free-photo/abstract-flowing-neon-wave-background_53876-101942.jpg?w=2000", "https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg","https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?w=2000"];
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].img = imgs[i];
      }
      setTabs(res.data);
      console.log(res.data);
    } catch (err) {

        toast.error(err.response.data);
      
    }
  }
  useEffect(updateRequests, []);


    return (
      <>
        <AnimationRevealPage>
            <Header roundedHeaderButton={roundedHeaderButton} />
            <Container>
      <ContentWithPaddingXl>
        <HeaderRow>
          <Heading>Available Pools with Flexible Yields</Heading>
          <input
              type="text"
              placeholder=" 🔎    Search"
              onChange={(event) => {
                setSearch(event.target.value)
              }}
              style={{"margin-top": 20, "width":300,"height":40,"font-size":20,"padding-left":10}}
            />
          

        </HeaderRow>
            {tabs.filter((card) => {
              if (search === "") {
                return (card);
              } else if (card.name.toLowerCase().includes(search.toLowerCase())) {
                return (card)
              }
            }).map((card) => (
              <>
              <CardContainer>
                <Card className="group" href={card.img} initial="rest" whileHover="hover" animate="rest">
                  <CardImageContainer imageSrc={card.img}>
                    <CardHoverOverlay
                      variants={{
                        hover: {
                          opacity: 1,
                          height: "auto"
                        },
                        rest: {
                          opacity: 0,
                          height: 0
                        }
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      
                      <CardButton onClick={() => {window.location.href = `/pool/view/${card._id}`}} disabled>View Details</CardButton>
                      
                    </CardHoverOverlay>
                  </CardImageContainer>
                  <CardText>
                    <CardTitle>{card.name}</CardTitle>
                    {card.name != "Mezzanine Tranche" && <CardContent>{"APY: " + (numFor.format((card.usdcYield + card.dcfyYield).toFixed(2))).toString() + "%"}</CardContent>}
                    {card.name == "Mezzanine Tranche" && <CardContent>{"APY: flexible between 14.3% and 18.5%"}</CardContent>}
                    <CardContent>{"Balance: $" + numFor.format((card.balance.toFixed()).toString(2))}</CardContent>
                    <CardContent>{"Loans Outstanding: $" + numFor.format((card.loansOutstanding.toFixed(2)).toString())}</CardContent>
                    
                  </CardText>
                </Card>
                </CardContainer>
                </> 
              
            ))}
      
      </ContentWithPaddingXl>
      <DecoratorBlob1 />
      <DecoratorBlob2 />
    </Container>
            <Footer />
        </AnimationRevealPage>
      </>
    );
  };