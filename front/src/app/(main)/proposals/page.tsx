"use client"

import DataTable, { Column } from "@/components/DataTable";
import {useEntityCRUD} from "@/hooks/useEntityCRUD";
import {ProposalCreate, ProposalDetailed} from "@/types/types";
import {ModalWindow} from "@/components/ModalWindow";
import ContractForm from "@/app/(main)/contracts/ContractForm";
import React from "react";
import ProposalForm from "@/app/(main)/proposals/ProposalForm";





const columns: Column<ProposalDetailed>[] = [
    { key: 'id', header: '#' },
    { key: 'client_id', header: 'Клиент', render: item => item.client.name },
    { key: 'total_amount', header: 'Общая стоимость' },
];



export default function ProposalsPage() {
    const {
        modalOpen, setModalOpen,
        current, data,
        deleteEntity: deleteProposal, onSubmit, onClose
    } = useEntityCRUD<ProposalDetailed, ProposalCreate>({ entity: 'proposals', sortFn: (a, b) => a.id - b.id });

    return (
        <div>
            <DataTable data={data || []} columns={columns} pageSize={5} actions={(item) => (
                <>
                    <li>
                        <button onClick={() => deleteProposal.mutate(item.id)}>Удалить</button>
                    </li>
                </>
            )} hasItems={true} />
            <div className="mt-4">
                <button className="btn btn-primary btn-soft" onClick={() => setModalOpen(true)}>Добавить</button>
            </div>
            <ModalWindow isOpen={modalOpen} onClose={onClose} title={current ? "Редактировать КП" : "Создать КП"}>
                <ProposalForm proposal={current} onSubmit={onSubmit} onClose={onClose} />
            </ModalWindow>
        </div>
    )
}