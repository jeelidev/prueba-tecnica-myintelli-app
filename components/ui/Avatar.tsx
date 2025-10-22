import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

interface AvatarProps {
    imageUrl?: string;
    fallbackText: string;
    size?: number;
}


const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    const firstInitial = names[0] ? names[0][0] : '';
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
};

export const Avatar = ({ imageUrl, fallbackText, size = 48 }: AvatarProps) => {
    const [hasError, setHasError] = useState(false);
    const initials = getInitials(fallbackText);

    const showImage = imageUrl && !hasError;

    return (
        <View
            className="rounded-full justify-center items-center bg-muted"
            style={{ width: size, height: size }}
        >
            {showImage ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={{ width: size, height: size, borderRadius: size / 2 }}
                    contentFit="cover"
                    onError={() => setHasError(true)}
                />
            ) : (
                <Text
                    className="font-semibold text-muted-foreground"
                    style={{ fontSize: size * 0.4 }}
                >
                    {initials}
                </Text>
            )}
        </View>
    );
};