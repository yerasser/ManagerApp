"use client"

import React from "react";
import {useForm} from "react-hook-form";
import {Client, ContractCreate, ContractDetail} from "@/types/types";
import {useQuery} from "@tanstack/react-query";
import {api} from "@/services/api";

interface ContractFormProps {
    contract: ContractDetail | null;
    onSubmit: (data: ContractCreate) => void;
    onClose: () => void;
}

export default function ContractForm({ contract, onSubmit, onClose } : ContractFormProps) {
    const { register, handleSubmit } = useForm<ContractCreate>({
        defaultValues: {
            client_id: contract?.client_id,
            contract_type: contract?.contract_type,
            validity_period: contract?.validity_period,
            date_signed: contract?.date_signed
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
            <label className="select w-full">
                <span className="label">Тип</span>
                <select {...register("contract_type")} className="w-full">
                    <option value="paper" >Бумажный</option>
                    <option value="tender" >Тендерный</option>
                </select>
            </label>
            <label className="input w-full">
                <span className="label">Срок действия</span>
                <input type="date" className="w-full" {...register("validity_period")} />
            </label>
            <label className="input w-full">
                <span className="label">Дата заключения</span>
                <input type="date" className="w-full" {...register("date_signed")} />
            </label>
            <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">{contract ? "Изменить" : "Добавить" }</button>
                <button type="button" className="btn btn-soft" onClick={onClose}>Отмена</button>
            </div>
        </form>
    )
}