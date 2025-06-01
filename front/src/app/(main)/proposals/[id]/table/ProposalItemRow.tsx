import {useQueryClient} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {api} from "@/services/api";
import {ProposalItem} from "@/app/(main)/proposals/[id]/page";
import { Device } from "@/types/types";
import DeviceAutocomplete from "@/components/DeviceAutocomplete";
import React from "react";
import {EllipsisVertical} from "lucide-react";



interface ProposalItemRowProps {
    item: ProposalItem;
    index: number;
    actions?: (item: ProposalItem) => React.ReactNode;
}

export default function ProposalItemRow({ item, index, actions }: ProposalItemRowProps) {
    const queryClient = useQueryClient();
    const { id } = useParams();



    const serviceLabels: Record<string, string> = {
        verification: "Поверка",
        calibration: "Калибровка",
        certification: "Аттестация",
    };

    const updateProposalItem = async (updatedData: any) => {
        try {
            await api.put(`/proposal_items/${item.id}/`, updatedData);
            await queryClient.invalidateQueries({ queryKey: ['proposal items', id]});
        } catch (error) {
            console.error("Failed to update proposal item:", error);
        }
    }

    const handleDeviceUpdate = async (device: Device) => {
        let updatedData = {
            proposal_id: Number(id),
            device_id: device.id,
            service: item.service,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
        }

        const services = [
            { service: 'verification', price: device.verification },
            { service: 'calibration', price: device.calibration },
            { service: 'certification', price: device.certification },
        ].filter(s => s.price !== 0);

        if (services.length > 0) {
            updatedData = {...updatedData, service: services[0].service, price: String(services[0].price)};
            await updateProposalItem(updatedData);
        }
    };
    const handleUpdateService = async (item: ProposalItem, index: number) => {
        await updateProposalItem({
            ...item,
            service: item.services_list[index].name,
            price: item.services_list[index].price
        });
        // await queryClient.invalidateQueries({ queryKey: ['proposal items', id]});
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
                            onChange={(e) =>
                                handleUpdateService(item, Number(e.target.value))
                            }
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
                            await updateProposalItem(updatedData);
                        }}
                    />
                </td>
                <td>{Number(item.price)}</td>
                <td>{Number(item.total)}</td>
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