import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type MeetingGroup = 'hoje' | 'semana' | 'proximas';
export type MeetingType = 'Café' | 'Almoço' | 'Online';

export interface Meeting {
  id: string;
  title: string;
  place: string;
  date: string; // dd/mm
  time: string; // HH:mm
  group: MeetingGroup;
  type: MeetingType;
  participants: string[];
  confirmed: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  place: string;
  date: string;
  icon: IconName;
  description: string;
  // 'request' exige aprovação do organizador; 'join' entra direto.
  mode: 'request' | 'join';
}

export interface Space {
  id: string;
  name: string;
  address: string;
  rating: number;
  premium: boolean;
  pricePerHour: number;
  discount?: string;
}

export interface Company {
  id: string;
  name: string;
  segment: string;
  tags: string;
  rating: number;
  description: string;
  history: string[];
  match?: number;
}

export interface Ambient {
  id: string;
  label: string;
  multiplier: number; // fator sobre o preço por hora do espaço
}

export interface Invitation {
  id: string;
  from: string;
  title: string;
  date: string;
  time: string;
  place: string;
  status: 'pendente' | 'aceita' | 'recusada';
}

export type BookingStatus = 'pendente' | 'confirmada' | 'cancelada';

export interface Booking {
  id: string;
  spaceId: string;
  spaceName: string;
  date: string;
  time: string;
  hours: number;
  ambient: string;
  total: number;
  couponApplied: boolean;
  status: BookingStatus;
}

// Dados de exemplo extraídos dos mockups. Descrições, históricos e preços são provisórios.
export const seedMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Reunião de Estratégia',
    place: 'Sala 101',
    date: '24/04',
    time: '19:00',
    group: 'hoje',
    type: 'Café',
    participants: ['Ana', 'Bruno'],
    confirmed: true,
  },
  {
    id: 'm2',
    title: 'Alinhamento de Equipe',
    place: 'Escritório A',
    date: '28/04',
    time: '10:30',
    group: 'semana',
    type: 'Almoço',
    participants: ['Equipe'],
    confirmed: false,
  },
  {
    id: 'm3',
    title: 'Revisão do Projeto',
    place: 'Sala de Conferência',
    date: '02/05',
    time: '09:00',
    group: 'proximas',
    type: 'Online',
    participants: ['Carla'],
    confirmed: false,
  },
  {
    id: 'm4',
    title: 'Planejamento de Marketing',
    place: 'Sala 203',
    date: '07/05',
    time: '14:00',
    group: 'proximas',
    type: 'Café',
    participants: ['Diego', 'Elisa'],
    confirmed: false,
  },
];

export const events: EventItem[] = [
  {
    id: 'e1',
    title: 'Seminário de Liderança',
    place: 'Auditório Norte',
    date: '10/05',
    icon: 'cafe-outline',
    description: 'Seminário sobre liderança para times em crescimento.',
    mode: 'request',
  },
  {
    id: 'e2',
    title: 'Workshop de Inovação',
    place: 'Espaço Ideia',
    date: '15/05',
    icon: 'bulb-outline',
    description: 'Oficina prática de inovação com dinâmicas em grupo.',
    mode: 'request',
  },
  {
    id: 'e3',
    title: 'Encontro de Networking',
    place: 'Centro Empresarial',
    date: '20/05',
    icon: 'git-network-outline',
    description: 'Encontro aberto para empresas e profissionais se conectarem.',
    mode: 'join',
  },
  {
    id: 'e4',
    title: 'Apresentação de Produto',
    place: 'Hotel Central',
    date: '30/05',
    icon: 'newspaper-outline',
    description: 'Lançamento e demonstração de produtos para parceiros.',
    mode: 'join',
  },
];

export const spaces: Space[] = [
  { id: 's1', name: 'WorkHub', address: 'Av. das Flores, 150', rating: 4.5, premium: true, pricePerHour: 60 },
  { id: 's2', name: 'Conectar Coworking', address: 'R. Bonfim, 222', rating: 5, premium: false, pricePerHour: 40 },
  {
    id: 's3',
    name: 'Salas Contempo',
    address: 'Alameda B, 810',
    rating: 4.7,
    premium: false,
    pricePerHour: 50,
    discount: 'Desconto E-Reuniões',
  },
  { id: 's4', name: 'Espaço Collaborar', address: 'R. XV de Novembro, 1000', rating: 5, premium: false, pricePerHour: 55 },
];

export const ambients: Ambient[] = [
  { id: 'a1', label: 'Mesa privativa', multiplier: 1 },
  { id: 'a2', label: 'Sala fechada', multiplier: 1.5 },
  { id: 'a3', label: 'Área comum', multiplier: 0.8 },
];

export const companies: Company[] = [
  {
    id: 'c1',
    name: 'TechSolutions',
    segment: 'Software',
    tags: '#tecnologia #inovação',
    rating: 5,
    match: 65,
    description: 'Soluções de software para empresas em crescimento.',
    history: ['Workshop de Inovação', 'Encontro de Networking'],
  },
  {
    id: 'c2',
    name: 'GreenEnergy',
    segment: 'Energia Renovável',
    tags: '#sustentabilidade #energia',
    rating: 4,
    description: 'Projetos de energia solar e eficiência energética para empresas.',
    history: ['Seminário de Liderança'],
  },
  {
    id: 'c3',
    name: 'InovaMídia',
    segment: 'Marketing',
    tags: 'Agência de publicidade digital',
    rating: 4,
    description: 'Agência de publicidade digital focada em campanhas de performance.',
    history: ['Apresentação de Produto'],
  },
  {
    id: 'c4',
    name: 'BetaCorp',
    segment: 'Consultoria',
    tags: '#negócios #estratégia',
    rating: 4,
    description: 'Consultoria de estratégia e gestão para pequenas e médias empresas.',
    history: ['Encontro de Networking'],
  },
];

export const seedInvitations: Invitation[] = [
  {
    id: 'i1',
    from: 'Ana Souza',
    title: 'Alinhamento de vendas',
    date: '18/11',
    time: '15:00',
    place: 'WorkHub',
    status: 'pendente',
  },
  {
    id: 'i2',
    from: 'TechSolutions',
    title: 'Apresentação de parceria',
    date: '21/11',
    time: '10:00',
    place: 'Conectar Coworking',
    status: 'pendente',
  },
];

export const seedBookings: Booking[] = [
  {
    id: 'b1',
    spaceId: 's3',
    spaceName: 'Salas Contempo',
    date: '20/11',
    time: '14:00',
    hours: 2,
    ambient: 'Sala fechada',
    total: 150,
    couponApplied: false,
    status: 'pendente',
  },
];
