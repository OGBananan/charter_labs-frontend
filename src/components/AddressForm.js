import React, { useState } from "react";

const AddressForm = ({ trackAddress }) => {
    const [address, setAddress] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (address) {
            trackAddress(address);
            setAddress("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter Target Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <button type="submit">Track Address</button>
        </form>
    );
};

export default AddressForm;
