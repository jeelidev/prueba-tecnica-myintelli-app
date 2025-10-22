import { AnimatedHeaderTitle } from '@/components/ui/TitleStackHeader';
import { CharacterDetails as CharacterDetailsType } from '@/types/api';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
const localStyles = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%",
        marginBottom: 2,
    },
    headerStyle: {
        backgroundColor: '#2385F4',
        color: "#fff"
    }
});
export default function CharacterDetailsScreen() {

    const { id } = useLocalSearchParams();

    const [character, setCharacter] = useState<CharacterDetailsType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
                const data = await response.json();
                if (data.error) throw new Error(data.error);
                setCharacter(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (isLoading) {
        return <ActivityIndicator size="large" className="flex-1" />;
    }

    if (error || !character) {
        return <Text className="text-destructive text-center mt-10">{error || "No se pudo cargar el personaje."}</Text>;
    }

    return (
        <ScrollView className="flex-1 bg-background">
            <Stack.Screen options={{
                headerStyle: localStyles.headerStyle,
                headerTintColor: '#cdcdfe',
                headerTitle: () => <AnimatedHeaderTitle noMargin={true} className='text-accent' >{character.name}</AnimatedHeaderTitle>, headerBackTitle: 'Atrás'
            }} />

            <Image
                source={{ uri: character.image }}
                style={localStyles.image}
                contentFit="cover"
            />
            <View className="p-4">

                <Animated.View entering={FadeInUp.duration(500).delay(200)}>
                    <Text className="text-3xl font-bold text-foreground">{character.name}</Text>
                    <Text className="text-lg text-muted-foreground">{character.species} - {character.gender}</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.duration(500).delay(400)} className="mt-4 flex-row items-center">
                    <View className={`w-3 h-3 rounded-full ${character.status === 'Alive' ? 'bg-green-500' : character.status === 'Dead' ? 'bg-red-500' : 'bg-gray-500'}`} />
                    <Text className="text-foreground ml-2">{character.status}</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.duration(500).delay(600)} className="mt-6">
                    <Text className="text-xl font-semibold text-foreground">Origen:</Text>
                    <Text className="text-lg text-muted-foreground">{character.origin.name}</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.duration(500).delay(800)} className="mt-4">
                    <Text className="text-xl font-semibold text-foreground">Última ubicación conocida:</Text>
                    <Text className="text-lg text-muted-foreground">{character.location.name}</Text>
                </Animated.View>
            </View>
        </ScrollView>
    );
}