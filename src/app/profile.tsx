import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { BottomNav, Badge, Button, Card, EmptyState } from '../components/ui';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

const bookingStatusLabel = {
  pendente: 'Aguardando confirmação',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
} as const;

export default function Profile() {
  const { session, meetings, bookings, logout, isVerified } = useApp();
  const myBookings = bookings;

  const signOut = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.name}>{session?.name ?? 'Visitante'}</Text>
          <Text style={styles.type}>
            {session?.type === 'business' ? 'Conta comercial' : 'Conta de usuário'}
          </Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{meetings.length}</Text>
              <Text style={styles.statLabel}>reuniões</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{myBookings.length}</Text>
              <Text style={styles.statLabel}>reservas</Text>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.title}>Verificação de identidade</Text>
              <Text style={styles.meta}>
                {isVerified ? 'Identidade verificada' : 'Necessária para reservar espaços'}
              </Text>
            </View>
            <Badge label={isVerified ? 'Verificado' : 'Pendente'} tone={isVerified ? 'navy' : 'gold'} />
          </View>
          <Button title={isVerified ? 'Ver verificação' : 'Verificar agora'} variant="outline" style={styles.logout} onPress={() => router.push('/verify-identity')} />
        </Card>

        <Text style={styles.section}>MINHAS RESERVAS</Text>
        {myBookings.length === 0 && <EmptyState text="Você ainda não fez reservas." />}
        {myBookings.map((b) => (
          <Card key={b.id}>
            <View style={styles.row}>
              <View style={styles.flex}>
                <Text style={styles.title}>{b.spaceName}</Text>
                <Text style={styles.meta}>
                  {b.date} às {b.time} · {b.hours}h · {b.ambient}
                </Text>
                <Text style={styles.meta}>Total: R$ {b.total}</Text>
              </View>
              <Badge
                label={bookingStatusLabel[b.status]}
                tone={b.status === 'confirmada' ? 'navy' : 'gold'}
              />
            </View>
          </Card>
        ))}

        <Button title="Sair da conta" variant="outline" style={styles.logout} onPress={signOut} />
      </ScrollView>
      <BottomNav active="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 24 },
  name: { color: colors.navy, fontSize: 20, fontWeight: '700' },
  type: { color: colors.gold, fontWeight: '600', marginTop: 2 },
  stats: { flexDirection: 'row', marginTop: 16, gap: 24 },
  stat: { alignItems: 'flex-start' },
  statValue: { color: colors.navy, fontSize: 22, fontWeight: '700' },
  statLabel: { color: colors.muted, fontSize: 13 },
  section: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginTop: 8, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex: { flex: 1 },
  title: { color: colors.navy, fontSize: 16, fontWeight: '700' },
  meta: { color: colors.muted, marginTop: 4 },
  logout: { marginTop: 16 },
});
