/** This request function was created to make a request to the contact us controller function in the backend, but
 * for now the function is not being used in the functionality demo for the source code submission.
 */
import axios from 'axios';

export const contact = async (contactFields) => await axios.post(`${process.env.REACT_APP_API}/contact`, contactFields);