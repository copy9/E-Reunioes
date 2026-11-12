import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../store/AppContext';
import { colors } from '../theme/colors';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.navy },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.cream },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ title: 'Criar conta' }} />
        <Stack.Screen name="forgot-password" options={{ title: 'Recuperar senha' }} />
        <Stack.Screen name="home" options={{ title: 'E-Reuniões', headerBackVisible: false }} />
        <Stack.Screen name="partner-dashboard" options={{ title: 'Painel do Parceiro', headerBackVisible: false }} />
        <Stack.Screen name="partner-signup" options={{ title: 'Seja um parceiro' }} />
        <Stack.Screen name="verify-identity" options={{ title: 'Verificação' }} />
        <Stack.Screen name="person-profile" options={{ title: 'Perfil' }} />
        <Stack.Screen name="rate-meeting" options={{ title: 'Avaliar encontro' }} />
        <Stack.Screen name="safety" options={{ title: 'Segurança' }} />
        <Stack.Screen name="notifications" options={{ title: 'Notificações' }} />
        <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
        <Stack.Screen name="create-meeting" options={{ title: 'Criar Reunião' }} />
        <Stack.Screen name="my-meetings" options={{ title: 'Minhas Reuniões' }} />
        <Stack.Screen name="meeting-details" options={{ title: 'Detalhes da Reunião' }} />
        <Stack.Screen name="partner-spaces" options={{ title: 'Espaços Parceiros' }} />
        <Stack.Screen name="space-details" options={{ title: 'Espaço' }} />
        <Stack.Screen name="events" options={{ title: 'Eventos Públicos' }} />
        <Stack.Screen name="event-details" options={{ title: 'Evento' }} />
        <Stack.Screen name="networking" options={{ title: 'Networking Empresarial' }} />
        <Stack.Screen name="company-profile" options={{ title: 'Perfil Empresarial' }} />
      </Stack>
    </AppProvider>
  );
}
