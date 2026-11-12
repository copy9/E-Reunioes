import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Button, Card, Chip, EmptyState, Stars } from '../components/ui';
import { ambients, spaces } from '../data/seed';
import { menu, venueInfo } from '../data/trust';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

const DISCOUNT = 0.1; // 10% com o cupom do parceiro
const hourOptions = [1, 2, 3, 4];

export default function SpaceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { couponSpaces, applyCoupon, createBooking, isVerified } = useApp();
  const space = spaces.find((s) => s.id === id);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [hours, setHours] = useState(1);
  const [ambientId, setAmbientId] = useState(ambients[0].id);
  const [extras, setExtras] = useState<string[]>([]);

  if (!space) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ title: 'Espaço' }} />
        <EmptyState text="Espaço não encontrado." />
      </View>
    );
  }

  const info = venueInfo[space.id];
  const ambient = ambients.find((a) => a.id === ambientId) ?? ambients[0];
  const couponApplied = couponSpaces.includes(space.id);
  const base = space.pricePerHour * hours * ambient.multiplier;
  const extrasTotal = menu.filter((m) => extras.includes(m.id)).reduce((sum, m) => sum + m.price, 0);
  const discounted = couponApplied && !!space.discount ? base * (1 - DISCOUNT) : base;
  const total = discounted + extrasTotal;

  const toggleExtra = (itemId: string) =>
    setExtras((prev) => (prev.includes(itemId) ? prev.filter((x) => x !== itemId) : [...prev, itemId]));

  const useCoupon = () => {
    if (!space.discount) {
      Alert.alert('Sem cupom', `${space.name} não tem cupom disponível no momento.`);
      return;
    }
    applyCoupon(space.id);
    Alert.alert('Cupom aplicado', `${space.discount}: 10% de desconto no total.`);
  };

  const reserve = () => {
    if (!isVerified) {
      Alert.alert(
        'Verificação necessária',
        'Para reservar, confirme sua identidade. Isso garante encontros seguros para todos.',
        [
          { text: 'Agora não', style: 'cancel' },
          { text: 'Verificar', onPress: () => router.push('/verify-identity') },
        ],
      );
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(date)) {
      Alert.alert('Data inválida', 'Use o formato dd/mm.');
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      Alert.alert('Horário inválido', 'Use o formato HH:mm.');
      return;
    }
    const extraNames = menu.filter((m) => extras.includes(m.id)).map((m) => m.name);
    createBooking({
      id: `bk${Date.now()}`,
      spaceId: space.id,
      spaceName: space.name,
      date,
      time,
      hours,
      ambient: ambient.label,
      total: Math.round(total),
      couponApplied: couponApplied && !!space.discount,
      status: 'pendente',
    });
    Alert.alert(
      'Reserva enviada',
      `${space.name} vai confirmar a sua reserva.${extraNames.length ? ` Consumo previsto: ${extraNames.join(', ')}.` : ''}`,
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: space.name }} />
      <Card>
        <View style={styles.header}>
          <Text style={styles.name}>{space.name}</Text>
          {space.premium && <Badge label="Espaço Premium" />}
        </View>
        <Stars value={space.rating} />
        <Text style={styles.address}>{space.address}</Text>
        <Text style={styles.price}>R$ {space.pricePerHour} por hora (mesa privativa)</Text>
        {info?.verified && (
          <View style={styles.verified}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.gold} />
            <Text style={styles.verifiedText}>Estabelecimento verificado</Text>
          </View>
        )}
        {space.discount && (
          <View style={styles.discount}>
            <Badge label={space.discount} tone="navy" />
          </View>
        )}
      </Card>

      {info && (
        <Card>
          <Text style={styles.section}>Segurança e estrutura</Text>
          {info.safety.map((item) => (
            <Text key={item} style={styles.line}>• {item}</Text>
          ))}
        </Card>
      )}

      {info && info.reviews.length > 0 && (
        <Card>
          <Text style={styles.section}>Avaliações de quem já se encontrou aqui</Text>
          {info.reviews.map((r) => (
            <View key={r.author} style={styles.review}>
              <Text style={styles.reviewAuthor}>{r.author} · {r.stars}/5</Text>
              <Text style={styles.line}>{r.text}</Text>
            </View>
          ))}
        </Card>
      )}

      {!isVerified && (
        <Card style={styles.gate}>
          <Text style={styles.gateText}>Você precisa verificar sua identidade para reservar.</Text>
          <Button title="Verificar identidade" variant="outline" style={styles.action} onPress={() => router.push('/verify-identity')} />
        </Card>
      )}

      <Text style={styles.label}>Data</Text>
      <TextInput style={styles.input} placeholder="dd/mm" placeholderTextColor={colors.muted} keyboardType="numbers-and-punctuation" maxLength={5} value={date} onChangeText={setDate} />

      <Text style={styles.label}>Horário de início</Text>
      <TextInput style={styles.input} placeholder="HH:mm" placeholderTextColor={colors.muted} keyboardType="numbers-and-punctuation" maxLength={5} value={time} onChangeText={setTime} />

      <Text style={styles.label}>Duração</Text>
      <View style={styles.row}>
        {hourOptions.map((h) => (
          <Chip key={h} label={`${h}h`} selected={hours === h} onPress={() => setHours(h)} />
        ))}
      </View>

      <Text style={styles.label}>Ambiente</Text>
      <View style={styles.row}>
        {ambients.map((a) => (
          <Chip key={a.id} label={a.label} selected={ambientId === a.id} onPress={() => setAmbientId(a.id)} />
        ))}
      </View>

      <Text style={styles.label}>Pedir no local (opcional)</Text>
      <View style={styles.row}>
        {menu.map((item) => (
          <Chip
            key={item.id}
            label={`${item.name} · R$ ${item.price}`}
            selected={extras.includes(item.id)}
            onPress={() => toggleExtra(item.id)}
          />
        ))}
      </View>

      <Card style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total estimado</Text>
        <Text style={styles.total}>R$ {Math.round(total)}</Text>
        {couponApplied && space.discount && <Text style={styles.applied}>Cupom aplicado (10%)</Text>}
      </Card>

      <Button title={couponApplied ? 'Cupom aplicado' : 'Usar Cupom'} variant="outline" disabled={couponApplied} onPress={useCoupon} />
      <Button title="Reservar Espaço" onPress={reserve} style={styles.submit} variant={isVerified ? 'primary' : 'disabled'} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  name: { color: colors.navy, fontSize: 20, fontWeight: '700', flexShrink: 1 },
  address: { color: colors.muted, marginTop: 6 },
  price: { color: colors.text, marginTop: 6, fontWeight: '600' },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  verifiedText: { color: colors.gold, fontWeight: '700' },
  discount: { marginTop: 8 },
  section: { color: colors.navy, fontWeight: '700', marginBottom: 8 },
  line: { color: colors.text, fontSize: 14, marginBottom: 4, lineHeight: 20 },
  review: { marginBottom: 10 },
  reviewAuthor: { color: colors.navy, fontWeight: '700', marginBottom: 2 },
  gate: { marginTop: 14, borderColor: colors.gold, borderWidth: 1.5 },
  gateText: { color: colors.text, fontWeight: '600' },
  action: { marginTop: 10 },
  label: { color: colors.navy, fontWeight: '700', marginTop: 14, marginBottom: 8 },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  totalCard: { marginTop: 18, alignItems: 'center' },
  totalLabel: { color: colors.muted },
  total: { color: colors.navy, fontSize: 26, fontWeight: '700', marginTop: 4 },
  applied: { color: colors.gold, fontWeight: '700', marginTop: 6 },
  submit: { marginTop: 12 },
});
