import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';

export const StoreContext = createContext();

const API_URL = 'http://localhost:5000/api';

export const StoreProvider = ({ children }) => {
    const [books, setBooksState] = useState([]);
    const [members, setMembersState] = useState([]);
    const [historyStore, setHistoryStoreState] = useState([]);
    const [recommendations, setRecommendationsState] = useState([]);
    const [issueRequests, setIssueRequestsState] = useState([]);

    // Auth state (still using localStorage to persist the session token/user info locally across refreshes)
    const [activeUser, setActiveUser] = useState(() => localStorage.getItem('activeUser') || null);
    const [activeUserName, setActiveUserName] = useState(() => localStorage.getItem('activeUserName') || null);
    const [activeUserRole, setActiveUserRole] = useState(() => localStorage.getItem('activeUserRole') || null);

    // Initial Fetch & Seed
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Ensure db is seeded
                await axios.post(`${API_URL}/seed`);

                const [booksRes, membersRes, historyRes, recsRes, requestsRes] = await Promise.all([
                    axios.get(`${API_URL}/books`),
                    axios.get(`${API_URL}/members`),
                    axios.get(`${API_URL}/history`),
                    axios.get(`${API_URL}/recommendations`),
                    axios.get(`${API_URL}/requests`)
                ]);
                
                setBooksState(booksRes.data);
                setMembersState(membersRes.data);
                setHistoryStoreState(historyRes.data);
                setRecommendationsState(recsRes.data);
                setIssueRequestsState(requestsRes.data);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                message.error("Could not connect to the database. Is the backend running?");
            }
        };

        fetchAllData();
    }, []);

    // Custom setters that also call API
    const setBooks = async (newBooks) => {
        // Find what changed and sync it, or just re-fetch all for simplicity in a small app.
        // For the sake of matching the exact API of `setBooks` which expects a new array, 
        // we'll update local state and let the caller handle specific API updates, 
        // BUT wait, original code used `setBooks([...books, newBook])`. 
        // It's better to provide specific functions or intercept the array.
        // Actually, since original code expects `setBooks(updatedArray)`, it's tricky to map an entire array replace to REST APIs (PUT/POST/DELETE) without diffing.
        // To keep UI changes zero, let's diff the array to figure out if it was an ADD, UPDATE, or DELETE.
        
        try {
            if (newBooks.length > books.length) {
                // Added
                const added = newBooks.filter(nb => !books.find(b => b.id === nb.id))[0];
                if (added) await axios.post(`${API_URL}/books`, added);
            } else if (newBooks.length < books.length) {
                // Deleted
                const deleted = books.filter(b => !newBooks.find(nb => nb.id === b.id))[0];
                if (deleted) await axios.delete(`${API_URL}/books/${deleted.id}`);
            } else {
                // Updated
                for (let i = 0; i < newBooks.length; i++) {
                    if (JSON.stringify(newBooks[i]) !== JSON.stringify(books.find(b => b.id === newBooks[i].id))) {
                        await axios.put(`${API_URL}/books/${newBooks[i].id}`, newBooks[i]);
                    }
                }
            }
            setBooksState(newBooks);
        } catch (error) {
            console.error("Error syncing books:", error);
            message.error("Failed to sync books with server");
        }
    };

    const setMembers = async (newMembers) => {
        try {
            if (newMembers.length > members.length) {
                const added = newMembers.filter(nm => !members.find(m => m.id === nm.id))[0];
                if (added) await axios.post(`${API_URL}/members`, added);
            } else if (newMembers.length < members.length) {
                const deleted = members.filter(m => !newMembers.find(nm => nm.id === m.id))[0];
                if (deleted) await axios.delete(`${API_URL}/members/${deleted.id}`);
            }
            setMembersState(newMembers);
        } catch (error) {
            console.error("Error syncing members:", error);
        }
    };

    const setHistoryStore = async (newHistory) => {
        try {
            if (newHistory.length > historyStore.length) {
                const added = newHistory[newHistory.length - 1]; // usually added at end
                await axios.post(`${API_URL}/history`, added);
            }
            setHistoryStoreState(newHistory);
        } catch (error) {
            console.error("Error syncing history:", error);
        }
    };

    const setRecommendations = async (newRecs) => {
        try {
            if (newRecs.length > recommendations.length) {
                const added = newRecs[newRecs.length - 1];
                await axios.post(`${API_URL}/recommendations`, added);
            }
            setRecommendationsState(newRecs);
        } catch (error) {
            console.error("Error syncing recommendations:", error);
        }
    };

    const setIssueRequests = async (newRequ