"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { api } from "@/services/api";
import { useParams } from "next/navigation";
import ProposalItemRow from "@/app/(main)/proposals/[id]/table/ProposalItemRow";

export interface Service {
    name: string;
    price: number;
}

export interface ProposalItem {
    id: number;
    proposal_id: number;
    device_id: number;
    device_name: string;
    device_type: string;
    services_list: Service[];
    service: string;
    quantity: number;
    price: string;
    total: number;
}


export default function ProposalPage() {
    const queryClient = useQueryClient();
    const { id } = useParams();

    const { data: proposalItems = [] } = useQuery({
        queryKey: ["proposal items", id],
        queryFn: async () => {
            const res = await api.get<ProposalItem[]>("/proposal_items/", {
                params: { proposal_id: id }
            });
            return res.data.sort((a, b) => a.id - b.id)
        },
    });


    const addProposalItem = useMutation({
        mutationKey: ['add proposal item'],
        mutationFn: async () => {
            await api.post<ProposalItem[]>("/proposal_items/", {
                        "proposal_id": id,
                        "device_id": null,
                        "service": "",
                        "quantity": 0,
                        "price": 0,
                        "total": 0
                    })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['proposal items', id]});
        }
    })

    const deleteProposalItem = useMutation({
        mutationKey: ['del proposals item'],
        mutationFn: async(id: number) => {
            await api.delete(`/proposal_items/${id}`);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['proposal items', id]});
        }
    })

    return (
        <>
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
                    <ProposalItemRow key={item.id} item={item} index={index} actions={(item) => (
                        <>
                            <li>
                                <button onClick={() => deleteProposalItem.mutate(item.id)}>Удалить</button>
                            </li>
                        </>
                    )} />
                ))}
                </tbody>
                {/* Подвал таблицы без изменений */}
            </table>
            <div className="mt-4">
                <button className="btn btn-primary btn-soft" onClick={() => addProposalItem.mutate()}>Добавить прибор</button>
            </div>
        </>
    );
}
