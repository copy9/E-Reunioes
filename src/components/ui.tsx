import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import type { IconName } from '../data/seed';

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type ButtonVariant = 'primary' | 'outline' | 'success' | 'disabled';

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const isDisabled = disabled || variant === 'disabled';
  const variantStyle =
    variant === 'outline'
      ? styles.btnOutline
      : variant === 'success'
        ? styles.btnSuccess
        : variant === 'disabled'
          ? styles.btnDisabled
          : styles.btnPrimary;
  const textStyle = variant === 'outline' ? styles.btnOutlineText : styles.btnText;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      style={({ pressed }) => [styles.btn, variantStyle, pressed && !isDisabled && styles.pressed, style]}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function Badge({ label, tone = 'gold' }: { label: string; tone?: 'gold' | 'navy' }) {
  return (
    <View style={[styles.badge, tone === 'navy' ? styles.badgeNavy : styles.badgeGold]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

export function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const items = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return 'star';
    if (i === full && half) return 'star-half';
    return 'star-outline';
  });
  return (
    <View style={styles.starsRow}>
      {items.map((name, i) => (
        <Ionicons key={i} name={name as IconName} size={16} color={colors.gold} />
      ))}
      <Text style={styles.ratingText}>{value.toFixed(1)}</Text>
    </View>
  );
}

// Barra inferior do dashboard, como no mockup.
export function BottomNav({ active }: { active: 'home' | 'events' | 'create' | 'meetings' | 'profile' }) {
  const insets = useSafeAreaInsets();
  const items: { key: typeof active; icon: IconName; route: Href }[] = [
    { key: 'home', icon: 'home-outline', route: '/home' },
    { key: 'events', icon: 'notifications-outline', route: '/events' },
    { key: 'create', icon: 'add-circle-outline', route: '/create-meeting' },
    { key: 'meetings', icon: 'calendar-outline', route: '/my-meetings' },
    { key: 'profile', icon: 'person-outline', route: '/login' },
  ];
  return (
    <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {items.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => (item.key === active ? undefined : router.navigate(item.route))}
          style={styles.navItem}
          hitSlop={8}
        >
          <Ionicons
            name={item.icon}
            size={26}
            color={item.key === active ? colors.gold : colors.white}
          />
        </Pressable>
      ))}
    </View>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },
  btn: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: colors.navy },
  btnSuccess: { backgroundColor: colors.gold },
  btnOutline: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.navy },
  btnDisabled: { backgroundColor: colors.border },
  btnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  btnOutlineText: { color: colors.navy, fontWeight: '700', fontSize: 15 },
  pressed: { opacity: 0.8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.navy,
    backgroundColor: colors.white,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: colors.navy },
  chipText: { color: colors.navy, fontWeight: '600' },
  chipTextSelected: { color: colors.white },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, alignSelf: 'flex-start' },
  badgeGold: { backgroundColor: colors.gold },
  badgeNavy: { backgroundColor: colors.navy },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { color: colors.muted, marginLeft: 6, fontSize: 13 },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.navy,
    paddingTop: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: { padding: 6 },
  empty: { padding: 24, alignItems: 'center' },
  emptyText: { color: colors.muted, textAlign: 'center' },
});
