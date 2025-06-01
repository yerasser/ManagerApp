"use client"

import React, { useState} from "react";
import DataTable, { Column } from "@/components/DataTable";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {api} from "@/services/api";
import {Client, ClientCreate, ContractCreate, ContractDetail} from "@/types/types";
import {ModalWindow} from "@/components/ModalWindow";
import ClientForm from "@/app/(main)/clients/ClientForm";
import {useEntityCRUD} from "@/hooks/useEntityCRUD";


const columns: Column<Client>[] = [
    { key: 'id', header: '#' },
    { key: 'name', header: 'Имя' },
    { key: 'bin', header: 'БИН' },
    { key: 'legal_address', header: 'Адрес' },
    { key: 'phone', header: 'Телефон' },
    { key: 'signatory', header: 'Подписант' },
];

export default function ClientsPage() {
    const {
        modalOpen, setModalOpen,
        current, setCurrent, data,
        deleteEntity: deleteClient, onSubmit, onClose
    } = useEntityCRUD<Client, ClientCreate>({ entity: 'clients', sortFn: (a, b) => a.id - b.id });

    return (
        <div>
            <DataTable data={data || []} columns={columns} pageSize={5} actions={
                (item) => (
                    <>
                        <li><button onClick={() => {
                            setCurrent(item)
                            setModalOpen(true);
                        }}>Редактировать</button></li>
                        <li><button onClick={() => deleteClient.mutate(item.id)}>Удалить</button></li>
                    </>
                )
            } />
            <div className="mt-4">
                <button className="btn btn-primary btn-soft" onClick={() => setModalOpen(true)}>Добавить</button>
            </div>
            <ModalWindow isOpen={modalOpen} onClose={onClose} title={current ? "Редактировать клиента" : "Создать клиента"}>
                <ClientForm
                    client={current}
                    onSubmit={onSubmit}
                    onClose={onClose}
                />
            </ModalWindow>
        </div>
    )
}