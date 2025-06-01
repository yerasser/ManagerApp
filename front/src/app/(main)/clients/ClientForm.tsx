"use client"

import React from "react";
import {useForm} from "react-hook-form";
import {Client, ClientCreate} from "@/types/types";

interface ClientFormProps {
    client: Client | null;
    onSubmit: (data: ClientCreate) => void;
    onClose: () => void;
}

export default function ClientForm({ client, onSubmit, onClose } : ClientFormProps) {
    const { register, handleSubmit } = useForm<ClientCreate>({
        defaultValues: {
            name: client?.name,
            bin: client?.bin,
            legal_address: client?.legal_address,
            phone: client?.phone,
            signatory: client?.signatory,
        }
    });
    return (
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
            <label className="floating-label">
                <input type="text" placeholder="Имя" className="input w-full" {...register("name")} />
                <span>Имя</span>
            </label>
            <label className="floating-label">
                <input type="text" placeholder="БИН" className="input w-full" {...register("bin")} />
                <span>БИН</span>
            </label>
            <label className="floating-label">
                <input type="text" placeholder="Адрес" className="input w-full" {...register("legal_address")} />
                <span>Адрес</span>
            </label>
            <label className="floating-label">
                <input type="text" placeholder="Телефон" className="input w-full" {...register("phone")} />
                <span>Телефон</span>
            </label>
            <label className="floating-label mb-3">
                <input type="text" placeholder="Подписант" className="input w-full" {...register("signatory")} />
                <span>Подписант</span>
            </label>
            <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">{client ? "Изменить" : "Добавить" }</button>
                <button type="button" className="btn btn-soft" onClick={onClose}>Отмена</button>
            </div>
        </form>
    )
}