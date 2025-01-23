import React, { useState, useEffect } from 'react';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const users = [
        { username: 'admin', password: 'password123' },
        { username: 'user1', password: '123456' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const user = users.find(
            (u) => u.username === formData.username && u.password === formData.password
        );
        if (user) {
            onLoginSuccess();
            setError('');
        } else {
            setError('Invalid username or password');
        }
    };

    useEffect(() => {
        const logo = document.querySelector('.logo h1');
        logo.classList.add('jiggle');
    }, []);

    return (
        <div className="login-container logo">
            <h1>DragNDrop</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Let's Begin</button>
            </form>
        </div>
    );
};

export default Login;