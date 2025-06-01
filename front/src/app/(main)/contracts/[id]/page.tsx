"use client"

import {useParams, useRouter} from "next/navigation";
import ApplicationTable from "@/app/(main)/contracts/[id]/table/ApplicationTable";
import {ContractApplication, ContractApplicationCreate, ContractApplicationDetail} from "@/types/types";
import React from "react";
import {useEntityCRUD} from "@/hooks/useEntityCRUD";
import {EllipsisVertical} from "lucide-react";
import {ModalWindow} from "@/components/ModalWindow";
import ContractApplicationForm from "@/app/(main)/contracts/[id]/ContractApplicationForm";


export default function ApplicationsPage() {
    const { id } = useParams();
    const router = useRouter();

    const {
        modalOpen, setModalOpen, current, setCurrent,
        data: applications, deleteEntity: deleteApplication,
        onSubmit, onClose
    } = useEntityCRUD<ContractApplicationDetail, ContractApplicationCreate>({
        entity: 'contract_applications',
        sortFn: (a, b) => a.id - b.id,
        queryParams: { contract_id: id },
        queryKeyDeps: [id],
    });


    return (
        <>
            <div className="flex flex-col gap-2">
                {
                    applications?.map((app) => (
                        <div className="bg-base-100 border-base-300 collapse border overflow-visible" key={app.id}>
                            <input type="checkbox" className="peer" />
                            <div
                                className="collapse-title w-full flex justify-between"
                            >
                                <div>
                                    {app.application_number}
                                </div>

                                <div className="dropdown dropdown-end z-10" onClick={(e) => e.stopPropagation()}>
                                    <div tabIndex={0} role="button" className="btn btn-ghost opacity-70 h-full w-full p-0">
                                        <EllipsisVertical className="w-4/6" />
                                    </div>
                                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                        <li>
                                            <button onClick={() => {
                                                setCurrent(app)
                                                setModalOpen(true);
                                            }}
                                            >
                                                Редактировать
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={() => deleteApplication.mutate(app.id)}>
                                                Удалить
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="collapse-content">
                                <ApplicationTable id={app.id} />
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="mt-4 flex gap-2">
                <button className="btn btn-primary btn-soft" onClick={() => setModalOpen(true)}>Добавить приложение</button>
                <button className="btn btn-primary btn-soft" onClick={() => router.push(`/contracts/${id}/proposals`)}>Привязать приложение</button>
            </div>
            <ModalWindow isOpen={modalOpen} onClose={onClose} title={current ? "Редактировать приложение" : "Создать приложение"}>
                <ContractApplicationForm id={Number(id)} contract_app={current} onSubmit={onSubmit} onClose={onClose} />
            </ModalWindow>
        </>
    )
}