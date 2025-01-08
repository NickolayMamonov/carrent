'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';

interface ImageUploadProps {
    images: string[];
    onChange: (newImages: string[]) => void;
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/editor/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                onChange([...images, data.url]);
            } else {
                const error = await response.json();
                console.error('Upload error:', error);
                alert('Ошибка при загрузке изображения');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Ошибка при загрузке изображения');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-2">Фотографии</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                        <Image
                            src={image}
                            alt=""
                            fill={true}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                <label className="aspect-square bg-muted rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                    {uploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                        <>
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Добавить фото</span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                    />
                </label>
            </div>
        </div>
    );
}