"use client"

import React, {useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {ContractDetail, ProposalDetailed, ProposalItemDetailed} from "@/types/types";
import { api } from "@/services/api";
import ProposalTable from "@/app/(main)/contracts/[id]/proposals/ProposalTable";
import { useRouter } from "next/navigation";
import ContractApplicationForm from "@/app/(main)/contracts/[id]/ContractApplicationForm";
import {ModalWindow} from "@/components/ModalWindow";
import { ContractApplicationCreate } from "@/types/types";

export default function ProposalConnectPage() {
    const { id } = useParams();
    let client_id: number
    const router = useRouter();
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState<ProposalDetailed | null>(null);

    const fetchClientId = async () => {
        try {
            const res = await api.get<ContractDetail>(`/contracts/${id}`)
            client_id = res.data.client_id
            return;
        } catch (error) {
            console.log(error)
        }
    }
    const fetchProposals = async (proposal_id: number) => {
        const res = await api.get<ProposalItemDetailed[]>("/proposal_items/", {
            params: { proposal_id: proposal_id }
        });
        return res.data.sort((a, b) => a.id - b.id)
    }
    const createApplication = async (application_number: string) => {
        const res = await api.post('/contract_applications/', {
            contract_id: id,
            application_number: application_number
        })
        return res.data.id
    }
    const createApplicationItem = async(application_id: number, proposal_item: ProposalItemDetailed) => {
        await api.post('/application_items/', {
            application_id: application_id,
            device_id: proposal_item.device_id,
            status_id: 1,
            service: proposal_item.service,
            quantity: proposal_item.quantity,
            price: proposal_item.price,
            total: proposal_item.total,
        })
    }
    const { data } = useQuery({
        queryKey: ["proposal by client", id],
        queryFn: async () => {
            await fetchClientId();
            const res = await api.get<ProposalDetailed[]>('/proposals/filter', {
                params: {
                    client_id: client_id,
                }
            });
            return res.data;
        }
    })
    const handleCopyProposal = async (proposal: ProposalDetailed) => {
        setSelectedProposal(proposal);
        setModalOpen(true);
    }
    const onSubmit = async (data: ContractApplicationCreate) => {
        try {
            if (!selectedProposal) return;
            
            const proposals = await fetchProposals(selectedProposal.id)
            const application_id = await createApplication(data.application_number)
            
            await Promise.all(
                proposals.map(proposal => 
                    createApplicationItem(application_id, proposal)
                )
            )
            setModalOpen(false);
            router.push(`/contracts/${id}`)
            await queryClient.invalidateQueries({queryKey: ["contract_applications", id]})
        } catch (error) {
            console.error('Error while copying proposal:', error)
        }
    }
    const onClose = () => {
        setModalOpen(false);
        setSelectedProposal(null);
    }

    return (
        <div className="flex flex-col gap-2">
            {
                data?.map((proposal) => (
                    <div className="bg-base-100 border-base-300 collapse border overflow-visible" key={proposal.id}>
                        <input type="checkbox" className="peer" />
                        <div className="collapse-title w-full flex justify-between">
                            <div>
                                КП #{proposal.id}
                            </div>
                            <button className="btn z-10" onClick={() => handleCopyProposal(proposal)}>Добавить</button>
                        </div>
                        <div className="collapse-content">
                            <ProposalTable id={proposal.id} />
                        </div>
                    </div>
                ))
            }
            <ModalWindow isOpen={modalOpen} onClose={onClose} title="Создать приложение">
                <ContractApplicationForm id={Number(id)} onSubmit={onSubmit} onClose={onClose} />
            </ModalWindow>
        </div>
    )
}