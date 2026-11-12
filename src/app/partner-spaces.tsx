import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge, Button, Card, Stars } from '../components/ui';
import { spaces, type Space } from '../data/seed';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

export default function PartnerSpaces() {
  const { bookedSpaces, couponSpaces, bookSpace, applyCoupon } = useApp();

  const book = (space: Space) => {
    bookSpace(space.id);
    Alert.alert('Espaço reservado', `${space.name} foi reservado para a sua reunião.`);
  };

  const redeemCoupon = (space: Space) => {
    if (!space.discount) {
      Alert.alert('Sem cupom', `${space.name} não tem cupom disponível no momento.`);
      return;
    }
    applyCoupon(space.id);
    Alert.alert('Cupom aplicado', `${space.discount} foi aplicado em ${space.name}.`);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {spaces.map((space) => {
        const booked = bookedSpaces.includes(space.id);
        const coupon = couponSpaces.includes(space.id);
        return (
          <Card key={space.id}>
            <View style={styles.header}>
              <Text style={styles.name}>{space.name}</Text>
              {space.premium && <Badge label="Espaço Premium" />}
            </View>
            <Stars value={space.rating} />
            <Text style={styles.address}>{space.address}</Text>
            {space.discount && (
              <View style={styles.discount}>
                <Badge label={space.discount} tone="navy" />
              </View>
            )}
            {coupon && <Text style={styles.applied}>Cupom aplicado</Text>}
            <View style={styles.actions}>
              <Button
                title={booked ? 'Reservado' : 'Reservar Espaço'}
                variant={booked ? 'disabled' : 'primary'}
                disabled={booked}
                onPress={() => book(space)}
                style={styles.action}
              />
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  name: { color: colors.navy, fontSize: 17, fontWeight: '700', flexShrink: 1 },
  address: { color: colors.muted, marginTop: 6, marginBottom: 8 },
  discount: { marginBottom: 8 },
  applied: { color: colors.gold, fontWeight: '700', marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  action: { flex: 1 },
});
