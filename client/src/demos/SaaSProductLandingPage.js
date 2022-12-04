import React from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Hero from "components/hero/TwoColumnWithInput.js";
import Features from "components/features/ThreeColWithSideImage.js";
import MainFeature from "components/features/TwoColWithButton.js";
import MainFeature2 from "components/features/TwoColWithTwoHorizontalFeaturesAndButton.js";
import FeatureWithSteps from "components/features/TwoColWithSteps.js";
import Pricing from "components/pricing/ThreePlans.js";
import Testimonial from "components/testimonials/TwoColumnWithImageAndRating.js";
import FAQ from "components/faqs/SingleCol.js";
import GetStarted from "components/cta/GetStarted";
import Footer from "components/footers/FiveColumnWithBackground.js";

import prototypeIllustrationImageSrc from "images/prototype-illustration.svg";
import { ReactComponent as BriefcaseIcon } from "feather-icons/dist/icons/briefcase.svg";
import { ReactComponent as MoneyIcon } from "feather-icons/dist/icons/dollar-sign.svg";
/**
 * Homepage that enables the user to see information about the Decredify platform, whether it be how it works for customers, restaurants,
 * or frequently asked questions. Styled with TailwindCSS and ReactJS.
 */
export default () => {
  const Subheading = tw.span`uppercase tracking-widest font-bold text-blue-500`;
  const HighlightedText = tw.span`text-blue-500`;

  return (
    <AnimationRevealPage>
      <Hero roundedHeaderButton={true} />
      <Features
        subheading={<Subheading>How it Works</Subheading>}
        heading={
          <>
            Like a <HighlightedText>decentralized Snackpass.</HighlightedText>
          </>
        }
      />
      <MainFeature
        subheading={<Subheading>Customers</Subheading>}
        imageDecoratorBlob={true}
      />
      <FeatureWithSteps
        subheading={<Subheading>Restaurants</Subheading>}
        heading={
          <>
            Find potential <HighlightedText>new customers.</HighlightedText>
          </>
        }
        textOnLeft={false}
        imageDecoratorBlob={true}
        decoratorBlobCss={tw`xl:w-40 xl:h-40 opacity-15 -translate-x-1/2 left-1/2`}
      />
      
      <FAQ id="test"
        subheading={<Subheading >FAQS</Subheading>}
        heading={
          <>
            You have <HighlightedText>Questions ?</HighlightedText>
          </>
        }
        faqs={[
          {
            question: "I want to exchange my rewards with someone else's. Can I do that?",
            answer:
              "Decredify allows customers to freely exchange liquid token rewards with other customers."
          },
          {
            question: "How do restaurants benefit?",
            answer:
              "Restaurants on our platform can improve customer acquisition by allowing already-loyal customers to swap their rewards with someone who has never tried the restaurant before."
          },
          {
            question: "Can I cash-in my rewards?",
            answer:
              "No, cash-in isn't supported by Decredify at this time."
          },
          {
            question: "Can I pool my rewards with friends for group orders?",
            answer:
              "Sure! We will be launching reward pooling functionality on June 1st, 2022."
          },
          {
            question: "What is Web3?",
            answer:
              "Web3 is an idea for a new version of the World Wide Web based on blockchain technology, which increases community engagement and decentralization using token-based economics."
          },
        ]}
      />
      <GetStarted/>
      <Footer />
    </AnimationRevealPage>
  );
}
