import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export const DeviceCardSkeleton = () => {
    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1, // Bucle infinito
            true // Revertir la animación
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <Animated.View style={animatedStyle} className="relative m-2 bg-muted p-1 w-[45%] rounded-2xl min-h-[310px]">
            <View className="rounded-xl overflow-hidden p-1">
                <View className="aspect-square rounded-t-lg bg-muted-foreground/30" />
                <View className="px-2 mt-2">
                    <View className="h-4 w-3/4 bg-muted-foreground/30 rounded-md mb-2" />
                    <View className="h-3 w-1/2 bg-muted-foreground/30 rounded-md mb-1" />
                    <View className="h-3 w-2/3 bg-muted-foreground/30 rounded-md mb-1" />
                    <View className="h-3 w-1/3 bg-muted-foreground/30 rounded-md" />
                </View>
            </View>
        </Animated.View>
    );
};