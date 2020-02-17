"use strict";

import axios from "axios";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
    showSpinner: false
})

let config = {
    // baseURL: process.env.baseURL || process.env.apiUrl || ""
    // timeout: 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
    function (config) {
        NProgress.start();
        return config;
    },
    function (error) {
        NProgress.remove();
        return Promise.reject(error);
    }
);

_axios.interceptors.response.use(
    function (response) {
        NProgress.done();
        if (response.data) {
            if (response.data.Error || (response.data.Msg && response.data.Msg !== 'OK')) {
                throw response.data.Msg;
            }
        }
        return response;
    },
    function (error) {
        NProgress.remove();
        return Promise.reject(error);
    }
);

export default _axios;
