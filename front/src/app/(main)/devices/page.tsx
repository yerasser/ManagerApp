"use client"

import React, { useState} from "react";
import DataTable, { Column } from "@/components/DataTable";

import {Device, DeviceCreate} from "@/types/types";
import {useEntityCRUD} from "@/hooks/useEntityCRUD";
import {ModalWindow} from "@/components/ModalWindow";
import DeviceForm from "@/app/(main)/devices/DeviceForm";


const columns: Column<Device>[] = [
    { key: 'id', header: '#' },
    { key: 'name', header: 'Прибор' },
    { key: 'type', header: 'Тип' },
    { key: 'verification', header: 'Поверка' },
    { key: 'calibration', header: 'Калибровка' },
    { key: 'certification', header: 'Аттестация' },
    { key: 'department', header: 'Отдел' },
    { key: 'sector', header: 'Сектор' },
    { key: 'verifier', header: 'Поверитель' },
    { key: 'internal_number', header: 'Вн. номер' },
    { key: 'business_trip', header: 'Командировка' },
    { key: 'technical_possibility', header: 'Тех. возможность' },
    { key: 'combinability', header: 'Комбинированность' },
    { key: 'parameter', header: 'Параметр' },
    { key: 'additional_conditions', header: 'Доп. условия' },
    { key: 'labels', header: 'Лейблы' },
    { key: 'technical_part_sum', header: 'Тех. часть (сумма)' },
    { key: 'uncertainty_calculation', header: 'Расчет неопределенности' },
];


export default function DevicesPage() {
    const {
        modalOpen, setModalOpen, onClose,
        current, data, onSubmit
    } = useEntityCRUD<Device, DeviceCreate>({ entity: 'devices', sortFn: (a, b) => b.id - a.id });

    return (
        <div>
            <DataTable data={data || []} columns={columns} pageSize={5}/>
            <div className="mt-4">
                <button className="btn btn-primary btn-soft" onClick={() => setModalOpen(true)}>Добавить</button>
            </div>
            <ModalWindow isOpen={modalOpen} onClose={onClose} title={current ? "Редактировать прибор" : "Создать прибор"}>
                <DeviceForm device={current} onSubmit={onSubmit} onClose={onClose} />
            </ModalWindow>
        </div>
    )
}