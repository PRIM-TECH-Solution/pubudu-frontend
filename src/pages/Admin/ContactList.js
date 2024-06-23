import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Button } from '@mui/material';
import { io } from 'socket.io-client';

const ContactTable = () => {
    const [contacts, setContacts] = useState([]);
    const [filter, setFilter] = useState({
      contactName: "",
      role:"",
      contactEmail: "",
      contactMessages: "",
      nic: "",
      mobile: "",
      eventDetails: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('https://user-event.azurewebsites.net/contact/getAll');
            setContacts(result.data);
        };

        fetchData();

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

    const handleView = (contact) => {
        // Logic for viewing contact details
        alert(`Viewing details for contact ID: ${contact.contactId}`);
    };

    
    

    return (
        <div className="container mx-auto">
            <TextField 
                label="Filter by contact ID"
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
                label="Filter by contact Description"
                name="role"
                value={filter.role}
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
                            <TableCell style={{ color: 'white' }}>Contact Name</TableCell>
                            <TableCell style={{ color: 'white' }}>Contact Email</TableCell>
                            <TableCell style={{ color: 'white' }}>Description</TableCell>
                            <TableCell style={{ color: 'white' }}>Role</TableCell>

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
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        size="small" 
                                        onClick={() => handleView(contact)}
                                        className="mr-2"
                                    >
                                        View
                                    </Button>
                                    
                                    
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