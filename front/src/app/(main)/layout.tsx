"use client";

import React, {ReactNode} from "react"
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return <div className="w-screen h-screen flex justify-center items-center"><span className="loading loading-spinner loading-xl"></span></div>;
    }

    return (
            <>
                <Header />
                <main className="p-8">
                    {children}
                </main>
            </>
        );
}
