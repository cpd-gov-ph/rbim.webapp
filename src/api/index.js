//export const baseURL = "https://apiuatrbim.underdev.in/api/";
//export const baseURL = " https://apirbim.underdev.in/api/";
export const baseURL = process.env.REACT_APP_API_URL;
export const isLoading = () => {
  document.getElementById("pageLoader").classList.add("d-block");
};
export const isNotLoading = () => {
  if (
    document.querySelector("#pageLoader") &&
    document.querySelector("#pageLoader").classList.contains("d-block")
  ) {
    document.querySelector("#pageLoader").classList.remove("d-block");
  }
};
export const isLogedIn = () => {
  return !!localStorage.getItem("rbim_token");
};
export const getRole = () => {
  return localStorage.getItem("rbim_role");
};
export const userRole = () =>{
  return JSON.parse(localStorage.getItem("rbim_user"));
}
export const getCurrentUser = () => {
  return localStorage.getItem("rbim_token");
};
export const getTermsPrivacyStatus = () => {
  return localStorage.getItem("term_privacy_status");
};
export const postDataDownload = async (url = "", headers = {}, data = {}) => {
  try {
    const response = await fetch(`${baseURL + url}`, {
      method: "POST",
      headers: {
         "content-Type": "application/json",
        Authorization: `Token ${getCurrentUser()}`,
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (e) {
    return e;
  }
};
export const postData = async (url = "", headers = {}, data = {}) => {
  try {
    const response = await fetch(`${baseURL + url}`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        Authorization: `Token ${getCurrentUser()}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (response.status === 401) {
      // alert("Your Session Has Been Expired.Please Login Again");
      localStorage.clear();
      window.location = "/login";
    }
    return responseData;
  } catch (e) {
    return e;
  }
};
export const postUploadData = async (url = "", headers = {}, data) => {
  try {
    const response = await fetch(`${baseURL + url}`, {
      method: "POST",
      headers: {
        Authorization: `Token ${getCurrentUser()}`,
      },
      body: data,
    });
    const responseData = await response.json();
    if (response.status === 401) {
      // alert("Your Session Has Been Expired.Please Login Again");
      // localStorage.clear();
      // window.location = "/login";
    }
    return responseData;
  } catch (e) {
    return e;
  }
};

export const getData = async (url = "", headers = {}) => {
  try {
    const response = await fetch(`${baseURL + url}`, {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        Authorization: `Token ${getCurrentUser()}`,
      },
    });
    const responseData = await response.json();
    if (response.status === 401) {
      // alert("Your Session Has Been Expired.Please Login Again");
      localStorage.clear();
      window.location = "/login";
    }
    return responseData;
  } catch (e) {
    return e;
  }
};

export const putData = async (url = "", headers = {}, data = {}) => {
  try {
    const response = await fetch(`${baseURL + url}`, {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
        Authorization: `Token ${getCurrentUser()}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (response.status === 401) {
      // alert("Your Session Has Been Expired.Please Login Again");
      localStorage.clear();
      window.location = "/login";
    }
    return responseData;
  } catch (e) {
    return e;
  }
};
export const deleteData = async (url = "", headers = {}, data = {}) => {
  try {
    const response = await fetch(`${baseURL + url}`, {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
        Authorization: `Token ${getCurrentUser()}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (response.status === 401) {
      // alert("Your Session Has Been Expired.Please Login Again");
      localStorage.clear();
      window.location = "/login";
    }
    return responseData;
  } catch (e) {
    return e;
  }
};
