import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import client from '../api/client';

interface User {
    id: string;
    email: string;
    // add other user properties
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Check valid session on mount
    const checkAuth = async () => {
        try {
            // Assuming an endpoint that returns the user profile if the cookie is valid
            const response = await client.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        setIsLoading(true);
        try {
            // Login endpoint sets the HttpOnly cookie
            const response = await client.post('/auth/login', credentials);
            setUser(response.data.user);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await client.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
