import {useQuery, useQueryClient} from "@tanstack/react-query";
import {api} from "@/services/api";
import DeviceAutocomplete from "@/components/DeviceAutocomplete";
import React from "react";
import {EllipsisVertical} from "lucide-react";
import {ApplicationItemDetailed, Device} from "@/types/types";


interface ApplicationItemRowProps {
    item: ApplicationItemDetailed;
    id: number,
    index: number;
    actions?: (item: ApplicationItemDetailed) => React.ReactNode;
}

export default function ApplicationItemRow({ item, id, index, actions }: ApplicationItemRowProps) {
    const queryClient = useQueryClient();


    const serviceLabels: Record<string, string> = {
        verification: "Поверка",
        calibration: "Калибровка",
        certification: "Аттестация",
    };

    const updateApplicationItem = async (updatedData: any) => {
        try {
            await api.put(`/application_items/${item.id}`, updatedData);
            await queryClient.invalidateQueries({ queryKey: ['application_items', id]});
        } catch (error) {
            console.error("Failed to update item:", error);
        }
    }

    const { data: statuses = [] } = useQuery({
        queryKey: ["statuses"],
        queryFn: async () => {
            const res = await api.get(`/statuses/`);
            return res.data;
        }
    })


    const handleDeviceUpdate = async (device: Device) => {
        let updatedData = {
            application_id: Number(id),
            device_id: device.id,
            service: item.service,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            status_id: item.status_id,
        }

        const services = [
            { service: 'verification', price: device.verification },
            { service: 'calibration', price: device.calibration },
            { service: 'certification', price: device.certification },
        ].filter(s => s.price !== 0);

        if (services.length > 0) {
            updatedData = {...updatedData, service: services[0].service, price: services[0].price};
            await updateApplicationItem(updatedData);
        }
    };
    const handleUpdateService = async (item: ApplicationItemDetailed, index: number) => {
        await updateApplicationItem({
            ...item,
            service: item.services_list[index].name,
            price: item.services_list[index].price
        });
    }


    return (
        <>
            <tr>
                <td>{index + 1}</td>
                <td>
                    <DeviceAutocomplete
                        item={item}
                        type="name"
                        onDeviceSelect={handleDeviceUpdate}
                    />
                </td>
                <td>
                    <DeviceAutocomplete
                        item={item}
                        type="type"
                        onDeviceSelect={handleDeviceUpdate}
                    />
                </td>
                <td>
                    {
                        item.services_list.length != 0 &&
                        <select
                            className="select select-ghost w-full h-full"
                            value={item.services_list.findIndex(s => s.name === item.service)}
                            onChange={(e) => handleUpdateService(item, Number(e.target.value))}
                        >
                            {item.services_list.map((service, idx) => (
                                <option key={idx} value={idx}>{serviceLabels[service.name] ?? service.name}</option>
                            ))}
                        </select>
                    }

                </td>
                <td>
                    <input
                        type="number"
                        value={item.quantity}
                        onChange={async (e) => {
                            const quantity = Number(e.target.value);
                            const updatedData = {
                                ...item,
                                quantity: quantity,
                                total: quantity * Number(item.price),
                            };
                            await updateApplicationItem(updatedData);
                        }}
                    />
                </td>
                <td>{Number(item.price)}</td>
                <td>{Number(item.total)}</td>
                <td>
                    <select
                        onChange={async (e) => {
                            const newStatusId = Number(e.target.value);
                            console.log(newStatusId);
                            const updatedData = {
                                ...item,
                                status_id: newStatusId
                            }
                            await updateApplicationItem(updatedData);
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
                </td>

                {
                    actions &&
                    <td>
                        <div className="dropdown dropdown-end" onClick={(e) => e.stopPropagation()}>
                            <div tabIndex={0} role="button" className="btn btn-ghost opacity-70 h-full w-full p-0">
                                <EllipsisVertical className="w-4/6" />
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                {actions(item)}
                            </ul>
                        </div>

                    </td>
                }
            </tr>
        </>

    );
}