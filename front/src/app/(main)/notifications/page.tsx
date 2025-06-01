"use client"

import {useQuery, useQueryClient} from "@tanstack/react-query";
import { api } from "@/services/api";

export default function NotificationsPage(){
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await api.get("/devices/proposals/");
            return res.data.filter(device => device.status == "pending");
        }
    })

    const approveDevice = async (id: number) => {
        await api.put(`/devices/proposals/${id}/status`, {}, {
            params: {
                status: "approved",
            }
        });
        await queryClient.invalidateQueries({queryKey: ["notifications"]})
    }
    const rejectDevice = async (id: number) => {
        await api.put(`/devices/proposals/${id}/status`, {}, {
            params: {
                status: "rejected",
            },
        });
        await queryClient.invalidateQueries({queryKey: ["notifications"]})
    }

    return(
        <>
            <div className="flex flex-col gap-4">
                {
                    data?.map((device: any) => (
                        <div key={device.id}>
                            <div>{device.name} - {device.type}</div>
                            <div className="mt-2 flex gap-2">
                                <button className="btn btn-soft btn-success" onClick={() => approveDevice(device.id)}>Добавить</button>
                                <button className="btn btn-soft btn-error" onClick={() => rejectDevice(device.id)}>Отклонить</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}