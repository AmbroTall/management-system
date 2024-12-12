import { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";

const useCRUD = (endpoint) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(endpoint);
                setData(response.data);
            } catch (err) {
                setError(err.message || "Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, reloadTrigger]);

    const createItem = async (item) => {
        try {
            await axiosInstance.post(endpoint, item);
            setReloadTrigger((prev) => !prev);
        } catch (err) {
            setError(err.message || "Error creating item");
        }
    };

    const updateItem = async (id, item) => {
        try {
            await axiosInstance.put(`${endpoint}/${id}`, item);
            setReloadTrigger((prev) => !prev);
        } catch (err) {
            setError(err.message || "Error updating item");
        }
    };

    const deleteItem = async (id) => {
        try {
            await axiosInstance.delete(`${endpoint}/${id}`);
            setReloadTrigger((prev) => !prev);
        } catch (err) {
            setError(err.message || "Error deleting item");
        }
    };

    return { data, loading, error, createItem, updateItem, deleteItem, reload: () => setReloadTrigger((prev) => !prev) };
};

export default useCRUD;
