import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { seedMeetings, type Meeting } from '../data/seed';

export type EventStatus = 'none' | 'requested' | 'joined';

interface State {
  meetings: Meeting[];
  eventStatus: Record<string, EventStatus>;
  bookedSpaces: string[];
  couponSpaces: string[];
  connections: string[];
}

type Action =
  | { type: 'createMeeting'; meeting: Meeting }
  | { type: 'toggleConfirm'; id: string }
  | { type: 'removeMeeting'; id: string }
  | { type: 'joinEvent'; id: string; mode: 'request' | 'join' }
  | { type: 'bookSpace'; id: string }
  | { type: 'applyCoupon'; id: string }
  | { type: 'toggleConnect'; id: string };

const initialState: State = {
  meetings: seedMeetings,
  eventStatus: {},
  bookedSpaces: [],
  couponSpaces: [],
  connections: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
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
    case 'joinEvent':
      return {
        ...state,
        eventStatus: {
          ...state.eventStatus,
          [action.id]: action.mode === 'request' ? 'requested' : 'joined',
        },
      };
    case 'bookSpace':
      return state.bookedSpaces.includes(action.id)
        ? state
        : { ...state, bookedSpaces: [...state.bookedSpaces, action.id] };
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
  createMeeting: (meeting: Meeting) => void;
  toggleConfirm: (id: string) => void;
  removeMeeting: (id: string) => void;
  joinEvent: (id: string, mode: 'request' | 'join') => void;
  bookSpace: (id: string) => void;
  applyCoupon: (id: string) => void;
  toggleConnect: (id: string) => void;
}

const AppContext = createContext<AppValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<AppValue>(
    () => ({
      ...state,
      createMeeting: (meeting) => dispatch({ type: 'createMeeting', meeting }),
      toggleConfirm: (id) => dispatch({ type: 'toggleConfirm', id }),
      removeMeeting: (id) => dispatch({ type: 'removeMeeting', id }),
      joinEvent: (id, mode) => dispatch({ type: 'joinEvent', id, mode }),
      bookSpace: (id) => dispatch({ type: 'bookSpace', id }),
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
