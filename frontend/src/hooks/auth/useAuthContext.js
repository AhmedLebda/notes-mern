import { useContext } from "react";
import authContext from "../../contexts/auth/authContext";
import AuthActionsCreator from "../../contexts/auth/authActions";
import useLoginMutation from "./useLoginMutation";
import { useNavigate } from "react-router-dom";
import AuthServices from "../../api/auth";

const useAuthContext = () => {
    const context = useContext(authContext);
    const loginMutation = useLoginMutation();
    const navigate = useNavigate();

    if (!context)
        throw Error(
            "useAuthContext must be used inside an AuthContextProvider"
        );

    const { user, dispatch, isAuthenticated } = context;

    const setCredentials = (credentials) =>
        dispatch(AuthActionsCreator.setCredentials(credentials));

    const updateCredentials = (updates) => {
        dispatch(AuthActionsCreator.updateCredentials(updates));
    };

    const login = async (loginData) => {
        loginMutation.mutate(loginData, {
            onSuccess: (data) => {
                setCredentials(data);
                navigate("/dashboard");
            },
            onError: (error) => console.log(error.message),
        });
    };

    const refreshToken = async () => {
        try {
            const token = await AuthServices.refreshToken();
            if (!token.access_token) {
                throw Error("Invalid token");
            }
            return token;
        } catch (error) {
            console.log(error.message);
        }
    };

    const getUserData = () => user;

    const getAuthStatus = () => isAuthenticated;

    const AuthActions = {
        login,
        updateCredentials,
        setCredentials,
        refreshToken,
        getUserData,
        getAuthStatus,
    };

    return AuthActions;
};

export default useAuthContext;