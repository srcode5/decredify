/** ALL OF THESE REQUESTS ARE NOT USED IN THE FUNCTIONALITY DEMO FOR THE CODE SUBMITTED.
 * THESE REQUESTS WERE MADE TO IMPLEMENT FUTURE FEATURES SUCH AS USER IDENTIFICATION BASED ON EMAIL, PASSWORD, AND OTHER ATTRTIBUTES
 */
import axios from 'axios';

export const register = async (user) => await axios.post(`${process.env.REACT_APP_API}/register`, user);

export const login = async (user) => await axios.post(`${process.env.REACT_APP_API}/login`, user);

export const forgotPassword = async (user) => await axios.post(`${process.env.REnACT_APP_API}/forgot-password`, user);

export const resetPassword = async (user) => await axios.post(`${process.env.REACT_APP_API}/reset-password/${user.token}`, {password: user.password});

export const updateUserInLocalStorage = (user, next) => {
    if (window.localStorage.getItem("auth")) {
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = user;
      localStorage.setItem("auth", JSON.stringify(auth));
      next();
    }
  };

export const createBuyerProfile = async (token, data) => await axios.post(`${process.env.REACT_APP_API}/create-buyer-profile`, data, {
  headers: {
      Authorization: `Bearer ${token}`,
  }
});

export const createSellerProfile = async (token, data) => await axios.post(`${process.env.REACT_APP_API}/create-seller-profile`, data, {
  headers: {
      Authorization: `Bearer ${token}`,
  }
});

export const getTypeUser = async (token, data) => await axios.post(`${process.env.REACT_APP_API}/get-type-user`, data, {
  headers: {
      Authorization: `Bearer ${token}`,
  }
});

export const createSellerProfileAlreadyBuyer = async (token, data) => await axios.post(`${process.env.REACT_APP_API}/create-seller-profile-already-buyer`, data, {
  headers: {
      Authorization: `Bearer ${token}`,
  }
});

export const getPlanSeller = async (token, data) => await axios.post(`${process.env.REACT_APP_API}/get-plan-seller`, data, {
  headers: {
      Authorization: `Bearer ${token}`,
  }
});

export const selectPlan = async (token, data) => await axios.post(`${process.env.REACT_APP_API}/select-plan`, data, {
  headers: {
      Authorization: `Bearer ${token}`,
  }
});


export const getUser = async (token, data) => await axios.post(`${process.env.REACT_APP_API}/get-user`, data, {
  headers: {
    Authorization: `Bearer ${token}`,
}
});
export const updateRatings = async (token, data) => await axios.post(`${process.env.REACT_APP_API}/update-ratings`, data, {
  headers: {
      Authorization: `Bearer ${token}`,
  }
});

export const getUserById = async (token, data) => await axios.post(`${process.env.REACT_APP_API}/get-user-by-id`, data, {
  headers: {
    Authorization: `Bearer ${token}`,
}
});

export const saveReturnPolicy = async (token, data) => await axios.post(`${process.env.REACT_APP_API}/save-return-policy`, data, {
  headers: {
    Authorization: `Bearer ${token}`,
}
});


export const likedRequest = async (token, data) => await axios.post(`${process.env.REACT_APP_API}/liked-request`, data, {
  headers: {
    Authorization: `Bearer ${token}`,
}
});

export const likedOffer = async (token, data) => await axios.post(`${process.env.REACT_APP_API}/liked-offer`, data, {
  headers: {
    Authorization: `Bearer ${token}`,
}
});