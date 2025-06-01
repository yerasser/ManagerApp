import React from "react";

export default function AuthLayout({ children } : { children: React.ReactNode }) {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <div className="card card-border w-80 bg-base-200 shadow-md">
                <div className="card-body">
                    { children }
                </div>
            </div>
        </div>
    )
}