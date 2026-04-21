import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../contexts/StoreContext';

const Login = () => {
    const { login, members, setMembers } = useContext(StoreContext);
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            try {
                const response = await axios.post('http://localhost:5000/api/login', {
                    id: userId,
                    password: password,
                    role: role
                });
                const user = response.data;
                login(user.id, user.name, user.role);
                
                if (user.role.toLowerCase() === 'admin') navigate('/admin');
                else if (user.role.toLowerCase() === 'librarian') navigate('/librarian');
                else if (user.role.toLowerCase() === 'student') navigate('/student');
                else if (user.role.toLowerCase() === 'faculty') navigate('/faculty');

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    alert('Invalid password.');
                } else if (error.response && error.response.status === 404) {
                    alert('User not found.');
                } else if (error.response && error.response.status === 403) {
                    alert('Role mismatch.');
                } else {
                    alert('Login failed. Please try again.');
                }
            }
        } else {
            // Signup Logic
            if (role === 'admin' || role === 'librarian') {
                alert('Admin and Librarian roles cannot be created via public signup.');
                return;
            }

            try {
                const response = await axios.post('http://localhost:5000/api/register', {
                    id: userId.trim(),
                    name: name.trim(),
                    role: role,
                    password: password
                });

                const newMember = response.data;
                // Update local context so it's immediately available without a refresh, though StoreContext should really re-fetch or we can just push it
                setMembers([...members, newMember]);
                login(newMember.id, newMember.name, newMember.role);

                alert('Signup successful! Welcome to the Library.');

                if (role === 'Student') navigate('/student');
                if (role === 'Faculty') navigate('/faculty');
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error && error.response.data.error.includes('duplicate key')) {
                    alert('Member ID already exists! Please choose another one or login.');
                } else {
                    alert('Signup failed. Please check your details.');
                }
            }
        }
    };

    return (
        <div className="auth-bg">
            <div className="auth-container">
                <div className="auth-toggle">
                    <button
                        type="button"
                        className={`toggle-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                <form className="auth-form active-form" onSubmit={handleSubmit}>
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{isLogin ? 'Enter your details to access your account.' : 'Register to access library resources.'}</p>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Member ID / Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={isLogin ? "e.g. S001 or admin" : "Choose a Member ID (e.g. S002)"}
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <select
                            className="form-control"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="Student">Student</option>
                            <option value="Faculty">Faculty</option>
                            {isLogin && (
                                <>
                                    <option value="librarian">Librarian</option>
                                    <option value="admin">Administrator</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-100" style={{ marginTop: '1rem' }}>
                        {isLogin ? 'Login Securely' : 'Sign Up & Enter'}
       