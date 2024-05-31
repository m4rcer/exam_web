import {useDispatch, useSelector} from 'react-redux';
import {getTransport, configureTransport} from './transport';
import {logout, setTokens} from "../redux/slices/auth";
import TokenStorage from "./TokenStorage";

const generateHook = (callback) => () => {
    const dispatch = useDispatch();

    return callback(async (e) => {
        if (e?.response?.status !== 401) throw e;
        try {
            const token = await TokenStorage.getRefreshToken()
            const res = await get('refresh',{
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            await configureTransport(res.data.tokens.accessToken)
            dispatch(setTokens({
                accessToken: res.data.tokens.accessToken,
                refreshToken: res.data.tokens.refreshToken,
            }));

            await TokenStorage.setAccessToken(res.data.tokens.accessToken);
            await TokenStorage.setRefreshToken(res.data.tokens.refreshToken);
            await TokenStorage.setTokenReceived(Date.now() / 1000);

            delete e.response.config?.headers?.Authorization;
            const buf = (await getTransport()(e.response.config))?.data;
            return buf
        } catch (e) {
            TokenStorage.logOut();
            logout(dispatch)
            throw e;
        }
    });
};

export const usePost = generateHook((middleware) => (
    (path, payload, config) => getTransport()
        .post(`/${path}`, payload, config)
        .then((response) => response.data)
        .catch(middleware)
));

export const useGet = generateHook((middleware) => (
    (path, token, config) => getTransport(token)
        .get(`/${path}`, config)
        .then((response) => response.data)
        .catch(middleware)
));

export const usePut = generateHook((middleware) => (
    (path, payload, config) => getTransport()
        .put(`/${path}`, payload, config)
        .then((response) => response.data)
        .catch(middleware)
));

export const useDelete = generateHook((middleware) => (
    (path, payload, config) => getTransport()
        .delete(`/${path}`, payload, config)
        .then((response) => response.data)
        .catch(middleware)
));

export const usePatch = generateHook((middleware) => (
    (path, payload, config) => getTransport()
        .patch(`/${path}`, payload, config)
        .then((response) => response.data)
        .catch(middleware)
));

export const get = (path, config) => getTransport()
    .get(`/${path}`, config).then((response) => response.data);

export const post = async (path, payload, config) => getTransport()
    .post(`/${path}`, payload, config)
    .then((response) => response.data);

export const put = (path, payload = {}) => getTransport()
    .put(`/${path}`, payload)
    .then((response) => response.data);

export const deleteRequest = (path, payload = {}) => getTransport()
    .delete(`/${path}`, payload)
    .then((response) => response.data);

export const patch = (path, payload = {}) => getTransport()
    .patch(`/${path}`, payload)
    .then((response) => response.data);

export const httpDelete = (path, config) => getTransport()
    .delete(`/${path}`, config)
    .then((response) => response.data);
