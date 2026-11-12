import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import {
  seedBookings,
  seedInvitations,
  seedMeetings,
  type Booking,
  type BookingStatus,
  type Invitation,
  type Meeting,
} from '../data/seed';
import type { VerificationStep } from '../data/trust';

export type EventStatus = 'none' | 'requested' | 'joined';
export type SessionType = 'user' | 'business';

export interface Session {
  type: SessionType;
  name: string;
}

// Avaliação completa de um encontro, feita pelo organizador depois da reunião.
export interface MeetingReview {
  punctuality: number;
  respect: number;
  venue: number;
  comment: string;
}

export type Verification = Record<VerificationStep, boolean>;

interface State {
  session: Session | null;
  verification: Verification;
  meetings: Meeting[];
  invitations: Invitation[];
  bookings: Booking[];
  eventStatus: Record<string, EventStatus>;
  couponSpaces: string[];
  connections: string[];
  reviews: Record<string, MeetingReview>;
}

type Action =
  | { type: 'login'; session: Session }
  | { type: 'logout' }
  | { type: 'verify'; step: VerificationStep }
  | { type: 'createMeeting'; meeting: Meeting }
  | { type: 'toggleConfirm'; id: string }
  | { type: 'removeMeeting'; id: string }
  | { type: 'saveReview'; id: string; review: MeetingReview }
  | { type: 'respondInvitation'; id: string; accept: boolean }
  | { type: 'joinEvent'; id: string; mode: 'request' | 'join' }
  | { type: 'createBooking'; booking: Booking }
  | { type: 'setBookingStatus'; id: string; status: BookingStatus }
  | { type: 'applyCoupon'; id: string }
  | { type: 'toggleConnect'; id: string };

const initialState: State = {
  session: null,
  verification: { email: false, phone: false, document: false, selfie: false },
  meetings: seedMeetings,
  invitations: seedInvitations,
  bookings: seedBookings,
  eventStatus: {},
  couponSpaces: [],
  connections: [],
  reviews: {},
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'login':
      return { ...state, session: action.session };
    case 'logout':
      return { ...state, session: null };
    case 'verify':
      return { ...state, verification: { ...state.verification, [action.step]: true } };
    case 'createMeeting':
      return { ...state, meetings: [action.meeting, ...state.meetings] };
    case 'toggleConfirm':
      return {
        ...state,
        meetings: state.meetings.map((m) =>
          m.id === action.id ? { ...m, confirmed: !m.confirmed } : m,
        ),
      };
    case 'removeMeeting':
      return { ...state, meetings: state.meetings.filter((m) => m.id !== action.id) };
    case 'saveReview':
      return { ...state, reviews: { ...state.reviews, [action.id]: action.review } };
    case 'respondInvitation': {
      const status: Invitation['status'] = action.accept ? 'aceita' : 'recusada';
      const invitation = state.invitations.find((i) => i.id === action.id);
      const invitations = state.invitations.map((i) =>
        i.id === action.id ? { ...i, status } : i,
      );
      // Aceitar um convite cria a reunião na agenda do usuário.
      const meetings =
        action.accept && invitation
          ? [
              {
                id: `inv-${invitation.id}`,
                title: invitation.title,
                place: invitation.place,
                date: invitation.date,
                time: invitation.time,
                group: 'proximas' as const,
                type: 'Café' as const,
                participants: [invitation.from],
                confirmed: true,
              },
              ...state.meetings,
            ]
          : state.meetings;
      return { ...state, invitations, meetings };
    }
    case 'joinEvent':
      return {
        ...state,
        eventStatus: {
          ...state.eventStatus,
          [action.id]: action.mode === 'request' ? 'requested' : 'joined',
        },
      };
    case 'createBooking':
      return { ...state, bookings: [action.booking, ...state.bookings] };
    case 'setBookingStatus':
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.id ? { ...b, status: action.status } : b,
        ),
      };
    case 'applyCoupon':
      return state.couponSpaces.includes(action.id)
        ? state
        : { ...state, couponSpaces: [...state.couponSpaces, action.id] };
    case 'toggleConnect':
      return {
        ...state,
        connections: state.connections.includes(action.id)
          ? state.connections.filter((c) => c !== action.id)
          : [...state.connections, action.id],
      };
  }
}

interface AppValue extends State {
  isVerified: boolean;
  login: (session: Session) => void;
  logout: () => void;
  verify: (step: VerificationStep) => void;
  createMeeting: (meeting: Meeting) => void;
  toggleConfirm: (id: string) => void;
  removeMeeting: (id: string) => void;
  saveReview: (id: string, review: MeetingReview) => void;
  respondInvitation: (id: string, accept: boolean) => void;
  joinEvent: (id: string, mode: 'request' | 'join') => void;
  createBooking: (booking: Booking) => void;
  setBookingStatus: (id: string, status: BookingStatus) => void;
  applyCoupon: (id: string) => void;
  toggleConnect: (id: string) => void;
}

const AppContext = createContext<AppValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<AppValue>(
    () => ({
      ...state,
      isVerified: Object.values(state.verification).every(Boolean),
      login: (session) => dispatch({ type: 'login', session }),
      logout: () => dispatch({ type: 'logout' }),
      verify: (step) => dispatch({ type: 'verify', step }),
      createMeeting: (meeting) => dispatch({ type: 'createMeeting', meeting }),
      toggleConfirm: (id) => dispatch({ type: 'toggleConfirm', id }),
      removeMeeting: (id) => dispatch({ type: 'removeMeeting', id }),
      saveReview: (id, review) => dispatch({ type: 'saveReview', id, review }),
      respondInvitation: (id, accept) => dispatch({ type: 'respondInvitation', id, accept }),
      joinEvent: (id, mode) => dispatch({ type: 'joinEvent', id, mode }),
      createBooking: (booking) => dispatch({ type: 'createBooking', booking }),
      setBookingStatus: (id, status) => dispatch({ type: 'setBookingStatus', id, status }),
      applyCoupon: (id) => dispatch({ type: 'applyCoupon', id }),
      toggleConnect: (id) => dispatch({ type: 'toggleConnect', id }),
    }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}
