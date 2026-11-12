// Dados de confiança e reputação. Valores de exemplo, para o protótipo.

export interface Person {
  name: string;
  verified: boolean;
  meetingsDone: number;
  rating: number;
  since: string;
  badges: string[];
}

export const people: Person[] = [
  { name: 'Ana', verified: true, meetingsDone: 18, rating: 4.9, since: '2024', badges: ['Pontual', 'Respeitosa'] },
  { name: 'Bruno', verified: true, meetingsDone: 9, rating: 4.6, since: '2025', badges: ['Pontual'] },
  { name: 'Carla', verified: false, meetingsDone: 2, rating: 4.0, since: '2026', badges: [] },
  { name: 'Diego', verified: true, meetingsDone: 31, rating: 4.8, since: '2023', badges: ['Respeitoso'] },
  { name: 'Elisa', verified: true, meetingsDone: 12, rating: 4.7, since: '2025', badges: ['Pontual', 'Respeitosa'] },
];

export interface VenueReview {
  author: string;
  stars: number;
  text: string;
}

export interface VenueInfo {
  verified: boolean;
  safety: string[];
  reviews: VenueReview[];
}

// Chave: id do espaço em seed.ts (s1..s4).
export const venueInfo: Record<string, VenueInfo> = {
  s1: {
    verified: true,
    safety: ['Recepção com controle de entrada', 'Câmeras nas áreas comuns', 'Salas com privacidade'],
    reviews: [
      { author: 'Diego', stars: 5, text: 'Ambiente organizado e recepção atenciosa.' },
      { author: 'Elisa', stars: 4, text: 'Ótimo para conversas reservadas.' },
    ],
  },
  s2: {
    verified: true,
    safety: ['Recepção com controle de entrada', 'Acesso para pessoas com deficiência'],
    reviews: [{ author: 'Ana', stars: 5, text: 'Bem iluminado e tranquilo.' }],
  },
  s3: {
    verified: false,
    safety: ['Salas com privacidade'],
    reviews: [{ author: 'Bruno', stars: 4, text: 'Sala boa, mas a recepção demora um pouco.' }],
  },
  s4: {
    verified: true,
    safety: ['Recepção com controle de entrada', 'Câmeras nas áreas comuns', 'Estacionamento próximo'],
    reviews: [{ author: 'Carla', stars: 5, text: 'Espaço bonito e seguro para reuniões de negócio.' }],
  },
};

export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

// Consumo no local: o comércio vende enquanto recebe o encontro.
export const menu: MenuItem[] = [
  { id: 'mn1', name: 'Café expresso', price: 8 },
  { id: 'mn2', name: 'Água mineral', price: 4 },
  { id: 'mn3', name: 'Suco natural', price: 12 },
  { id: 'mn4', name: 'Bolo do dia', price: 14 },
];

// Link para abrir o local no Google Maps, de onde a pessoa escreve a avaliação.
// Usa só o nome e o endereço públicos do comércio.
export function googleReviewUrl(name: string, address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`;
}

export type VerificationStep = 'email' | 'phone' | 'document' | 'selfie';

export const verificationSteps: { key: VerificationStep; label: string; hint: string }[] = [
  { key: 'email', label: 'Confirmar e-mail', hint: 'Enviamos um código para o seu e-mail.' },
  { key: 'phone', label: 'Confirmar telefone', hint: 'Enviamos um código por SMS.' },
  { key: 'document', label: 'Enviar documento com foto', hint: 'RG, CNH ou passaporte.' },
  { key: 'selfie', label: 'Selfie de verificação', hint: 'Uma foto do seu rosto para comparar com o documento.' },
];
