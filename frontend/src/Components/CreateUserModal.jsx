"use client";
import React from "react";
import { Modal, ModalContent, ModalHeader, Input, Button } from "@nextui-org/react";
import { url } from "./constant";

const CreateUserModal = ({ isOpen, onClose }) => {

    // state variables
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [user, setUser] = React.useState({
        name: "",
        email: "",
        contact: "",
        dob: "",
        description: "",
    });

    // handle change function
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    // function to add user
    const handleAdd = async () => {
        
        if (user.name === "" || user.email === "" || user.contact.length != 10 || user.description === "" || user.dob === "") {
            setError("Please fill all the fields");
            return;
        }

        setIsLoading(true);
        const res = await fetch(`${url}/users/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
            referrerPolicy: "origin-when-cross-origin",
            body: JSON.stringify(user)
        });

        const json = await res.json();

        if (!json.success)
        {
            setError(json.message);
            setIsLoading(false);
            return;
        }

        setUser({
            name: "",
            email: "",
            contact: "",
            dob: "",
            description: "",
        });

        setIsLoading(false);
        onClose();
    }

    return (
        <Modal size={"2xl"} isOpen={isOpen} onClose={onClose} className="modal-main">
            <ModalContent>
                {(onClose) => (
                    <div className="p-7">
                        <ModalHeader className="flex flex-col gap-1 ms-0 ps-0 text-2xl">Add New User</ModalHeader>
                        <div className="flex flex-col gap-4 w-full">
                            <Input
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                label="Name"
                                type="text"
                                className="w-full"
                            />
                            <Input
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                label="Email"
                                type="email"
                            />
                            <Input
                                name="contact"
                                value={user.contact}
                                onChange={handleChange}
                                label="Contact"
                                type="text"
                                isInvalid={user.contact!= "" &user.contact.length != 10}
                                errorMessage="Contact number should be of 10 digits"
                            />
                            <Input
                                name="dob"
                                value={user.dob}
                                onChange={handleChange}
                                label="Date of Birth"
                                type="date"
                            />
                            <textarea name="description" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Description" value={user.description} onChange={handleChange} />

                            <Button color="primary" variant="flat" onClick={handleAdd} isLoading={isLoading}>
                                Add
                            </Button>
                            <p className="text-danger">Error: {error}</p>
                        </div>
                    </div>
                )}
            </ModalContent>
        </Modal>
    );
}

export default CreateUserModal;