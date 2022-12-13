import AuditRequest from "../models/auditRequest";
import Token from "../models/token";
import fs from "fs";
import Pool from "../models/pool";

/**
 * Loads all restaurants from the MongoDB Restaurant collection that is imported above.
 * This enables the customer to see all restaurants near his or her location.
 */
export const loadPools = async (req, res) => {

  try {
    Pool.find({ tag: "1" }, function (err, docs) {
      if (err) {
        console.log("loading request err => ", err);
        return res.status(400).send("Error loading your pools.");
      }
      console.log(docs);
      res.status(200).json(docs);
    });
  } catch (err) {
    res.status(400).send("Error loading your pools.");    
  }

}

/**
 * Updates the token collection with the latest pending token based on the information passed in.
 */
export const makeTokenRequest = async (req, res) => {
  /*const token  = new Token({ ownerWalletAddress: ownerWalletAddress, name: name, symbol: symbol, status: false});
    token.save(function (err) {
      if (err) return handleError(err);
      // saved!
      res.status(200).json({status: "Success"});
    });*/
}
