"use client"

import { useForm } from "react-hook-form";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";
import {Key, User} from "lucide-react";


interface FormData {
    username: string;
    password: string;
}

export default function LoginPage() {
    const { register, handleSubmit} = useForm<FormData>();
    const router = useRouter();
    const { login } = useAuth();

    const onSubmit = async (data: FormData) => {
        const error = await login(data.username, data.password);

        if (error) {
            console.log(error);
        } else {
            router.push("/clients")
        }
    }

    return (
        <>
            <h1 className="card-title">Вход</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <label className="input w-full">
                    <User className="h-[1em] opacity-50"/>
                    <input
                        type="text"
                        placeholder="Username"
                        {...register("username", { required: true, minLength: 3, maxLength: 30 })}

                    />
                </label>

                <label className="input w-full">
                    <Key className="h-[1em] opacity-50" />
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", { required: true, minLength: 6 })}
                    />
                </label>

                <button type="submit" className="btn btn-soft btn-primary">Войти</button>
            </form>
        </>
    );
}
