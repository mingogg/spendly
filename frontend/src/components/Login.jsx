import { useState } from 'react';
import { API } from './config';

function Login({ onLoginSuccess }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch(`${API}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            onLoginSuccess(data);
        } else {
            alert('Login fallido. Intenta de nuevo.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const response = await fetch(`${API}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            onLoginSuccess(data);
        } else {
            const data = await response.json();
            alert(data.error || 'Error en el registro');
        }
    };

    return (
        <div className="login-container">
            <form
                className="login-form"
                onSubmit={isRegistering ? handleRegister : handleLogin}
            >
                <h2>{isRegistering ? 'Registrarse' : 'Iniciar sesión'}</h2>

                <input
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                {isRegistering && (
                    <input
                        type="email"
                        placeholder="Correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                )}
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="form-button">
                    {isRegistering ? 'Registrarse' : 'Entrar'}
                </button>

                <button
                    type="button"
                    className="toggle-button"
                    onClick={() => setIsRegistering(!isRegistering)}
                >
                    {isRegistering ? 'Ya tengo cuenta' : 'Crear cuenta'}
                </button>
            </form>
        </div>
    );
}

export default Login;
