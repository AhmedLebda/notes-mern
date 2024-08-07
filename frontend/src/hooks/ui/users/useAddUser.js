import { useState } from "react";
// React-router-dom
import { useNavigate } from "react-router-dom";
// Custom hooks
import useCreateUserMutation from "../../users/useCreateUserMutation";
import useSnackbar from "../snackbar/useSnackbar";
// Utils
import { initialErrorState, showError } from "../../../utils/ErrorHelpers";
const useAddUser = () => {
    const createUser = useCreateUserMutation();
    const navigate = useNavigate();
    const [errorAlert, setErrorAlert] = useState(initialErrorState);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        roles: {
            employee: false,
            manager: false,
            admin: false,
        },
    });
    const roles = [];

    // Show successful message on user creation
    const { showSnackbar } = useSnackbar();

    // Handles change in form data
    const handleFormDataChange = (e) => {
        if (e.target.type === "checkbox") {
            setFormData({
                ...formData,
                roles: {
                    ...formData.roles,
                    [e.target.name]: e.target.checked,
                },
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    // Validates the form data
    const validateForm = () => {
        // Collect all checked roles into an array
        for (let [key, value] of Object.entries(formData.roles)) {
            if (value) {
                roles.push(key);
            }
        }

        if ((!formData.username, !formData.password)) {
            showError(
                "Invalid username or password",
                errorAlert,
                setErrorAlert
            );
        }

        if (roles.length === 0) {
            roles.push("employee");
        }
    };

    // Handles form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        validateForm();
        const userData = {
            username: formData.username,
            password: formData.password,
            roles,
        };

        createUser.mutate(userData, {
            onSuccess: (response) => {
                console.log("user created!", response);
                showSnackbar("Success! The user account has been set up.");
                navigate("/dashboard/users");
            },
            onLoading: () => {
                setIsLoading(true);
            },
            onError: ({ message }) => {
                showError(message, errorAlert, setErrorAlert);
            },
        });
    };
    return {
        formData,
        errorAlert,
        isLoading,
        handleFormDataChange,
        handleSubmit,
    };
};

export default useAddUser;
