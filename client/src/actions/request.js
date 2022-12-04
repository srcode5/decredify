import axios from "axios";
/** This axios function IS USED in the functionality demo source code submission for the FRD requirement that
 * shows all restaurants to the user and enables the user to search based on keywords for the restaurant.
 */
export const loadPools = async (data) => await axios.post(`${process.env.REACT_APP_API}/load-pools`, data);

export const makeTokenRequest = async (data) => await axios.post(`${process.env.REACT_APP_API}/make-token-request`, data);

