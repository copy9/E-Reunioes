import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Badge, Button, Card, EmptyState, Stars } from '../components/ui';
import { companies } from '../data/seed';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

export default function CompanyProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { connections, toggleConnect } = useApp();
  const company = companies.find((c) => c.id === id);

  if (!company) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ title: 'Perfil Empresarial' }} />
        <EmptyState text="Empresa não encontrada." />
      </View>
    );
  }

  const connected = connections.includes(company.id);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.name}>{company.name}</Text>
        <Text style={styles.segment}>{company.segment}</Text>
        <Text style={styles.description}>{company.description}</Text>
        <View style={styles.badges}>
          <Badge label={company.tags} tone="navy" />
        </View>
      </Card>

      <Card>
        <Text style={styles.section}>Histórico de Eventos</Text>
        {company.history.map((event) => (
          <Text key={event} style={styles.line}>
            • {event}
          </Text>
        ))}
      </Card>

      <Card>
        <Text style={styles.section}>Avaliações Recebidas</Text>
        <Stars value={company.rating} />
      </Card>

      <Button
        title={connected ? 'Conectado' : 'Conectar'}
        variant={connected ? 'success' : 'primary'}
        onPress={() => toggleConnect(company.id)}
      />
      <Button
        title="Convidar para Reunião"
        variant="outline"
        style={styles.invite}
        onPress={() => router.push({ pathname: '/create-meeting', params: { companyId: company.id } })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 32 },
  name: { color: colors.navy, fontSize: 20, fontWeight: '700' },
  segment: { color: colors.gold, fontWeight: '600', marginTop: 2 },
  description: { color: colors.text, marginTop: 10, fontSize: 15, lineHeight: 21 },
  badges: { marginTop: 10 },
  section: { color: colors.navy, fontWeight: '700', marginBottom: 8 },
  line: { color: colors.text, fontSize: 15, marginBottom: 6 },
  invite: { marginTop: 12 },
});
