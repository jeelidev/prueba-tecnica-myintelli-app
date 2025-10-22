import { Button } from '@/components/ui/button';
import { CharacterCard } from '@/components/ui/CharacterCard';
import { Input } from '@/components/ui/input';
import { ApiInfo, PublicApiItem } from '@/types/api';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

export default function PublicApiScreen() {
    const router = useRouter();
    const [items, setItems] = useState<PublicApiItem[]>([]);
    const [info, setInfo] = useState<ApiInfo | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (page: number, search: string) => {
        setIsLoading(true);
        setError(null);
        try {
            let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
            if (search) {
                url += `&name=${search}`;
            }

            const response = await fetch(url);
            const content = await response.json();

            if (content.error) {
                throw new Error(content.error);
            }

            setItems(content.results || []);
            setInfo(content.info || null);
            setCurrentPage(page);
        } catch (e: any) {
            setError(e.message);
            setItems([]);
            setInfo(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(1, debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchData]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && (!info || newPage <= info.pages)) {
            fetchData(newPage, debouncedSearchTerm);
        }
    };

    const handleViewDetails = (characterId: number) => {
        router.push(`/character/${characterId}`);
    };

    const renderPagination = () => (
        <View className="flex-row justify-between items-center my-4 px-2">
            <Button onPress={() => handlePageChange(currentPage - 1)} disabled={!info?.prev || isLoading}>
                <Text className="text-primary-foreground">Anterior</Text>
            </Button>
            <Text className="text-foreground">{`Página ${currentPage} de ${info?.pages || 1}`}</Text>
            <Button onPress={() => handlePageChange(currentPage + 1)} disabled={!info?.next || isLoading}>
                <Text className="text-primary-foreground">Siguiente</Text>
            </Button>
        </View>
    );

    return (
        <View className="flex-1 bg-background p-4">
            <View className="flex-row items-center border border-input rounded-md p-2 mb-4">
                <Feather name="search" size={20} color="#A1A1AA" />
                <Input
                    placeholder="Buscar personaje..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    className="flex-1 border-0 h-full ml-2 p-0"
                />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" className="flex-1" />
            ) : error ? (
                <Text className="text-destructive text-center mt-10">{error}</Text>
            ) : (
                <FlatList
                    data={items}
                    renderItem={({ item }) => (
                        <CharacterCard item={item} onPress={() => handleViewDetails(item.id)} />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    ListFooterComponent={renderPagination}
                    ListEmptyComponent={() => (
                        <Text className="text-center text-muted-foreground mt-10">No se encontraron resultados.</Text>
                    )}
                />
            )}
        </View>
    );
}