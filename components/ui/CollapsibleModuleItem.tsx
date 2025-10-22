
import { FormattedModule, Page } from '@/types/auth';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface CollapsibleModuleItemProps {
    module: FormattedModule;
    onPagePress: (page: Page) => void;
    isExpanded: boolean;
    onToggle: () => void;
}

export const CollapsibleModuleItem = ({ module, onPagePress, isExpanded, onToggle }: CollapsibleModuleItemProps) => {
    const [contentHeight, setContentHeight] = useState(0);
    const animatedHeight = useSharedValue(0);
    const animatedRotation = useSharedValue(0);

    useEffect(() => {
        if (contentHeight > 0) {
            animatedHeight.value = withTiming(isExpanded ? contentHeight : 0, { duration: 250 });
            animatedRotation.value = withTiming(isExpanded ? 90 : 0, { duration: 200 });
        }
    }, [isExpanded, contentHeight]);

    const animatedContainerStyle = useAnimatedStyle(() => ({
        height: animatedHeight.value,
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${animatedRotation.value}deg` }],
    }));

    const isCollapsible = module.pages && module.pages.length > 0;

    return (
        <View className="mb-1 overflow-hidden">
            <Pressable
                onPress={isCollapsible ? onToggle : undefined}
                className="flex-row items-center justify-between p-2 rounded-md hover:bg-accent"
            >
                <View className="flex-row items-center gap-x-2">
                    <Text>{module.emoji}</Text>
                    <Text className="text-foreground font-semibold">{module.name}</Text>
                </View>

                {isCollapsible && (
                    <Animated.View style={animatedIconStyle}>
                        <Feather name="chevron-right" size={18} color="#A1A1AA" />
                    </Animated.View>
                )}
            </Pressable>

            {isCollapsible && (
                <Animated.View style={animatedContainerStyle}>
                    <View
                        style={{ position: 'absolute', width: '100%' }}
                        onLayout={(event) => {
                            const height = event.nativeEvent.layout.height;
                            if (height > 0 && contentHeight === 0) {
                                setContentHeight(height);
                            }
                        }}
                    >
                        {module.pages.map((page, index) => (
                            <Pressable key={`${page.name}-${index}`} onPress={() => onPagePress(page)} className="flex-row items-center gap-x-2 p-2 rounded-md hover:bg-accent/50">
                                <Text className="text-sm">{page.emoji}</Text>
                                <Text className="text-muted-foreground text-sm flex-1">{page.name}</Text>
                            </Pressable>
                        ))}
                    </View>
                </Animated.View>
            )}
        </View>
    );
};