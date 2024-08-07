// React
import { useState } from "react";
// React-router-dom
import { useParams, useNavigate } from "react-router-dom";
// React Query
import { useQueryClient } from "@tanstack/react-query";
import useUpdateNoteMutation from "../../notes/useUpdateNoteMutation";
// Helpers
import { initialErrorState, showError } from "../../../utils/ErrorHelpers";
// Custom Hooks
import useSnackbar from "../snackbar/useSnackbar";
const useEditNote = () => {
    // Error State
    const [errorAlert, setErrorAlert] = useState(initialErrorState);

    // Get query client to get cached notes data
    const queryClient = useQueryClient();

    // Get notes Data from cache
    const cachedData = queryClient.getQueryData(["notes"]);

    // Get note id from the url parameters
    const { noteId } = useParams();

    // find the target note
    const note = cachedData && cachedData.find((note) => note._id === noteId);

    // update mutation
    const updateNoteMutation = useUpdateNoteMutation();

    // Navigate user
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        user: note.user._id,
        title: note.title,
        text: note.text,
        completed: note.completed,
    });

    // Show successful message on task update
    const { showSnackbar } = useSnackbar();

    // Handling form data change
    const handleFormDataChange = (e) => {
        if (e.target.name === "completed") {
            setFormData({ ...formData, [e.target.name]: e.target.checked });
            return;
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handling form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        const { title, text, completed, user } = formData;

        // Creating the update object
        let updates = { id: noteId };
        if (title && title !== note.title) {
            updates = { ...updates, title };
        }
        if (text && text !== note.text) {
            updates = { ...updates, text };
        }
        if (completed !== note.completed) {
            updates = { ...updates, completed };
        }
        if (user && user !== note.user._id) {
            updates = { ...updates, user };
        }

        // If the updates object includes only the note's ID, return immediately without making an API request, as there are no changes to the note.
        if (Object.entries(updates).length === 1) {
            console.log("nothing to update");
            showError(
                "You didn't change anything to update",
                errorAlert,
                setErrorAlert
            );
            return;
        }

        updateNoteMutation.mutate(updates, {
            onSuccess: () => {
                showSnackbar("Success! The task changes have been saved.");
                navigate("/dashboard/notes");
            },
            onError: ({ message }) =>
                showError(message, errorAlert, setErrorAlert),
        });
    };

    return { errorAlert, formData, handleFormDataChange, handleSubmit };
};

export default useEditNote;
