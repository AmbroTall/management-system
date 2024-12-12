import { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";

const DynamicForm = ({ fields, onSubmit, initialValues = {}, onCancel }) => {
    const [formData, setFormData] = useState(initialValues);
    const [options, setOptions] = useState({}); // Store options for select fields

    useEffect(() => {
        const fetchOptions = async () => {
            const optionsData = {};
            for (const field of fields) {
                if (field.type === "select" && field.apiEndpoint) {
                    try {
                        const response = await axiosInstance.get(field.apiEndpoint);
                        optionsData[field.name] = response.data.roles; // Store the options for this field
                    } catch (error) {
                        console.error(`Error fetching options for ${field.name}:`, error);
                    }
                }
            }
            setOptions(optionsData);
        };

        fetchOptions();
    }, [fields]);

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "file" ? files[0] : value, // Handle file inputs
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(
                (field) =>
                    !field.hidden && ( // Conditionally render only if hidden is false or not provided
                        <div key={field.name} className="flex flex-col">
                            <label htmlFor={field.name} className="text-sm font-medium mb-1 text-gray-300">
                                {field.label || field.name}
                            </label>
                            {field.type === "select" ? (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    className="border p-2 rounded bg-gray-700 text-white"
                                    required={field.required}
                                >
                                    <option value="" disabled>
                                        Select {field.label || field.name}
                                    </option>
                                    {options[field.name]?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type || "text"}
                                    id={field.name}
                                    name={field.name}
                                    value={field.type === "file" ? undefined : formData[field.name] || ""}
                                    onChange={handleChange}
                                    className={`border p-2 rounded ${
                                        field.type === "file" ? "bg-gray-700 text-white" : "bg-gray-700 text-white"
                                    }`}
                                    placeholder={field.placeholder || `Enter ${field.name}`}
                                    required={field.required}
                                />
                            )}
                        </div>
                    )
            )}
            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                    Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Save
                </button>
            </div>
        </form>
    );
};

export default DynamicForm;
