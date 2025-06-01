"use client"

import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Device, DeviceCreate, User} from "@/types/types";
import {useAuth} from "@/hooks/useAuth";
import {useMutation, useQuery} from "@tanstack/react-query";
import {api} from "@/services/api";

interface DeviceFormProps {
    device: Device | null;
    onSubmit: (data: DeviceCreate) => void;
    onClose: () => void;
}

export default function DeviceForm({ device, onSubmit, onClose } : DeviceFormProps) {
    const [showAdminList, setShowAdminList] = useState(false);
    const [newDevice, setNewDevice] = useState<DeviceCreate | null>(null);
    const { user } = useAuth()
    const { register, handleSubmit } = useForm<DeviceCreate>({
        defaultValues: {
            name: device?.name,
            type: device?.type,
            verification: device?.verification,
            calibration: device?.calibration,
            certification: device?.certification,
            department: device?.department,
            sector: device?.sector,
            verifier: device?.verifier,
            internal_number: device?.internal_number,
            business_trip: device?.business_trip,
            technical_possibility: device?.technical_possibility,
            combinability: device?.combinability,
            parameter: device?.parameter,
            additional_conditions: device?.additional_conditions,
            labels: device?.labels,
            technical_part_sum: device?.technical_part_sum,
            uncertainty_calculation: device?.uncertainty_calculation,
        }
    });

    const handleSubmitAction = (data: DeviceCreate) => {
        if (user?.role != "admin") {
            setShowAdminList(true)
            setNewDevice(data)
        } else {
            onSubmit(data)
            onClose()
        }
    }

    const { data } = useQuery({
        queryKey: ['admin list'],
        queryFn: async () => {
            const res = await api.get<User[]>('/users/', {
               params: {
                   role: "admin"
               }
            })
            return res.data
        }
    })
    const createDeviceProposal = useMutation({
        mutationKey: ['device proposal'],
        mutationFn: async(id: number) => {
            await api.post('/devices/proposals/', {...newDevice, reviewer_id: id, comment: ""})
        }
    })

    const handleSendDeviceProposal = (id: number) => {
        createDeviceProposal.mutate(id)
        setNewDevice(null)
        onClose()
    }
    return (
        <>
            {showAdminList ?
                <div className="w-full">
                    <div className="flex gap-2">
                        {
                            data?.map(user =>
                                <div key={user.id}>
                                    <div className="btn btn-soft" onClick={() => handleSendDeviceProposal(user.id)}>{user.username}</div>
                                </div>
                            )
                        }
                    </div>
                    <div className="text-xs opacity-70 mt-4 text-center">Выберите кому отправить запрос на создание</div>
                </div>
                :
                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(handleSubmitAction)}>
                    <div className="flex w-full gap-2">
                        <label className="floating-label w-full">
                            <input type="text" placeholder="Прибор" className="input" {...register("name")}/>
                            <span>Прибор</span>
                        </label>
                        <label className="floating-label w-full">
                            <input type="text" placeholder="Тип" className="input" {...register("type")} />
                            <span>Тип</span>
                        </label>
                    </div>
                    <div className="flex w-full gap-2">
                        <label className="floating-label">
                            <input type="number" placeholder="Поверка" className="input w-full" {...register("verification")} />
                            <span>Поверка</span>
                        </label>
                        <label className="floating-label">
                            <input type="number" placeholder="Калибровка" className="input w-full" {...register("calibration")} />
                            <span>Калибровка</span>
                        </label>
                        <label className="floating-label">
                            <input type="number" placeholder="Аттестация" className="input w-full" {...register("certification")} />
                            <span>Аттестация</span>
                        </label>
                    </div>
                    <div className="flex w-full gap-2">
                        <label className="floating-label w-full">
                            <input type="text" placeholder="Отдел" className="input" {...register("department")} />
                            <span>Отдел</span>
                        </label>
                        <label className="floating-label w-full">
                            <input type="text" placeholder="Сектор" className="input" {...register("sector")} />
                            <span>Сектор</span>
                        </label>
                    </div>
                    <label className="floating-label">
                        <input type="text" placeholder="Поверитель" className="input w-full" {...register("verifier")} />
                        <span>Поверитель</span>
                    </label>
                    <label className="floating-label">
                        <input type="text" placeholder="Вн. номер" className="input w-full" {...register("internal_number")} />
                        <span>Вн. номер</span>
                    </label>
                    <div className="flex w-full gap-2">
                        <label className="label">
                            <input type="checkbox" className="checkbox" {...register("business_trip")} />
                            Командировка
                        </label>
                        <label className="label">
                            <input type="checkbox" className="checkbox" {...register("technical_possibility")} />
                            Тех. возможность
                        </label>
                        <label className="label">
                            <input type="checkbox" className="checkbox" {...register("combinability")} />
                            Комбинированность
                        </label>
                    </div>
                    <div className="flex w-full gap-2">
                        <label className="floating-label w-full">
                            <input type="text" placeholder="Параметр" className="input" {...register("parameter")} />
                            <span>Параметр</span>
                        </label>
                        <label className="floating-label w-full">
                            <input type="text" placeholder="Доп.условия" className="input" {...register("additional_conditions")} />
                            <span>Доп.условия</span>
                        </label>
                    </div>
                    <label className="floating-label">
                        <input type="text" placeholder="Лейблы" className="input w-full" {...register("labels")} />
                        <span>Лейблы</span>
                    </label>
                    <div className="flex w-full gap-2">
                        <label className="floating-label w-full">
                            <input type="text" placeholder="Тех. часть(сумма)" className="input" {...register("technical_part_sum")} />
                            <span>Тех. часть(сумма)</span>
                        </label>
                        <label className="floating-label  w-full">
                            <input type="text" placeholder="Расчет неопределенности" className="input" {...register("uncertainty_calculation")} />
                            <span>Расчет неопределенности</span>
                        </label>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="btn btn-primary">{device ? "Изменить" : "Добавить" }</button>
                        <button type="button" className="btn btn-soft" onClick={onClose}>Отмена</button>
                    </div>
                </form>
            }
        </>

    )
}