import { PublicApiItem } from '@/types/api';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './card';

const localStyles = StyleSheet.create({
    image: {
        width: "100%",
        height: 100,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 2,
    },
});
interface CharacterCardProps {
    item: PublicApiItem;
    onPress: () => void;
}

export const CharacterCard = React.memo(
    function CharacterCardOpti({ item, onPress }: CharacterCardProps) {
        return (
            <Pressable onPress={onPress} className="w-[45%] m-2">
                <Card className="overflow-hidden">
                    <CardHeader className="p-0">
                        <View className="rounded overflow-hidden">
                            <Image
                                source={{ uri: item.image }}
                                contentFit="contain"
                                style={localStyles.image}
                            />
                        </View>
                    </CardHeader>
                    <CardContent className="p-3">
                        <CardTitle className="text-sm text-center" numberOfLines={2}>{item.name}</CardTitle>
                    </CardContent>
                </Card>
            </Pressable>
        );
    });