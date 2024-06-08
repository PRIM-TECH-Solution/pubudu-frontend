import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Button } from '@material-ui/core';
import { io } from 'socket.io-client';

const EventTable = () => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState({
        eventId: '',
        organizerName: '',
        organizerPhone: '',
        organizerNic: '',
        organizerEmail: '',
        eventName: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        eventDescription: '',
        ticketDetails: '',
        eventCategory: '',
        flyerLink: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('http://localhost:8080/eventcards/getAll');
            setEvents(result.data);
        };

        fetchData();

        const socket = io('http://localhost:8080/ws');
        socket.on('/topic/events', (updatedEvents) => {
            setEvents(updatedEvents);
        });

        return () => socket.disconnect();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({
            ...filter,
            [name]: value
        });
    };

    const filteredEvents = events.filter(event => {
        return Object.keys(filter).every(key => 
            (event[key] || '').toString().toLowerCase().includes(filter[key].toLowerCase())
        );
    });

    const handleView = (event) => {
        // Logic for viewing event details
        alert(`Viewing details for Event ID: ${event.eventId}`);
    };

    const handleUpdate = (event) => {
        // Logic for updating the event
        alert(`Updating event with ID: ${event.eventId}`);
    };

    const handleDelete = async (event) => {
        // Logic for deleting the event
        await axios.delete(`http://localhost:8080/eventcards/${event.eventId}`);
        setEvents(events.filter(e => e.eventId !== event.eventId));
    };

    return (
        <div className="container mx-auto">
            <TextField 
                label="Filter by Event ID"
                name="eventId"
                value={filter.eventId}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Organizer Name"
                name="organizerName"
                value={filter.organizerName}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Organizer Phone"
                name="organizerPhone"
                value={filter.organizerPhone}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Organizer NIC"
                name="organizerNic"
                value={filter.organizerNic}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Organizer Email"
                name="organizerEmail"
                value={filter.organizerEmail}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Event Name"
                name="eventName"
                value={filter.eventName}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Event Date"
                name="eventDate"
                value={filter.eventDate}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Event Time"
                name="eventTime"
                value={filter.eventTime}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Event Location"
                name="eventLocation"
                value={filter.eventLocation}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Event Description"
                name="eventDescription"
                value={filter.eventDescription}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Ticket Details"
                name="ticketDetails"
                value={filter.ticketDetails}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Event Category"
                name="eventCategory"
                value={filter.eventCategory}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TextField 
                label="Filter by Flyer Link"
                name="flyerLink"
                value={filter.flyerLink}
                onChange={handleFilterChange}
                variant="outlined"
                margin="normal"
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'black' }}>
                            <TableCell style={{ color: 'white' }}>Event ID</TableCell>
                            <TableCell style={{ color: 'white' }}>Organizer Name</TableCell>
                            <TableCell style={{ color: 'white' }}>Organizer Phone</TableCell>
                            <TableCell style={{ color: 'white' }}>Organizer NIC</TableCell>
                            <TableCell style={{ color: 'white' }}>Organizer Email</TableCell>
                            <TableCell style={{ color: 'white' }}>Event Name</TableCell>
                            <TableCell style={{ color: 'white' }}>Event Date</TableCell>
                            <TableCell style={{ color: 'white' }}>Event Time</TableCell>
                            <TableCell style={{ color: 'white' }}>Event Location</TableCell>
                            <TableCell style={{ color: 'white' }}>Event Description</TableCell>
                            <TableCell style={{ color: 'white' }}>Ticket Details</TableCell>
                            <TableCell style={{ color: 'white' }}>Event Category</TableCell>
                            <TableCell style={{ color: 'white' }}>Flyer Link</TableCell>
                            <TableCell style={{ color: 'white' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEvents.map((event) => (
                            <TableRow key={event.eventId}>
                                <TableCell>{event.eventId}</TableCell>
                                <TableCell>{event.organizerName}</TableCell>
                                <TableCell>{event.organizerPhone}</TableCell>
                                <TableCell>{event.organizerNic}</TableCell>
                                <TableCell>{event.organizerEmail}</TableCell>
                                <TableCell>{event.eventName}</TableCell>
                                <TableCell>{event.eventDate}</TableCell>
                                <TableCell>{event.eventTime}</TableCell>
                                <TableCell>{event.eventLocation}</TableCell>
                                <TableCell>{event.eventDescription}</TableCell>
                                <TableCell>{event.ticketDetails}</TableCell>
                                <TableCell>{event.eventCategory}</TableCell>
                                <TableCell>{event.flyerLink}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        size="small" 
                                        onClick={() => handleView(event)}
                                        className="mr-2"
                                    >
                                        View
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        size="small" 
                                        onClick={() => handleUpdate(event)}
                                        className="mr-2"
                                    >
                                        Update
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="default" 
                                        size="small" 
                                        onClick={() => handleDelete(event)}
                                    >
                                        Delete
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

export default EventTable;