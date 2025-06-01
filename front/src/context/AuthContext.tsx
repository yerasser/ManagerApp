"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface AuthContextType {
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    fetchUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const fetchUserData = async () => {
        if (!token) return;
        
        try {
            const response = await axios.get("http://localhost:8000/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                logout();
            }
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (token) {
            fetchUserData();
        }
    }, [token]);

    const login = async (username: string, password: string) => {
        try {
            const res = await axios.post("http://localhost:8000/users/token",
                new URLSearchParams({
                    grant_type: "password",
                    username,
                    password,
                }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );

            if (res.data.access_token) {
                localStorage.setItem("token", res.data.access_token);
                setToken(res.data.access_token);
                return null;
            }
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                return error.response.data.detail || "Неверное имя пользователя или пароль";
            }
            return "Произошла ошибка при входе";
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ 
            token, 
            loading, 
            isAuthenticated: !!token, 
            user,
            login, 
            logout,
            fetchUserData 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };