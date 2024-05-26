import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:10000/api/v1'
  // headers: {
  //   'Content-Type': 'application/json',
  //   'Access-Control-Allow-Origin': '*'
  // }
});

// config header
api.interceptors.request.use(
  (config) => {
    // handle before request is sent
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      'access_token'
    )}`;

    return config;
  },
  (error) => {
    // handle request error
    return Promise.reject(error);
  }
);

// handle exception
api.interceptors.response.use(
  (response) => {
    // handle response data
    return response;
  },
  (error) => {
    // handle response un-authen error
    if (error?.response?.status === 401) {
      console.log('UnAuthorize');
    }
    return Promise.reject(error);
  }
);

export default api;
