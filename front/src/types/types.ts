export interface Client {
    name: string;
    bin: string;
    legal_address?: string | null;
    phone?: string | null;
    signatory?: string | null;
    id: number;
    created_at: string;
    updated_at: string;
}

export interface ClientCreate {
    name: string;
    bin: string;
    legal_address?: string | null;
    phone?: string | null;
    signatory?: string | null;
}

export interface Contract {
    client_id: number;
    contract_type: string;
    validity_period: string;
    date_signed: string;
    id: number;
    created_by?: number | null;
    created_at: string;
    updated_at: string;
}

export interface ContractCreate {
    client_id: number;
    contract_type?: string | null;
    validity_period?: string | null;
    date_signed?: string | null;
}

export interface ContractDetail extends Contract {
    client: ClientBase;
}

export interface ClientBase {
    name: string;
    bin: string;
    legal_address?: string | null;
    phone?: string | null;
    signatory?: string | null;
}

export interface ContractApplication {
    contract_id: number;
    application_number: string;
    id: number;
    created_at: string;
    updated_at: string;
}

export interface ContractApplicationCreate {
    contract_id: number;
    application_number: string;
}

export interface ContractApplicationDetail extends ContractApplication {
    contract: ContractDetail;
}

export interface Device {
    name: string;
    type: string;
    verification: number;
    calibration: number;
    certification: number;
    department?: string | null;
    sector?: string | null;
    verifier?: string | null;
    internal_number?: string | null;
    business_trip: boolean;
    technical_possibility: boolean;
    combinability: boolean;
    parameter?: string | null;
    additional_conditions?: string | null;
    labels?: string | null;
    technical_part_sum?: number | null;
    uncertainty_calculation?: string | number | null;
    id: number;
}

export interface DeviceCreate extends Omit<Device, 'id'> {}

export interface DeviceProposal extends DeviceCreate {
    id: number;
    created_by: number;
    reviewer_id: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    comment?: string;
}

export interface Status {
    name: string;
    id: number;
}

export interface StatusCreate {
    name: string;
}

export interface ApplicationItem {
    application_id: number;
    device_id?: number | null;
    status_id?: number | null;
    service?: string | null;
    quantity: number;
    price: number;
    total: number;
    id: number;
}

export interface ApplicationItemCreate extends Omit<ApplicationItem, 'id'> {
    price: number;
    total: number;
}

export interface ApplicationItemDetailed extends ApplicationItem {
    application: ContractApplicationDetail;
    device: Device | null;
    services_list: Record<string, any>[];
    status: Status | null;
}

export interface Proposal {
    client_id: number;
    total_amount?: string | null;
    id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
}

export interface ProposalCreate {
    client_id: number;
    total_amount?: string | number | null;
}

export interface ProposalDetailed extends Proposal {
    client: Client;
}

export interface ProposalItem {
    proposal_id: number;
    device_id?: number | null;
    service: string;
    quantity: number;
    price: string;
    total: string;
    id: number;
}

export interface ProposalItemCreate extends Omit<ProposalItem, 'id'> {
    price: string;
    total: string;
}

export interface ProposalItemDetailed extends ProposalItem {
    device: Device | null;
    services_list: Record<string, any>[];
}

export interface User {
    username: string;
    role: string;
    id: number;
    created_at: string;
    updated_at: string;
}

export interface UserCreate {
    username: string;
    role: string;
    password: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export const ContractType: Record<string, string> = {
    paper: 'Бумажный',
    tender: 'Тендерный',
};

export const serviceLabels: Record<string, string> = {
    verification: "Поверка",
    calibration: "Калибровка",
    certification: "Аттестация",
};