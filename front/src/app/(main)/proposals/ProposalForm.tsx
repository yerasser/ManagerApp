"use client"

import React from "react";
import {useForm} from "react-hook-form";
import {
    Client,
    ContractApplicationCreate,
    ContractApplicationDetail, ProposalCreate, ProposalDetailed,
} from "@/types/types";
import {useQuery} from "@tanstack/react-query";
import {api} from "@/services/api";

interface ProposalFormProps {
    proposal: ProposalDetailed | null;
    onSubmit: (data: ProposalCreate) => void;
    onClose: () => void;
}

export default function ProposalForm({ proposal, onSubmit, onClose } : ProposalFormProps) {
    const { register, handleSubmit } = useForm<ProposalCreate>({
        defaultValues: {
            client_id: proposal?.client_id,
            total_amount: 0
        }
    });
    const { data } = useQuery({
        queryKey: ["clients"],
        queryFn: async() => {
            const res = await api.get<Client[]>('/clients/')
            return res.data.sort((a, b) => a.id - b.id)
        }
    })
    return (
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
            <label className="select w-full">
                <span className="label">Клиент</span>
                <select {...register("client_id")} className="w-full">
                    {
                        data?.map(contract => (
                            <option key={contract.id} value={contract.id}>{contract.name} ({contract.bin})</option>
                        ))
                    }
                </select>
            </label>
            <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">{proposal ? "Изменить" : "Добавить" }</button>
                <button type="button" className="btn btn-soft" onClick={onClose}>Отмена</button>
            </div>
        </form>
    )
}