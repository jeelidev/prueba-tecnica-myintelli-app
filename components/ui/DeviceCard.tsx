import { GradientBackgroundBlue } from '@/components/ui/GradientBackgroundBlue';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProtectedApiItem } from '../../types/api';
import { Card, CardContent, CardHeader, CardTitle } from './card'; // Asumiendo tu estructura

interface DeviceCardProps {
    item: ProtectedApiItem;
}

const localStyles = StyleSheet.create({
    image: {
        width: "100%",
        height: 100,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 2
    },
});

export const DeviceCard = React.memo(function DeviceCardOpti({ item }: DeviceCardProps) {
    const statusText = !item.status ? "activo" : "inactivo";
    const statusColor = !item.status ? 'text-green-500' : 'text-red-500';

    return (
        <Card className="flex flex-col relative m-2 bg-secondary-foreground p-1 min-h-[310px] w-[45%]">
            <View className='flex-1 rounded-xl border border-transparent overflow-hidden'>
                <GradientBackgroundBlue className='flex-1 flex flex-col p-1'>
                    <CardHeader>
                        <Image
                            style={localStyles.image}
                            source={{ uri: item.photo }}
                            contentFit="contain"
                            transition={1000}
                            className="aspect-square rounded-t-lg"
                        />
                    </CardHeader>
                    <CardContent className="flex-1 justify-center px-2">
                        <CardTitle className="text-[13px]" numberOfLines={2}>{item.device_name}</CardTitle>
                        <View className="mt-2">
                            <Text className="text-muted-foreground text-sm"><Text className='font-bold text-black'>Modelo:</Text> {'\n'}{item.device_model}</Text>
                            <Text className="text-muted-foreground text-sm"><Text className='font-bold text-black'>Fabricante:</Text> {'\n'}{item.factory_family}</Text>
                            <Text className="text-muted-foreground text-sm">
                                <Text className='font-bold text-black'>Estatus:{'\n'}</Text> <Text className={statusColor}>{statusText}</Text>
                            </Text>
                        </View>
                    </CardContent>
                </GradientBackgroundBlue>
            </View>
        </Card>
    );
});