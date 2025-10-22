
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomShapeDivider } from '@/components/ui/shapers/BottomShapeDivider';
import { TopShapeDivider } from '@/components/ui/shapers/TopShapeDivider';
import { User } from '@/types/auth';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const localStyles = StyleSheet.create({
    image: {
        marginTop: "30%",
        width: "100%",
        height: 100,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: "5%"
    },
});

export default function LoginScreen() {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const validateEmail = (text: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(text);
    };
    const handleEmailBlur = () => {
        if (email && !validateEmail(email)) {
            setEmailError('Por favor, introduce un email válido.');
        } else {
            setEmailError(null);
        }
    };
    const handleLogin = async () => {
        if (loading) return;
        handleEmailBlur();
        if (!validateEmail(email) || password.length === 0) {
            if (!validateEmail(email)) setEmailError('Por favor, introduce un email válido.');
            if (password.length === 0) setError('Debe introducir todos los datos solicitados');
            return;
        }
        setLoading(true);
        setError(null);

        try {

            const rawResponse = await fetch("https://api.qa.myintelli.net/v1/login",
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({ email: email.toLowerCase(), password })
                })
            const content = await rawResponse.json()
            if (content?.error) {
                setError(content?.error);
                return
            }
            if (!content?.token) {
                setError("Error, no se pudo obtener una session valida");
                return
            }
            if (content?.error === 'Unauthorized') {
                setError("Crecendiales Invalidas")
                return
            }
            const UserData: User = { email: content?.user?.email, fullName: `${content?.user?.first_name.charAt(0).toUpperCase() + content?.user?.first_name.slice(1).toLowerCase()} ${content?.user?.last_name.charAt(0).toUpperCase() + content?.user?.last_name.slice(1).toLowerCase()}`, modulos: content?.modules }
            await login(content.token, UserData);

        } catch (e: any) {
            setError(e.message || 'Ocurrió un error. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex min-h-[100%]">
            <View className="flex min-h-[100%] bg-background p-4">
                <TopShapeDivider />
                <Image
                    style={localStyles.image}
                    source={require('@/assets/images/LogoMyintelli.webp')}
                    contentFit="contain"
                    transition={1000}
                />
                <View className='card text-card-foreground border-primary border-[1px] rounded-3xl overflow-hidden'>
                    <GradientBackground className="px-2 py-10 rounded-3xl">
                        <View className="mb-10">
                            <Text className="text-4xl font-bold text-foreground text-center">
                                Bienvenido
                            </Text>
                            <Text className="text-lg text-primary text-center mt-2">
                                Inicia sesión para continuar
                            </Text>
                        </View>
                        <View className="gap-y-4">
                            <Input
                                className={`
                                border-input 
                                 focus-visible:ring-ring
                                focus-visible:ring-ring
                                ${emailError ? 'border-destructive' : 'border-input'} 
                                `}
                                placeholder="email@ejemplo.com"
                                onBlur={handleEmailBlur}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                            {emailError && (
                                <Text className="text-destructive ml-3">{emailError}</Text>
                            )}
                            <View className="flex-row items-center border border-input rounded-md overflow-hidden focus-visible:ring-ring">
                                <Input
                                    className="flex-1 border-0 rounded-none h-10 placeholder:text-muted-foreground"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <Pressable onPress={togglePasswordVisibility} className="p-2 bg-background">
                                    <Feather
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color="#A1A1AA"
                                    />
                                </Pressable>
                            </View>
                        </View>

                        {error && (
                            <Text className="text-destructive ml-3 mt-4">{error}</Text>
                        )}

                        <View className="mt-6">
                            <Button className="hover:bg-primary/90 bg-primary text-primary-foreground ring-primary" onPress={handleLogin} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-semibold text-lg">Iniciar Sesión</Text>
                                )}
                            </Button>
                        </View>
                        <View className="mt-8 flex-row justify-center">
                            <Text className="text-muted-foreground">¿No tienes cuenta? </Text>
                            <Link href={'/register'} asChild>
                                <Pressable>
                                    <Text className="font-semibold text-primary">Regístrate</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </GradientBackground>
                </View>
                <BottomShapeDivider />
            </View>
        </SafeAreaView>
    );
}