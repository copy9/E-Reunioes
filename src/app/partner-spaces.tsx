import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Button, Card, Chip, Stars } from '../components/ui';
import { spaces, type Space } from '../data/seed';
import { venueInfo } from '../data/trust';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

type Filter = 'todos' | 'verificados' | 'avaliados';

const filters: { key: Filter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'verificados', label: 'Verificados' },
  { key: 'avaliados', label: 'Mais bem avaliados' },
];

export default function PartnerSpaces() {
  const { couponSpaces, applyCoupon } = useApp();
  const [filter, setFilter] = useState<Filter>('todos');

  const visible = useMemo(() => {
    const list = [...spaces];
    if (filter === 'verificados') return list.filter((s) => venueInfo[s.id]?.verified);
    if (filter === 'avaliados') return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [filter]);

  const redeemCoupon = (space: Space) => {
    if (!space.discount) {
      Alert.alert('Sem cupom', `${space.name} não tem cupom disponível no momento.`);
      return;
    }
    applyCoupon(space.id);
    Alert.alert('Cupom aplicado', `${space.discount} foi aplicado em ${space.name}.`);
  };

  const openSpace = (space: Space) => router.push({ pathname: '/space-details', params: { id: space.id } });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Espaços Parceiros' }} />
      <View style={styles.filters}>
        {filters.map((f) => (
          <Chip key={f.key} label={f.label} selected={filter === f.key} onPress={() => setFilter(f.key)} />
        ))}
      </View>

      {visible.map((space) => {
        const coupon = couponSpaces.includes(space.id);
        const info = venueInfo[space.id];
        return (
          <Card key={space.id}>
            <Pressable onPress={() => openSpace(space)}>
              <View style={styles.header}>
                <Text style={styles.name}>{space.name}</Text>
                {space.premium && <Badge label="Espaço Premium" />}
              </View>
              {info?.verified && (
                <View style={styles.verified}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={colors.gold} />
                  <Text style={styles.verifiedText}>Verificado</Text>
                </View>
              )}
              <Stars value={space.rating} />
              <Text style={styles.address}>{space.address}</Text>
              <Text style={styles.price}>R$ {space.pricePerHour} por hora</Text>
              {info && info.safety.length > 0 && (
                <Text style={styles.safety}>{info.safety.slice(0, 2).join(' · ')}</Text>
              )}
            </Pressable>
            {space.discount && (
              <View style={styles.discount}>
                <Badge label={space.discount} tone="navy" />
              </View>
            )}
            {coupon && <Text style={styles.applied}>Cupom aplicado</Text>}
            <View style={styles.actions}>
              <Button title="Reservar Espaço" onPress={() => openSpace(space)} style={styles.action} />
              <Button
                title={coupon ? 'Cupom usado' : 'Usar Cupom'}
                variant="outline"
                disabled={coupon}
                onPress={() => redeemCoupon(space)}
                style={styles.action}
              />
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 32 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 8 },
  name: { color: colors.navy, fontSize: 17, fontWeight: '700', flexShrink: 1 },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  verifiedText: { color: colors.gold, fontWeight: '700', fontSize: 13 },
  address: { color: colors.muted, marginTop: 6 },
  price: { color: colors.text, marginTop: 4, fontWeight: '600' },
  safety: { color: colors.muted, marginTop: 6, fontSize: 13 },
  discount: { marginTop: 10 },
  applied: { color: colors.gold, fontWeight: '700', marginTop: 8 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  action: { flex: 1 },
});
