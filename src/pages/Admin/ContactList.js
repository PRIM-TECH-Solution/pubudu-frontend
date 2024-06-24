import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Button } from '@mui/material';
import { io } from 'socket.io-client';
import { jwtDecode } from "jwt-decode";

const ContactTable = () => {
    const [contacts, setContacts] = useState([]);
    const [filter, setFilter] = useState({
        contactId: "",
        contactName: "",
        contactEmail: "",
        contactMessages: "",
        role: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get("https://easyticket-event-user.azurewebsites.net/contact/getAll");
                setContacts(result.data);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    console.error("Token has expired");
                    return;
                }

                const userId = decodedToken.user_id;
                

                
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({
            ...filter,
            [name]: value
        });
    };

    const filteredContacts = contacts.filter(contact => {
        return Object.keys(filter).every(key => 
            (contact[key] || '').toString().toLowerCase().includes(filter[key].toLowerCase())
        );
    });

        

    return (
        <div className="container mx-auto">
            <TextField 
                label="Filter by Contact ID"
                name="contactId"
                value={filter.contactId}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Name"
                name="contactName"
                value={filter.contactName}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Email"
                name="contactEmail"
                value={filter.contactEmail}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Messages"
                name="contactMessages"
                value={filter.contactMessages}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
           

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'black' }}>
                            <TableCell style={{ color: 'white' }}>Contact ID</TableCell>
                            <TableCell style={{ color: 'white' }}>Contact Name</TableCell>
                            <TableCell style={{ color: 'white' }}>Contact Email</TableCell>
                            <TableCell style={{ color: 'white' }}>Contact Messages</TableCell>
                            
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredContacts.map((contact) => (
                            <TableRow key={contact.contactId}>
                                <TableCell>{contact.contactId}</TableCell>
                                <TableCell>{contact.contactName}</TableCell>
                                <TableCell>{contact.contactEmail}</TableCell>
                                <TableCell>{contact.contactMessages}</TableCell>
                                <TableCell>{contact.role}</TableCell>
                                <TableCell>
                                    
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ContactTable;