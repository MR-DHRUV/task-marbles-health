"use client";
import React from "react";
import { Modal, ModalContent, ModalHeader, Input, Textarea, Button } from "@nextui-org/react";
import { url } from "./constant";
import Swal from "sweetalert2";


const CreateUserModal = ({ isOpen, onClose, modalData, refreshData, setRefreshData }) => {

    // state variables
    const [isLoading, setIsLoading] = React.useState(false);
    const [user, setUser] = React.useState(modalData);
    const [edit, setEdit] = React.useState(false);

    // handle change function
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    // function to update user
    const handleUpdate = async () => {
        setIsLoading(true);
        await fetch(`${url}/users/${user._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
            referrerPolicy: "origin-when-cross-origin",
            body: JSON.stringify(user)
        });

        setIsLoading(false);
        setEdit(false);
    }

    // function to delete user
    const handleDelete = async () => {
        setIsLoading(true);
        await fetch(`${url}/users/${user._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
            referrerPolicy: "origin-when-cross-origin",
        });

        setIsLoading(false);
        setRefreshData(!refreshData);
        onClose();
    }

    React.useEffect(() => {
        setUser(modalData);
    }, [modalData]);

    return (
        <Modal size={"2xl"} isOpen={isOpen} onClose={() => {
            onClose();
            setEdit(false);
        }} className="modal-main">
            <ModalContent>
                {(onClose) => (
                    <div className="p-7">
                        <ModalHeader className="flex flex-col gap-1 ms-0 ps-0 text-2xl">User Details</ModalHeader>
                        {edit ? (<div className="flex flex-col gap-4 w-full">
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
                                disabled={true}
                                color="warning"
                            />
                            <Input
                                name="contact"
                                value={user.contact}
                                onChange={handleChange}
                                label="Contact"
                                type="text"
                                isInvalid={user.contact != "" & user.contact.length != 10}
                                errorMessage="Contact number should be of 10 digits"
                            />
                            <Input
                                name="dob"
                                value={user.dob}
                                onChange={handleChange}
                                label="Date of Birth"
                                type="date"
                            />
                            <textarea name="description"  rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Description" value={user.description} onChange={handleChange}>
                            </textarea>
                            <Button color="primary" variant="flat" onClick={handleUpdate} isLoading={isLoading}>
                                Update
                            </Button>
                            <Button color="danger" variant="flat" onClick={() => setEdit(false)}>
                                Cancel
                            </Button>

                        </div>) :
                            (
                                <div className="flex flex-col w-full">
                                    <p className="mb-0 pb-0 text-lg dark:text-gray-400">Name : {user.name}</p>
                                    <p className="mb-0 pb-0 text-lg dark:text-gray-400">Email : {user.email}</p>
                                    <p className="mb-0 pb-0 text-lg dark:text-gray-400">Contact : {user.contact}</p>
                                    <p className="mb-4 pb-0 text-lg dark:text-gray-400">Date of Birth : {user.dob}</p>
                                    <p className="mb-0 pb-0 text-lg dark:text-gray-400">Description:</p>
                                    <p className="mb-0 pb-0 text-lg dark:text-gray-400">{user.description}</p>
                                    <div className="flex flex-row gap-3 mt-5">
                                        <Button color="primary" variant="flat" onClick={() => setEdit(true)}>
                                            Edit
                                        </Button>
                                        <Button color="danger" variant="flat" onClick={() => {
                                            Swal.fire({
                                                title: "Are you sure?",
                                                text: "You won't be able to revert this!",
                                                icon: "warning",
                                                showCancelButton: true,
                                                cancelButtonColor: "#3085d6",
                                                confirmButtonColor: "#d33",
                                                confirmButtonText: "Delete"
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    handleDelete();
                                                    Swal.fire({
                                                        title: "Deleted!",
                                                        text: "Your file has been deleted.",
                                                        icon: "success"
                                                    });
                                                }
                                            });
                                        }}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )}
            </ModalContent>
        </Modal>
    );
}

export default CreateUserModal;