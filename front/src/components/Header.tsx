"use client"

import {useEffect, useState} from "react";
import { themeChange } from "theme-change"
import {Moon, Sun, TableOfContents, Bell, UserRound  } from "lucide-react";
import {useAuth} from "@/hooks/useAuth";

export default function Header() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const { user } = useAuth();

    useEffect(() => {
        themeChange(false);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };
    return (
        <header className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <TableOfContents className="h-5 w-5" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><a href="/clients">Клиенты</a></li>
                        <li><a href="/contracts">Договоры</a></li>
                        <li><a href="/proposals">КП</a></li>
                        <li><a href="/statuses">Статусы</a></li>
                        <li><a href="/devices">Приборы</a></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a href="/clients">Клиенты</a></li>
                    <li><a href="/contracts">Договоры</a></li>
                    <li><a href="/proposals">КП</a></li>
                    <li><a href="/statuses">Статусы</a></li>
                    <li><a href="/devices">Приборы</a></li>
                </ul>
            </div>
            <div className="navbar-end">
                <div className="flex gap-4">
                    <div>{ user?.role == "admin" ? "admin" : "" }</div>
                    <button>
                        <UserRound  className="w-5 h-5" />
                    </button>
                    <button>
                        <a href="/notifications">
                            <Bell className="w-5 h-5" />
                        </a>
                    </button>
                    <label className="swap swap-rotate">
                        <input
                            type="checkbox"
                            className="theme-controller"
                            onChange={toggleTheme}
                            checked={theme === "dark"}
                            data-set-theme={theme === "light" ? "dark" : "light"}
                        />
                        <Moon className="swap-off h-5 w-5 fill-current" />
                        <Sun className="swap-on h-5 w-5 fill-current" />
                    </label>
                </div>
            </div>
        </header>
    )
}