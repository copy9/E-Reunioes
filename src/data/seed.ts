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
  // 'request' exige aprovação do organizador; 'join' entra direto.
  mode: 'request' | 'join';
}

export interface Space {
  id: string;
  name: string;
  address: string;
  rating: number;
  premium: boolean;
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

// Dados de exemplo extraídos dos mockups. Descrições e históricos são provisórios.
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
    mode: 'request',
  },
  {
    id: 'e2',
    title: 'Workshop de Inovação',
    place: 'Espaço Ideia',
    date: '15/05',
    icon: 'bulb-outline',
    mode: 'request',
  },
  {
    id: 'e3',
    title: 'Encontro de Networking',
    place: 'Centro Empresarial',
    date: '20/05',
    icon: 'git-network-outline',
    mode: 'join',
  },
  {
    id: 'e4',
    title: 'Apresentação de Produto',
    place: 'Hotel Central',
    date: '30/05',
    icon: 'newspaper-outline',
    mode: 'join',
  },
];

export const spaces: Space[] = [
  { id: 's1', name: 'WorkHub', address: 'Av. das Flores, 150', rating: 4.5, premium: true },
  { id: 's2', name: 'Conectar Coworking', address: 'R. Bonfim, 222', rating: 5, premium: false },
  {
    id: 's3',
    name: 'Salas Contempo',
    address: 'Alameda B, 810',
    rating: 4.7,
    premium: false,
    discount: 'Desconto E-Reuniões',
  },
  { id: 's4', name: 'Espaço Collaborar', address: 'R. XV de Novembro, 1000', rating: 5, premium: false },
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
