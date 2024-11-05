'use client'

import { Search } from "lucide-react";

interface CarSearchProps {
    value: string;
    onSearch: (value: string) => void;
}

export const CarSearch = ({ value, onSearch }: CarSearchProps) => {
    return (
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
                type="text"
                value={value}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Поиск по марке, модели или типу..."
                className="w-full rounded-lg border pl-10 pr-4 py-2 text-base"
            />
        </div>
    );
};