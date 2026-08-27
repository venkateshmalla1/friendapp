import React, { useState } from "react";
import { addPerson } from "../../api";
import "./index.css";

function FormReg({ personData = {}, onSuccess }) {
    const { name, description, image, quote, music, relation } = personData;
    const [person, setPerson] = useState({
        name: name || "",
        description: description || "",
        image: image || "",
        quote: quote || "",
        music: music || "",
        relation: relation || "",
    });
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    const handleChange = ({ target }) => {
        setPerson((currentPerson) => ({
            ...currentPerson,
            [target.name]: target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus("loading");
        setError("");

        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setStatus("error");
            setError("You must be logged in as an admin to add a person.");
            return;
        }

        try {
            const savedPerson = await addPerson(
                {
                    names: [person.name.trim()],
                    description: person.description.trim(),
                    image: person.image.trim(),
                    quote: person.quote.trim(),
                    music: person.music.trim(),
                    relation: person.relation.trim(),
                },
                token
            );
            setStatus("success");
            onSuccess?.(savedPerson);
        } catch (requestError) {
            setStatus("error");
            setError(requestError.response?.data?.error || "Unable to save person.");
        }
    };

    const fields = [
        ["name", "Name", true],
        ["description", "Description"],
        ["image", "Image URL"],
        ["quote", "Quote"],
        ["music", "Music URL"],
        ["relation", "Relation"],
    ];

    return (
        <form onSubmit={handleSubmit}>
            {fields.map(([field, label, required]) => (
                <div className="mb-3" key={field}>
                    <label className="form-label" htmlFor={`person-${field}`}>
                        {label}
                    </label>
                    <input
                        id={`person-${field}`}
                        className="form-control"
                        name={field}
                        value={person[field]}
                        onChange={handleChange}
                        required={required}
                        type={field.endsWith("image") || field === "music" ? "url" : "text"}
                    />
                </div>
            ))}
            <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Saving..." : "Add person"}
            </button>
            {status === "success" && <p role="status">Person saved successfully.</p>}
            {status === "error" && <p role="alert">{error}</p>}
        </form>
    );
}

export default FormReg;