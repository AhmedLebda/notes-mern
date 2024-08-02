import useCreateUserMutation from "../../users/UseCreateUserMutation";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
