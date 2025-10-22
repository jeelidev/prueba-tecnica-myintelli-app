
import { cn } from '@/lib/utils';
import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';

export const AnimatedHeaderTitle = ({ children, noMargin = false, className }: { children: any, noMargin?: boolean, className?: string }) => {

    return (
        <View style={{ marginRight: "auto", marginLeft: noMargin ? 0 : 20 }}>
            {children && (
                <Animated.Text
                    key={children}
                    entering={FadeInLeft.duration(300).delay(100)}
                    exiting={FadeOutRight.duration(200)}
                    className={cn(
                        'text-lg font-bold text-foreground',
                        className
                    )}
                    numberOfLines={1}
                >
                    {children}
                </Animated.Text>
            )}
        </View>
    );
};