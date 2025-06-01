"use client"

import React, { useState, useMemo, ChangeEvent } from 'react';
import {EllipsisVertical, Search} from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';

export interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    visible?: boolean;
}



interface DataTableProps<T extends object & { id: number }> {
    data: T[];
    columns: Column<T>[];
    pageSize?: number;
    actions?: (item: T) => React.ReactNode;
    hasItems?: boolean;
}

function DataTable<T extends object & { id: number }>({ data, columns, pageSize = 10 , actions, hasItems}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {

        const initialVisibility: Record<string, boolean> = {};
        columns.forEach(col => {
            initialVisibility[col.key as string] = col.visible !== false;
        });
        return initialVisibility;
    });
    const pathname = usePathname();
    const router = useRouter();
    const getValueByPath = (obj: any, path: string): any =>
        path.split('.').reduce((acc, key) => acc?.[key], obj);


    // Фильтрация данных по общему поисковому запросу
    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        return data.filter(item =>
            columns.some(col => {
                const value = getValueByPath(item, col.key);
                return String(value ?? '').toLowerCase().includes(searchQuery.toLowerCase());
            })
        );
    }, [data, searchQuery, columns]);

    // Пагинация
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, currentPage, pageSize]);

    const handleToggleColumn = (key: string) => {
        setColumnVisibility(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div>
            <label className="input">
                <Search className="opacity-50" />
                <input
                    type="search"
                    className="grow"
                    placeholder="Поиск"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </label>

            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-soft m-1">Столбцы</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    {columns.map(col => (
                        <li key={col.key as string} >
                            <label style={{ marginRight: '1rem' }}>
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-xs"
                                    checked={columnVisibility[col.key as string]}
                                    onChange={() => handleToggleColumn(col.key as string)}
                                />
                                {col.header}
                            </label>
                        </li>
                    ))}
                </ul>

            </div>

            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                    <tr>
                        {columns.map(col =>
                            columnVisibility[col.key as string] ? (
                                <th
                                    key={col.key as string}
                                >
                                    {col.header}
                                </th>
                            ) : null
                        )}
                        {
                            actions && <th className="w-16"></th>
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedData.map((item, rowIndex) => (
                        <tr className={hasItems ? "cursor-pointer" : ""} key={rowIndex} onClick={hasItems ? () => router.push(`${pathname}/${item.id}`) : undefined}>
                            {columns.map(col =>
                                columnVisibility[col.key] ? (
                                    <td key={col.key}>
                                        {col.render ? col.render(item) : String(getValueByPath(item, col.key) ?? '')}
                                    </td>
                                ) : null
                            )}
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
                    ))}
                    {paginatedData.length === 0 && (
                        <tr>
                            <td colSpan={columns.length}>
                                Нет данных
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>            
            

            <div className="join mt-2">
                <button
                    className="join-item btn"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >«</button>
                <button className="join-item btn">{ currentPage }</button>
                <button
                    className="join-item btn"
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >»</button>
            </div>

        </div>
    );
}

export default DataTable;
