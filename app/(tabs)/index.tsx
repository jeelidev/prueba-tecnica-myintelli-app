import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BottomShapeDivider } from '@/components/ui/shapers/BottomShapeDivider';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';


export default function HomeScreen() {
  const { session } = useAuth();

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 bg-background">
        <View className="p-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Bienvenido de vuelta, {session.user?.fullName}!
          </Text>
          <Text className="text-lg text-primary mb-8">
            Aquí tienes un resumen de tu actividad.
          </Text>

          <View className="gap-y-4">
            <Card className='gap-4'>
              <CardHeader >
                <CardTitle >Módulos Disponibles</CardTitle>
              </CardHeader>
              <CardContent className='gap-3' >
                <Text className="text-foreground">
                  Tienes acceso a {session.user?.modulos.length} módulos. Puedes ver cuales son y sus configuraciones usando el
                  panel lateral.
                </Text>
                <Text className="text-secondary-foreground">
                  PARA CERRAR SESION HAGA CLICK EN EL MENU LATERAL
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de la Sesión</CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="text-foreground break-words">
                  <Text className="font-bold">Email:</Text> {session.user?.email}
                </Text>
                <Text className="text-foreground break-words mt-2">
                  <Text className="font-bold">Token:</Text> {session.token?.substring(0, 30)}...
                </Text>
              </CardContent>
            </Card>
          </View>
        </View>
      </ScrollView>
      <BottomShapeDivider />
    </View>
  );
}