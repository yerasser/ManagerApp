"use client"

import React from "react";
import {useForm} from "react-hook-form";
import {
    ContractApplicationCreate,
    ContractApplicationDetail,
} from "@/types/types";

interface ContractApplicationFormProps {
    id: number;
    contract_app?: ContractApplicationDetail | null;
    onSubmit: (data: ContractApplicationCreate) => void;
    onClose: () => void;
}

export default function ContractApplicationForm({ id, contract_app, onSubmit, onClose } : ContractApplicationFormProps) {
    const { register, handleSubmit } = useForm<ContractApplicationCreate>({
        defaultValues: {
            contract_id: id,
            application_number: contract_app?.application_number
        }
    });
    return (
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
            <label className="floating-label">
                <input type="text" placeholder="Номер приложения" className="input w-full" {...register("application_number")} />
                <span>Номер</span>
            </label>
        <div className="flex gap-2">
        <button type="submit" className="btn btn-primary">{contract_app ? "Изменить" : "Добавить" }</button>
            <button type="button" className="btn btn-soft" onClick={onClose}>Отмена</button>
            </div>
        </form>
)
}