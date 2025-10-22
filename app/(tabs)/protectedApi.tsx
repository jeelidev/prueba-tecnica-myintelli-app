import { Button } from '@/components/ui/button';
import { DeviceCard } from '@/components/ui/DeviceCard';
import { DeviceCardSkeleton } from '@/components/ui/DeviceCardSkeleton';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/lib/utils';
import { ProtectedApiItem } from '@/types/api';
import { Feather } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
const SKELETON_DATA = Array(6).fill(null);

export default function ProtectedApiScreen() {
    const isInitialMount = React.useRef(true);
    const { session } = useAuth();


    const [items, setItems] = useState<ProtectedApiItem[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);


    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms de retraso


    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_LIMIT = 6;

    const fetchData = useCallback(async (currentOffset: number, search: string) => {
        const isLoadMore = currentOffset > 0;
        if (!isLoadMore) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }
        setError(null);
        try {
            let url = `https://api.qa.myintelli.net/v1/devices?limit=${API_LIMIT}&offset=${currentOffset}`;
            if (search) {
                url += `&search=${search}`;
            }

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${session.token}` }
            });
            const content = await response.json();

            if (content.status !== 200) {
                throw new Error(content.message || 'Error desconocido al cargar los datos');
            }

            const results = content.data.results || [];

            setItems(prev => isLoadMore ? [...prev, ...results] : results);
            setOffset(content.data.offset);
            setHasMore(results.length === API_LIMIT);

        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [session.token]);


    useEffect(() => {
        fetchData(0, '');
    }, [fetchData]);


    useEffect(() => {

        if (debouncedSearchTerm !== '' || searchTerm === '') {
            if (isInitialMount.current) {
                isInitialMount.current = false;
                return;
            }
            setItems([]);
            fetchData(0, debouncedSearchTerm);
        }
    }, [debouncedSearchTerm, fetchData]);

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchData(Number(offset) + 6, debouncedSearchTerm);
        }
    };

    const renderFooter = () => {
        if (!hasMore && items.length > 0) {
            return <Text className="text-center text-muted-foreground my-4">No hay más resultados</Text>;
        }
        if (!isLoadingMore) {
            return (
                <View className="items-center my-4">
                    <Button onPress={handleLoadMore} variant="secondary" disabled={!hasMore}>
                        <Text className="text-secondary-foreground font-bold" >Cargar Más</Text>
                    </Button>
                </View>
            );
        }
        return <ActivityIndicator size="large" className="my-4" />;
    };

    if (isLoading && items.length === 0 && !isLoadingMore) {
        return (
            <View className="flex-1 bg-background p-4">
                <View className="flex-row items-center border border-input rounded-md p-2 mb-4">
                    <Feather name="search" size={20} color="#A1A1AA" />
                    <Input
                        placeholder="Buscar dispositivo..."
                        value={searchTerm}
                        editable={false}
                        className="flex-1 border-0 h-full ml-2 p-0"
                    />
                </View>
                <FlatList
                    data={SKELETON_DATA}
                    renderItem={() => <DeviceCardSkeleton />}
                    keyExtractor={(_, index) => `skeleton-${index}`}
                    numColumns={2}
                />
            </View>)
    }

    return (
        <View className="flex-1 bg-background p-4">
            {/* --- Buscador --- */}
            <View className="flex-row items-center border border-input rounded-md p-2 mb-4">
                <Feather name="search" size={20} color="#A1A1AA" />
                <Input
                    placeholder="Buscar dispositivo..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    className="flex-1 border-0 h-full ml-2 p-0"
                />
            </View>

            {error && <Text className="text-destructive text-center">{error}</Text>}

            {/* --- Listar Dispositivos --- */}
            <FlatList
                data={items}
                renderItem={({ item }) => <DeviceCard item={item} />}
                keyExtractor={(item) => item.id_device.toString()}
                numColumns={2}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={() => (
                    !isLoading && <Text className="text-center text-muted-foreground mt-10">No se encontraron resultados.</Text>
                )}
            />
        </View>
    );
}