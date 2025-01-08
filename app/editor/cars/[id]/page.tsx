'use client';


import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from "@/components/ui/button";
import {ImageUpload} from '@/components/ImageUpload';
import {Loader2} from 'lucide-react';


const FUEL_TYPES = ['Бензин', 'Дизель', 'Электрический'] as const;
const TRANSMISSION_TYPES = ['Автоматическая', 'Механическая', 'Роботизированная'] as const;

type TransmissionType = typeof TRANSMISSION_TYPES[number];
type FuelType = typeof FUEL_TYPES[number];

interface CarFormData {
    make: string;
    model: string;
    year: number;
    type: string;
    pricePerDay: number;
    features: string[];
    description: string;
    images: string[];
    specifications: {
        transmission: TransmissionType | null;
        fuelType: FuelType | null;
        seats: number | null;
        luggage: number | null;
    };
}

const carTypes = ['Седан', 'Кроссовер', 'Спорткар', 'Минивэн'];
const featuresList = [
    'Автомат',
    'Климат-контроль',
    'Круиз-контроль',
    'Подогрев сидений',
    'Кожаный салон',
    'Панорамная крыша',
    'Автопилот'
];

const initialFormData: CarFormData = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Седан',
    pricePerDay: 0,
    features: [],
    description: '',
    images: [],
    specifications: {
        transmission: null,
        fuelType: null,
        seats: 5,
        luggage: 0
    }
};

export default function CarEditorPage({params}: { params: { id: string } }) {
    const router = useRouter();
    const isNew = params.id === 'new';
    const [formData, setFormData] = useState<CarFormData>(initialFormData);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await fetch(`/api/cars/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        ...data,
                        pricePerDay: Number(data.pricePerDay)
                    });
                } else {
                    router.push('/editor/cars');
                }
            } catch (error) {
                console.error('Error fetching car:', error);
                router.push('/editor/cars');
            } finally {
                setLoading(false);
            }
        };

        if (!isNew) {
            fetchCarData();
        }
    }, [isNew, params.id, router]);

    const handleFeatureToggle = (feature: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Валидация
        if (!formData.specifications.transmission) {
            alert('Выберите тип трансмиссии');
            setSaving(false);
            return;
        }
        if (!formData.specifications.fuelType) {
            alert('Выберите тип топлива');
            setSaving(false);
            return;
        }
        if (!formData.specifications.seats || formData.specifications.seats < 1 || formData.specifications.seats > 9) {
            alert('Укажите корректное количество мест (от 1 до 9)');
            setSaving(false);
            return;
        }
        if (!formData.specifications.luggage || formData.specifications.luggage < 0) {
            alert('Укажите корректный объем багажника');
            setSaving(false);
            return;
        }

        try {
            const response = await fetch(`/api/editor/cars/${isNew ? '' : params.id}`, {
                method: isNew ? 'POST' : 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Ошибка при сохранении');
            }

            router.push('/editor/cars');
        } catch (error) {
            console.error('Error saving car:', error);
            alert('Произошла ошибка при сохранении');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"/>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">
                {isNew ? 'Добавление автомобиля' : 'Редактирование автомобиля'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <ImageUpload
                    images={formData.images}
                    onChange={(newImages) => setFormData({...formData, images: newImages})}
                />

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium mb-2">Марка</label>
                        <input
                            type="text"
                            className="w-full rounded-md border px-3 py-2"
                            value={formData.make}
                            onChange={(e) => setFormData({...formData, make: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Модель</label>
                        <input
                            type="text"
                            className="w-full rounded-md border px-3 py-2"
                            value={formData.model}
                            onChange={(e) => setFormData({...formData, model: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Год</label>
                        <input
                            type="number"
                            className="w-full rounded-md border px-3 py-2"
                            value={formData.year}
                            onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                            required
                            min="1900"
                            max={new Date().getFullYear() + 1}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Тип</label>
                        <select
                            className="w-full rounded-md border px-3 py-2"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            required
                        >
                            {carTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Цена за день</label>
                    <input
                        type="number"
                        className="w-full rounded-md border px-3 py-2"
                        value={formData.pricePerDay || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Проверяем, что введено только число и оно не начинается с 0
                            if (value === '' || (/^\d+$/.test(value) && !/^0\d+$/.test(value))) {
                                const numValue = value ? parseInt(value) : 0;
                                setFormData({
                                    ...formData,
                                    pricePerDay: numValue
                                });
                            }
                        }}
                        // Предотвращаем ввод 'e' и других нечисловых символов
                        onKeyDown={(e) => {
                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') {
                                e.preventDefault();
                            }
                        }}
                        min="1"
                        max="1000000"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Описание</label>
                    <textarea
                        className="w-full rounded-md border px-3 py-2 h-32"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Особенности</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {featuresList.map((feature) => (
                            <label key={feature} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.features.includes(feature)}
                                    onChange={() => handleFeatureToggle(feature)}
                                    className="rounded"
                                />
                                <span>{feature}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Характеристики</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium mb-2">Трансмиссия</label>
                            <select
                                className="w-full rounded-md border px-3 py-2"
                                value={formData.specifications.transmission || ''}
                                onChange={(e) => {
                                    const value = e.target.value as TransmissionType | '';
                                    setFormData({
                                        ...formData,
                                        specifications: {
                                            ...formData.specifications,
                                            transmission: value || null
                                        }
                                    });
                                }}
                            >
                                <option value="">Выберите тип трансмиссии</option>
                                {TRANSMISSION_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Тип топлива</label>
                            <select
                                className="w-full rounded-md border px-3 py-2"
                                value={formData.specifications.fuelType || ''}
                                onChange={(e) => {
                                    const value = e.target.value as FuelType | '';
                                    setFormData({
                                        ...formData,
                                        specifications: {
                                            ...formData.specifications,
                                            fuelType: value || null
                                        }
                                    });
                                }}
                            >
                                <option value="">Выберите тип топлива</option>
                                {FUEL_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Количество мест</label>
                            <input
                                type="number"
                                className="w-full rounded-md border px-3 py-2"
                                value={formData.specifications.seats || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Проверяем, что введено только число
                                    if (value === '' || /^\d+$/.test(value)) {
                                        const numValue = value ? parseInt(value) : null;
                                        // Дополнительная проверка на диапазон значений
                                        if (!numValue || (numValue >= 1 && numValue <= 9)) {
                                            setFormData({
                                                ...formData,
                                                specifications: {
                                                    ...formData.specifications,
                                                    seats: numValue
                                                }
                                            });
                                        }
                                    }
                                }}
                                // Предотвращаем ввод 'e' и других нечисловых символов
                                onKeyDown={(e) => {
                                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') {
                                        e.preventDefault();
                                    }
                                }}
                                min="1"
                                max="9"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Объем багажника (л)</label>
                            <input
                                type="number"
                                className="w-full rounded-md border px-3 py-2"
                                value={formData.specifications.luggage || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Проверяем, что введено только число
                                    if (value === '' || /^\d+$/.test(value)) {
                                        setFormData({
                                            ...formData,
                                            specifications: {
                                                ...formData.specifications,
                                                luggage: value ? parseInt(value) : null
                                            }
                                        });
                                    }
                                }}
                                min="0"
                                onKeyDown={(e) => {
                                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/editor/cars')}
                    >
                        Отмена
                    </Button>
                    <Button
                        type="submit"
                        disabled={saving}
                        className="gap-2"
                    >
                        {saving && <Loader2 className="h-4 w-4 animate-spin"/>}
                        {saving ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </div>
            </form>
        </div>
    );
}