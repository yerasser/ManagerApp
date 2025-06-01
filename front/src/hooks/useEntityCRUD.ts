import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {api} from '@/services/api';
type Id = number | string;
interface CRUDOptions<T, TCreate> {
    entity: string;
    sortFn?: (a: T, b: T) => number;
    queryParams?: Record<string, any>;
    queryKeyDeps?: unknown[];
}

export function useEntityCRUD<T, TCreate>({
                                              entity,
                                              sortFn,
                                              queryParams,
                                              queryKeyDeps = [],
                                          }: CRUDOptions<T, TCreate>) {
    const [modalOpen, setModalOpen] = useState(false);
    const [current, setCurrent] = useState<T | null>(null);
    const queryClient = useQueryClient();

    const fetchData = async () => {
        await queryClient.invalidateQueries({ queryKey: [entity, ...queryKeyDeps] });
    };

    const { data } = useQuery({
        queryKey: [entity, ...queryKeyDeps],
        queryFn: async () => {
            const res = await api.get<T[]>(`/${entity}/`, {
                params: queryParams,
            });
            return sortFn ? res.data.sort(sortFn) : res.data;
        },
    });

    const deleteEntity = useMutation({
        mutationKey: [`delete ${entity}`],
        mutationFn: async (id: Id) => api.delete(`/${entity}/${id}`),
        onSuccess: fetchData,
    });

    const addEntity = useMutation({
        mutationKey: [`add ${entity}`],
        mutationFn: async (data: TCreate) => api.post(`/${entity}`, data),
        onSuccess: () => fetchData().then(() => onClose()),
    });

    const updateEntity = useMutation({
        mutationKey: [`update ${entity}`],
        mutationFn: async (data: TCreate) => api.put(`/${entity}/${(current as any)?.id}`, data),
        onSuccess: () => fetchData().then(() => onClose()),
    });

    const onSubmit = async (data: TCreate) => {
        if (current) return updateEntity.mutate(data);
        return addEntity.mutate(data);
    };

    const onClose = () => {
        setModalOpen(false);
        setCurrent(null);
    };

    return {
        modalOpen,
        setModalOpen,
        current,
        setCurrent,
        data,
        deleteEntity,
        addEntity,
        updateEntity,
        onSubmit,
        onClose,
        fetchData,
    };
}
