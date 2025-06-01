import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import { debounce } from "lodash";
import { Device } from "@/types/types";

export default function DeviceAutocomplete<T>({
                                                  item,
                                                  type,
                                                  onDeviceSelect,
                                              }: {
    item: T;
    type: 'name' | 'type';
    onDeviceSelect: (device: Device) => Promise<void>;
}) {
    const [inputValue, setInputValue] = useState(
        type === 'name'
            ? (item as any).device?.name ?? ''
            : (item as any).device?.type ?? ''
    );


    const [suggestions, setSuggestions] = useState<Device[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const itemRefs = useRef<Map<number, HTMLLIElement>>(new Map());

    // Синхронизация с обновленными данными
    useEffect(() => {
        setInputValue(
            type === 'name'
                ? (item as any).device?.name ?? ''
                : (item as any).device?.type ?? ''
        );
    }, [item, type]);


    // Запрос устройств
    const fetchDeviceList = useCallback(async (value: string) => {
        try {
            const params = type === 'name'
                ? { name: value }
                : { type: value };

            const res = await api.get<Device[]>("/devices/", { params });
            setSuggestions(res.data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Failed to fetch devices:", error);
        }
    }, [type]);

    const debouncedFetch = useRef(
        debounce((value: string) => {
            if (value.length >= 2) fetchDeviceList(value);
        }, 300)
    ).current;

    // Обработка ввода
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedFetch(value);
    };

    // Выбор устройства
    const handleSelect = async (device: Device) => {
        setInputValue(type === 'name' ? device.name : device.type);
        setShowSuggestions(false);
        setActiveIndex(-1);
        await onDeviceSelect(device);
    };

    // Навигация клавиатурой
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev =>
                    prev >= suggestions.length - 1 ? 0 : prev + 1
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev =>
                    prev <= 0 ? suggestions.length - 1 : prev - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < suggestions.length) {
                    handleSelect(suggestions[activeIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setActiveIndex(-1);
                break;
        }
    };

    // Прокрутка к активному элементу
    useEffect(() => {
        if (listRef.current && activeIndex >= 0) {
            const activeItem = itemRefs.current.get(activeIndex);
            if (activeItem) {
                const container = listRef.current;
                const { offsetTop: itemTop, offsetHeight: itemHeight } = activeItem;
                const { scrollTop, clientHeight: containerHeight } = container;

                const isAbove = itemTop < scrollTop;
                const isBelow = itemTop + itemHeight > scrollTop + containerHeight;

                if (isAbove) {
                    container.scrollTop = itemTop;
                } else if (isBelow) {
                    container.scrollTop = itemTop + itemHeight - containerHeight;
                }
            }
        }
    }, [activeIndex]);

    // Закрытие по клику вне компонента
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setActiveIndex(-1);
    }, [suggestions]);

    return (
        <div className="relative" ref={wrapperRef}>
            <input
                className="w-full"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => inputValue.length >= 2 && setShowSuggestions(true)}
                placeholder={`Введите ${type === 'name' ? 'название' : 'тип'}`}
            />

            {showSuggestions && suggestions.length > 0 && (
                <ul
                    ref={listRef}
                    className="absolute z-40 bg-base-100 border rounded shadow-lg w-full max-h-60 overflow-y-auto scrollbar-vertical mt-1"
                >
                    {suggestions.map((device, index) => (
                        <li
                            key={device.id}
                            ref={(el) => {
                                if (el) {
                                    itemRefs.current.set(index, el);
                                } else {
                                    itemRefs.current.delete(index);
                                }
                            }}
                            className={`p-2 cursor-pointer transition-colors ${
                                index === activeIndex
                                    ? 'bg-base-200 font-medium'
                                    : 'hover:bg-base-200'
                            }`}
                            onClick={() => handleSelect(device)}
                        >
                            {type === 'name' ? device.name : device.type}
                            <span className="text-gray-500 ml-2 text-sm">
                                ({type === 'name' ? device.type : device.name})
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
