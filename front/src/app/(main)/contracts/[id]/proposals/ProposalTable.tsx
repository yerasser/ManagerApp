"use client"



import {useQuery} from "@tanstack/react-query";
import {api} from "@/services/api";
import {ProposalItemDetailed, serviceLabels} from "@/types/types";
import React from "react";

export default function ProposalTable({id}: {id: number}) {
    const { data: proposalItems = [] } = useQuery({
        queryKey: ["proposal items", id],
        queryFn: async () => {
            const res = await api.get<ProposalItemDetailed[]>("/proposal_items/", {
                params: { proposal_id: id }
            });
            return res.data.sort((a, b) => a.id - b.id)
        },
    });
    return(
        <table className="table">
            <thead>
            <tr>
                <th>#</th>
                <th>Название</th>
                <th>Тип</th>
                <th>Вид услуги</th>
                <th>Кол-во</th>
                <th>Цена</th>
                <th>Сумма</th>
            </tr>
            </thead>
            <tbody>
                {proposalItems.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.device?.name}</td>
                        <td>{item.device?.type}</td>
                        <td>{serviceLabels[item.service]}</td>
                        <td>{item.quantity}</td>
                        <td>{Number(item.price)}</td>
                        <td>{Number(item.total)}</td>
                    </tr>
                ))}
            </tbody>
            {/* Подвал таблицы без изменений */}
        </table>
    )
}