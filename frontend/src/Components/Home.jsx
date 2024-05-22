"use client";
import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Spinner, useDisclosure } from "@nextui-org/react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Pagination, Input } from "@nextui-org/react";
import UpdateUserModal from "./UpdateUserModal";
import CreateUserModal from "./CreateUserModal";
import { url } from "./constant";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {

    // responsive design handler
    const [width, setWidth] = React.useState(1024);
    React.useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Modal
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [modalData, setModalData] = React.useState({ name: "", email: "", contact: "", dob: "", description: "" });
    const [refreshData, setRefreshData] = React.useState(false);

    // setup for sorting and pagination
    const [search, setSearch] = React.useState("");
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 15;

    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });

    const { data, isLoading } = useSWR(`${url}/users/?page=${page}&search=${search}&refresh=${refreshData}`, fetcher, {
        keepPreviousData: true,
    });

    // use memo hook to memoize the value of pages
    const pages = React.useMemo(() => {
        return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
    }, [data?.count, rowsPerPage]);

    const loadingState = isLoading || data?.results.length === 0 ? "loading" : "idle";

    const sortedItems = React.useMemo(() => {
        return data?.results ? [...data.results].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        }) : [];
    }, [sortDescriptor, data]);

    return (
        <>
            <CreateUserModal isOpen={isCreateOpen} onClose={onCreateClose} />
            <UpdateUserModal isOpen={isEditOpen} onClose={onEditClose} modalData={modalData} refreshData={refreshData} setRefreshData={setRefreshData} />
            <div className="flex h-full flex-col items-center mybg">
                <Navbar className="w-1/2 mt-5 rounded-2xl nav">
                    <NavbarBrand>
                        {/* <AcmeLogo /> */}
                        <p className="font-bold text-inherit">User Dashboard</p>
                    </NavbarBrand>
                    <NavbarContent justify="end">
                        <NavbarItem>
                            <Button as={Link} color="primary" href="https://github.com/MR-DHRUV/task-marbles-health" target="_blank" variant="flat" isIconOnly>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                                </svg>
                            </Button>
                        </NavbarItem>
                    </NavbarContent>
                </Navbar>

                <div className="flex flex-col container mt-10 p-3">
                    <div className="flex flex-row flex-wrap md:flex-nowrap gap-4">
                        <Input
                            size="lg"
                            name="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search a name or an email..."
                            type="text"
                            className="max-w-[500px]"
                            startContent={
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                </svg>
                            }
                        />
                        <Button onClick={onCreateOpen} color="primary" variant="flat" size="lg">
                            Add User
                        </Button>
                    </div>
                    <Table
                        selectionMode="single"
                        className="mt-7"
                        bottomContent={
                            pages > 0 ? (
                                <div className="flex w-full justify-center">
                                    <Pagination
                                        isCompact
                                        showControls
                                        showShadow
                                        color="primary"
                                        page={page}
                                        total={pages}
                                        onChange={(page) => setPage(page)}
                                    />
                                </div>
                            ) : null
                        }
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                    >
                        {
                            width < 490 ? (
                                <TableHeader>
                                    <TableColumn key="name" allowsSorting>Name</TableColumn>
                                    <TableColumn key="email" allowsSorting>Email</TableColumn>
                                </TableHeader>
                            ) : width < 945 ? (
                                <TableHeader>
                                    <TableColumn key="name" allowsSorting>Name</TableColumn>
                                    <TableColumn key="email" allowsSorting>Email</TableColumn>
                                    <TableColumn key="contact" allowsSorting>Contact</TableColumn>
                                </TableHeader>
                            ) : (
                                <TableHeader>
                                    <TableColumn key="name" allowsSorting>Name</TableColumn>
                                    <TableColumn key="email" allowsSorting>Email</TableColumn>
                                    <TableColumn key="contact" allowsSorting>Contact</TableColumn>
                                    <TableColumn key="dob" allowsSorting>Date of Birth</TableColumn>
                                </TableHeader>
                            )
                        }
                        <TableBody
                            items={sortedItems ?? []}
                            loadingContent={<Spinner />}
                            loadingState={loadingState}
                        >
                            {(item) => (
                                <TableRow key={item?.email}>
                                    {(columnKey) => {
                                        item.dob = item.dob.split("T")[0];
                                        return <TableCell onClick={() => {
                                            setModalData(item);
                                            onEditOpen();
                                        }}>{getKeyValue(item, columnKey)}</TableCell>
                                    }}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                </div >
            </div >
        </>

    );
}