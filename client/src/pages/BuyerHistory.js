import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

import Table from "./Table";
import "./App.css";
import Header from "../components/headers/light.js";
import Footer from "components/footers/FiveColumnWithBackground.js";
import AnimationRevealPage from "../helpers/AnimationRevealPage.js";
import tw from "twin.macro";
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
import { Link } from 'react-router-dom'

const Heading = tw(SectionHeading)``;


const Genres = ({ values }) => {
  return (
    <>
      {values.map((genre, idx) => {
        return (
          <span key={idx} className="badge">
            {genre}
          </span>
        );
      })}
    </>
  );
};




const HeaderRow = tw(motion.div)`flex justify-between items-center flex-col flex flex-wrap xl:flex-row `;

/**
 * Purpose: Uses the multi-purpose Table page to display all kinds of attributes relevant to a customer's payment history.
 */
function BuyerHistory() {

  const columns = useMemo(
    () => [
      {
        Header: "Orders",
        columns: [
          {
            Header: "Restaurant",
            accessor: "order.name",
            
          },
          {
            Header: "Date",
            accessor: "order.date"
          }
        ]
      },
      {
        Header: "Details",
        columns: [
          {
            Header: "Menu Item(s)",
            accessor: "order.menuItem"
          },
          {
            Header: "Total Cost",
            accessor: "order.price",
          },
        ]
      },
      {
        Header: "Tokenomics",
        columns: [
          {
            Header: "Restaurant Spent",
            accessor: "order.restToken",
          },
          {
            Header: "Other Spent",
            accessor: "order.otherToken",
             
          },
          {
            Header: "Rewards Earned",
            accessor: "order.rewards",
          },
        ]
      }
    ],
    []
  );

  const [data, setData] = useState([{}, {"name": "La Burrita", "date": "05/05/2022", "menuItem": "hi", "price": "10", "restToken": "LB", "otherToken": "ETH", "rewards": "2"}]);

  return (
    <AnimationRevealPage>
        <Header/>
    <div className="App">
      <HeaderRow></HeaderRow>
        <Heading>Buyer History</Heading>
      <Table columns={columns} data={data} />
      
    </div>
    </AnimationRevealPage>
  );
}

export default BuyerHistory;

//axios("https://api.tvmaze.com/search/shows?q=snow");