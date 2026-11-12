import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomNav, Badge, Button, Card, EmptyState } from '../components/ui';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

const statusLabel: Record<string, string> = { pendente: 'Pendente', aceita: 'Aceito', recusada: 'Recusado' };

export default function Notifications() {
  const { invitations, meetings, respondInvitation } = useApp();
  const pending = invitations.filter((i) => i.status === 'pendente');
  const answered = invitations.filter((i) => i.status !== 'pendente');
  const today = meetings.filter((m) => m.group === 'hoje');

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>CONVITES</Text>
        {pending.length === 0 && <EmptyState text="Nenhum convite pendente." />}
        {pending.map((inv) => (
          <Card key={inv.id}>
            <Text style={styles.from}>{inv.from} convidou você</Text>
            <Text style={styles.title}>{inv.title}</Text>
            <Text style={styles.meta}>
              {inv.date} às {inv.time} · {inv.place}
            </Text>
            <View style={styles.actions}>
              <Button title="Recusar" variant="outline" style={styles.action} onPress={() => respondInvitation(inv.id, false)} />
              <Button title="Aceitar" style={styles.action} onPress={() => respondInvitation(inv.id, true)} />
            </View>
          </Card>
        ))}

        {answered.length > 0 && (
          <>
            <Text style={styles.section}>RESPONDIDOS</Text>
            {answered.map((inv) => (
              <Card key={inv.id}>
                <View style={styles.answeredRow}>
                  <View style={styles.flex}>
                    <Text style={styles.title}>{inv.title}</Text>
                    <Text style={styles.meta}>{inv.from}</Text>
                  </View>
                  <Badge label={statusLabel[inv.status]} tone={inv.status === 'aceita' ? 'navy' : 'gold'} />
                </View>
              </Card>
            ))}
          </>
        )}

        <Text style={styles.section}>AVISOS</Text>
        {today.length === 0 && <EmptyState text="Nenhum aviso para hoje." />}
        {today.map((m) => (
          <Card key={m.id}>
            <Text style={styles.title}>Lembrete de hoje</Text>
            <Text style={styles.meta}>
              {m.title} às {m.time} · {m.place}
            </Text>
          </Card>
        ))}
      </ScrollView>
      <BottomNav active="notifications" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 24 },
  section: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginTop: 8, marginBottom: 8 },
  from: { color: colors.gold, fontWeight: '700', fontSize: 13 },
  title: { color: colors.navy, fontSize: 16, fontWeight: '700', marginTop: 4 },
  meta: { color: colors.muted, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  action: { flex: 1 },
  answeredRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex: { flex: 1 },
});
