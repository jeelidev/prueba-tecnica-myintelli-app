
export interface ProtectedApiItem {
    id_device: string;
    device_name: string;
    device_model: string;
    factory_family: string;
    hasGroups: boolean;
    status: string | null;
    photo: string;
}

export interface PublicApiItem {
    id: number;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    image: string;
    url: string;
}
export interface ApiInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

export interface CharacterDetails extends PublicApiItem {
    gender: string;
    origin: { name: string; url: string };
    location: { name: string; url: string };
    episode: string[];
}