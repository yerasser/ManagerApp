"use client"

import DataTable, { Column } from "@/components/DataTable";
import {ContractDetail, ContractType, ContractCreate} from "@/types/types";
import dayjs from "dayjs";
import React from "react";
import {ModalWindow} from "@/components/ModalWindow";
import {useEntityCRUD} from "@/hooks/useEntityCRUD";
import ContractForm from "@/app/(main)/contracts/ContractForm";

const columns: Column<ContractDetail>[] = [
    { key: 'id', header: '#' },
    { key: 'client_id', header: 'Клиент', render: item => item.client.name },
    { key: 'contract_type', header: 'Тип', render: item => ContractType[item.contract_type] },
    { key: 'validity_period', header: 'Срок действия', render: item => dayjs(item.validity_period).format("DD.MM.YYYY") },
    { key: 'date_signed', header: 'Дата заключения', render: item => dayjs(item.date_signed).format("DD.MM.YYYY") },
];


export default function ContractsPage() {
    const {
        modalOpen, setModalOpen,
        current, setCurrent, data,
        deleteEntity: deleteContract, onSubmit, onClose
    } = useEntityCRUD<ContractDetail, ContractCreate>({ entity: 'contracts', sortFn: (a, b) => a.id - b.id });

    return (
        <div>
            <DataTable data={data || []} columns={columns} pageSize={5} actions={(item) => (
                <>
                    <li>
                        <button onClick={() => {
                            setCurrent(item)
                            setModalOpen(true);
                        }}
                        >
                            Редактировать
                        </button>
                    </li>
                    <li>
                        <button onClick={() => deleteContract.mutate(item.id)}>Удалить</button>
                    </li>
                </>
            )} hasItems={true} />
            <div className="mt-4">
                <button className="btn btn-primary btn-soft" onClick={() => setModalOpen(true)}>Добавить</button>
            </div>
            <ModalWindow isOpen={modalOpen} onClose={onClose} title={current ? "Редактировать договор" : "Создать договор"}>
                <ContractForm contract={current} onSubmit={onSubmit} onClose={onClose} />
            </ModalWindow>
        </div>
    )
}