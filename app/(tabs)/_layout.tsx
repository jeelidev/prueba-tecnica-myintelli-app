import { Avatar } from '@/components/ui/Avatar';
import { CollapsibleModuleItem } from '@/components/ui/CollapsibleModuleItem';
import { AnimatedHeaderTitle } from '@/components/ui/TitleStackHeader';
import { useAuth } from '@/context/AuthContext';
import { FormattedModule, Page } from '@/types/auth';
import { Link, Stack, usePathname } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const SidebarLink = React.memo(function Optilinks({ href, label, onClose }: { href: string; label: string; onClose: () => void; }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const handlePress = () => {
    onClose();
  };

  return (
    <Link href={href as any} asChild>
      <Pressable onPress={handlePress}>
        <View className={`p-2 shadow-lg rounded-[40px] ${isActive ? 'bg-primary' : 'bg-muted'}`}>
          <Text className={`text-foreground ${isActive ? 'text-white	' : 'text-foreground'} text-base`}>{label}</Text>
        </View>
      </Pressable>
    </Link>
  );
});


const ModuleList = React.memo(function ModuleListOpti({ modules, onPagePress }: { modules: FormattedModule[]; onPagePress: (page: Page) => void; }) {

  console.log('Renderizando ModuleList...');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const handleModuleToggle = (moduleId: string) => {
    setExpandedModuleId(currentId => (currentId === moduleId ? null : moduleId));
  };


  return (
    <View className="flex-1">
      <Text className="text-xs font-semibold text-primary mb-2 mt-4 px-6">MÓDULOS</Text>
      <ScrollView className="px-4">
        {modules.map((module) => (
          <CollapsibleModuleItem
            key={`${module.name}-${module.id}`}
            module={module}
            onPagePress={onPagePress}
            isExpanded={expandedModuleId === module.id}
            onToggle={() => handleModuleToggle(module.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
});


const SIDEBAR_WIDTH = 256;

// --- Componente del Sidebar ---

const Sidebar = React.memo(function SidebarOpti({ onClose }: { onClose: () => void }) {
  const { session, logout } = useAuth();

  const formattedModules = useMemo<FormattedModule[]>(() => {
    if (!session.user?.modulos) return [];

    const emojis = ["📸", "🌎", "🗺️", "🧳", "📅", "🔧", "💰", "🏡", "🎵", "🖼️", "✍️", "🎨", "🤝", "🧠", "🎯", "💼", "🌟", "🍏", "📔", "🏠"];
    const getRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

    return session.user.modulos.map((mod: any) => ({
      id: mod.id_module,
      name: mod.module as string,
      emoji: getRandomEmoji(),
      pages: Object.entries(mod.setting_module_config).map(([key, value]) => ({
        name: `${key} - ${value}`,
        url: "#",
        emoji: getRandomEmoji(),
      })),
    }));
  }, [session.user?.modulos]);

  const handleNavigate = useCallback((page?: Page) => {
    onClose();
  }, [onClose]);

  if (!session.user) {
    return <ActivityIndicator />;
  }


  return (
    <View className="w-full h-full bg-card justify-between pb-8">
      <View className="flex-row items-center gap-3 mb-[20px] bg-primary p-4 pt-6">
        <Avatar
          imageUrl="https://avatars.githubusercontent.com/u/229787899?v=4&size=64"
          fallbackText={session.user.fullName}
          size={38}
        />
        <View className="flex-1 overflow-hidden">
          <Text
            className="font-bold text-foreground text-base"
            numberOfLines={1}
          >
            {session.user.fullName}
          </Text>
          <Text
            className="text-sm text-muted"
            numberOfLines={1}
          >
            {session.user.email}
          </Text>
        </View>
      </View>
      <View className="gap-y-2 p-4">
        <Text className="text-xs font-semibold text-primary px-2 mb-2">SECCIONES</Text>
        <SidebarLink href="/" label="Dashboard" onClose={onClose} />
        <SidebarLink href="/protectedApi" label="Api Devices" onClose={onClose} />
        <SidebarLink href="/publicApi" label="Api Rick y morty" onClose={onClose} />
      </View>
      <ModuleList modules={formattedModules} onPagePress={handleNavigate} />
      <View className="px-4">
        <Pressable onPress={logout}>
          <View className="bg-secondary-foreground p-3 rounded-md">
            <Text className="text-accent text-center font-bold">Cerrar Sesión</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
})

const localStyles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#fff',
    height: 80,
  }
});
// --- Layout Principal para las Pestañas ---
export default function TabsLayout() {
  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const overlayOpacity = useSharedValue(0);

  const animatedOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
      pointerEvents: overlayOpacity.value > 0 ? 'auto' : 'none',
    };
  });

  const animatedSidebarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const openSidebar = React.useCallback(() => {
    translateX.value = withTiming(0, { duration: 250 });
    overlayOpacity.value = withTiming(1, { duration: 250 });
  }, []);

  const closeSidebar = React.useCallback(() => {
    translateX.value = withTiming(-SIDEBAR_WIDTH, { duration: 250 });
    overlayOpacity.value = withTiming(0, { duration: 250 });
  }, []);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1">
        <Stack
          screenOptions={{
            headerShown: true,
            headerStyle: localStyles.headerStyle,
            headerTintColor: '#000',
            headerTitle: ({ children }) => <AnimatedHeaderTitle>{children}</AnimatedHeaderTitle>,
          }}
        >
          <Stack.Screen name="index" options={{
            title: '', headerLeft: () => (
              <Pressable onPress={openSidebar} className="ml-2">
                <View className="gap-y-1">
                  <View className="h-1 w-6 bg-foreground rounded-full" />
                  <View className="h-1 w-6 bg-foreground rounded-full" />
                  <View className="h-1 w-6 bg-foreground rounded-full" />
                </View>
              </Pressable>
            ),
          }} />
          <Stack.Screen name="protectedApi" options={{
            title: 'API de Dispositivos',
            headerStyle: styles.headerApiPrivada,
            headerTintColor: '#cdcdfe',
            headerTitle: ({ children }) => <AnimatedHeaderTitle className='text-accent' >{children}</AnimatedHeaderTitle>,
            headerLeft: () => (
              <Pressable onPress={openSidebar} className="ml-2">
                <View className="gap-y-1">
                  <View className="h-1 w-6 bg-accent rounded-full" />
                  <View className="h-1 w-6 bg-accent rounded-full" />
                  <View className="h-1 w-6 bg-accent rounded-full" />
                </View>
              </Pressable>
            ),
          }} />
          <Stack.Screen name="publicApi" options={{
            title: 'API de Rick y Morty',
            headerStyle: styles.headerApiRickMorty,
            headerTitle: ({ children }) => <AnimatedHeaderTitle className='text-white' >{children}</AnimatedHeaderTitle>,
            headerLeft: () => (
              <Pressable onPress={openSidebar} className="ml-2">
                <View className="gap-y-1">
                  <View className="h-1 w-6 bg-white rounded-full" />
                  <View className="h-1 w-6 bg-white rounded-full" />
                  <View className="h-1 w-6 bg-white rounded-full" />
                </View>
              </Pressable>
            ),
          }} />
          <Stack.Screen name="character/[id]" options={{ presentation: 'modal', title: 'Cargando...' }} />
        </Stack>
      </View>

      <Animated.View style={[StyleSheet.absoluteFill, animatedOverlayStyle]}>
        <Pressable onPress={closeSidebar} style={styles.pressableOverlay}>
          <View style={styles.overlayBackground} />
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.sidebarContainer, animatedSidebarStyle]}>
        <Sidebar onClose={closeSidebar} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressableOverlay: {
    flex: 1,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
  },
  headerApiRickMorty: {
    backgroundColor: '#498708',
    color: "#fff"
  },
  headerApiPrivada: {
    backgroundColor: '#7166E4',
    color: "#fff"
  }
})