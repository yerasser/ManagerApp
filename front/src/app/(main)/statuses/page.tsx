"use client"

import React from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {api} from "@/services/api";
import {ApplicationItemDetailed, serviceLabels} from "@/types/types";
import DataTable, {Column} from "@/components/DataTable";

export default function StatusesPage() {
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['application items all'],
        queryFn: async () => {
            const res = await api.get<ApplicationItemDetailed[]>("/application_items/all");
            return res.data.sort((a, b) => a.id - b.id);
        }
    })

    const { data: statuses = [] } = useQuery({
        queryKey: ["statuses"],
        queryFn: async () => {
            const res = await api.get(`/statuses/`);
            console.log(res.data);
            return res.data;
        }
    })
    const updateApplicationItem = async (id: number, updatedData: any) => {
        try {
            await api.put(`/application_items/${id}`, updatedData);
            await queryClient.invalidateQueries({ queryKey: ['application items all']});
        } catch (error) {
            console.error("Failed to update item:", error);
        }
    }


    const columns: Column<ApplicationItemDetailed>[] = [
        {
            key: 'application.contract.client_id',
            header: 'Клиент',
            render: item => item.application.contract.client.name
        },
        { key: 'application.contract_id', header: 'Номер договора' },
        { key: 'device.name',  header: 'Прибор'},
        { key: 'device.type',  header: 'Тип'},
        { key: 'service',  header: 'Услуга', render: item => serviceLabels[item.service || ""] },
        { key: 'quantity',  header: 'Количество'},
        { key: 'price',  header: 'Цена'},
        { key: 'total',  header: 'Общая цена'},
        { key: 'status_id',  header: 'Статус', render: item => (
                <select
                    onChange={async (e) => {
                        const newStatusId = Number(e.target.value);
                        console.log(newStatusId);
                        const updatedData = {
                            ...item,
                            status_id: newStatusId
                        }
                        await updateApplicationItem(item.id, updatedData);
                    }}
                    value={item.status_id || ""}
                    className="select select-bordered w-full max-w-xs"
                >
                    {statuses.map((status: any) => (
                        <option key={status.id} value={status.id}>
                            {status.name}
                        </option>
                    ))}
                </select>
            )},
    ];


    return (
        <>
            <DataTable data={data || []} columns={columns} pageSize={5} />
        </>
    )
}