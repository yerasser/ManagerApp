import ApplicationItemRow from "@/app/(main)/contracts/[id]/table/ApplicationItemRow";

import {ApplicationItem, ApplicationItemCreate, ApplicationItemDetailed} from "@/types/types";
import {useEntityCRUD} from "@/hooks/useEntityCRUD";

export default function ApplicationTable({ id}: { id: number }) {
    const {
        data: application_items, addEntity: addApplicationItem, deleteEntity: deleteApplicationItem
    } = useEntityCRUD<ApplicationItemDetailed, ApplicationItemCreate>({
        entity: 'application_items',
        sortFn: (a, b) => a.id - b.id,
        queryParams: { application_id : id },
        queryKeyDeps: [id],
    })
    return (
        <>
            <table className="table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Название</th>
                    <th>Тип</th>
                    <th>Вид услуги</th>
                    <th>Кол-во</th>
                    <th>Цена</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                </tr>
                </thead>
                <tbody>
                {application_items?.map((item, index) => (
                    <ApplicationItemRow key={item.id} item={item} id={id} index={index} actions={() => (
                        <>
                            <li>
                                <button onClick={() => deleteApplicationItem.mutate(item.id)}>Удалить</button>
                            </li>
                        </>
                    )} />
                ))}
                </tbody>
                {/* Подвал таблицы без изменений */}
            </table>
            <div className="mt-4">
                <button className="btn btn-primary btn-soft" onClick={() => addApplicationItem.mutate({
                    application_id: id,
                    device_id: null,
                    status_id: 1,
                    service: "",
                    quantity: 0,
                    price: 0,
                    total: 0
                })}>Добавить прибор</button>
            </div>
        </>
    )
}