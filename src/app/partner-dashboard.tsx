import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Badge, Button, Card, EmptyState } from '../components/ui';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

// Painel do parceiro: gerencia as reservas recebidas nos espaços.
// Sem backend, mostra todas as reservas do app (demonstração de uma conta comercial).
export default function PartnerDashboard() {
  const { session, bookings, setBookingStatus, logout } = useApp();

  const pending = bookings.filter((b) => b.status === 'pendente');
  const confirmed = bookings.filter((b) => b.status === 'confirmada');
  const revenue = confirmed.reduce((sum, b) => sum + b.total, 0);

  const signOut = () => {
    logout();
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.greeting}>Olá, {session?.name ?? 'parceiro'}</Text>
        <Text style={styles.subtitle}>Painel do parceiro</Text>
        <View style={styles.kpis}>
          <View style={styles.kpi}>
            <Text style={styles.kpiValue}>{pending.length}</Text>
            <Text style={styles.kpiLabel}>pendentes</Text>
          </View>
          <View style={styles.kpi}>
            <Text style={styles.kpiValue}>{confirmed.length}</Text>
            <Text style={styles.kpiLabel}>confirmadas</Text>
          </View>
          <View style={styles.kpi}>
            <Text style={styles.kpiValue}>R$ {revenue}</Text>
            <Text style={styles.kpiLabel}>receita</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.section}>RESERVAS</Text>
      {bookings.length === 0 && <EmptyState text="Nenhuma reserva recebida ainda." />}
      {bookings.map((b) => (
        <Card key={b.id}>
          <View style={styles.header}>
            <Text style={styles.title}>{b.spaceName}</Text>
            <Badge
              label={b.status === 'pendente' ? 'Pendente' : b.status === 'confirmada' ? 'Confirmada' : 'Cancelada'}
              tone={b.status === 'confirmada' ? 'navy' : 'gold'}
            />
          </View>
          <Text style={styles.meta}>
            {b.date} às {b.time} · {b.hours}h · {b.ambient}
          </Text>
          <Text style={styles.meta}>
            Total: R$ {b.total}
            {b.couponApplied ? ' (cupom aplicado)' : ''}
          </Text>
          {b.status === 'pendente' && (
            <View style={styles.actions}>
              <Button title="Recusar" variant="outline" style={styles.action} onPress={() => setBookingStatus(b.id, 'cancelada')} />
              <Button title="Confirmar" style={styles.action} onPress={() => setBookingStatus(b.id, 'confirmada')} />
            </View>
          )}
        </Card>
      ))}

      <Button title="Sair da conta" variant="outline" style={styles.logout} onPress={signOut} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 32 },
  greeting: { color: colors.navy, fontSize: 20, fontWeight: '700' },
  subtitle: { color: colors.gold, fontWeight: '600', marginTop: 2 },
  kpis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  kpi: { alignItems: 'flex-start' },
  kpiValue: { color: colors.navy, fontSize: 18, fontWeight: '700' },
  kpiLabel: { color: colors.muted, fontSize: 12 },
  section: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginTop: 12, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  title: { color: colors.navy, fontSize: 16, fontWeight: '700', flexShrink: 1 },
  meta: { color: colors.muted, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  action: { flex: 1 },
  logout: { marginTop: 16 },
});
