import "tailwindcss/dist/base.css";
import "styles/globalStyles.css";
import React from "react";

import SaaSLandingPage from "./demos/SaaSProductLandingPage";

import Signup from "./pages/Signup";
import Request from './pages/Request';
import Send from "./pages/Send";
import Terms from "./pages/TermsOfService";
import DeployToken from "./pages/DeployToken";
import ContactUs from "./pages/ContactUs";
import BuyerHistory from "./pages/BuyerHistory";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {ToastContainer} from "react-toastify";
import Popup from 'react-popup';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function App() {
  // If you want to disable the animation just use the disabled `prop` like below on your page's component
  // return <AnimationRevealPage disabled>xxxxxxxxxx</AnimationRevealPage>;
  /**
   * THIS IS THE APP ARCHITECTURE----------------------------
   * FRONTEND -- REACT
   * BACKEND -- NODE
   * DB -- MONGODB and RINKEBY TESTNET
   * 
   * FUNCTIONALITY-------------------------------------------
   * In the Signup page, we can see and test the connect wallet functionality
   * In the BuyerHistory page, we can see the history of all menu items the current user has bought.
   * In the Request page, we can see the page that customers can use to request food items by searching through restaurants nearby.
   * In the Sell page, we can see the ability for a user to send tokens to another user on the platform.
   * In the DeployToken page, we can see the ability for a user to make a request to deploy an ERC-20 token. This request will be stored in 
   * MongoDB, and upon a thorough off-chain verification process, will result in a deployed ERC-20 token for the restaurant.
   * 
   * For the smart contract functionality in the FRD, see the ERC20.sol smart contract under the ./contracts folder.
   */
  return (
    <Router>
      <Popup />
      <ToastContainer position="top-center"/>
      <Switch>
        <Route exact path="/">
          <SaaSLandingPage />
        </Route>
        <Route exact path="/signup" component={Signup}></Route>
        <Route exact path="/buyer-history" component={BuyerHistory}></Route>
        <Route exact path="/earn" component={Request}></Route>
        <Route exact path="/borrow" component={Send}></Route>
        <Route exact path="/deploy-token" component={DeployToken}></Route>
        
      </Switch>
    </Router>
  );
}