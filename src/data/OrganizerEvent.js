const KEY = 'admitone.org.events';

export function loadEvents() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : SEED;
  } catch {
    return SEED;
  }
}

export function saveEvents(events) {
  localStorage.setItem(KEY, JSON.stringify(events));
}

export function makeId() {
  return 'evt_' + Math.random().toString(36).slice(2, 9);
}

const SEED = [
  {
    id: 'evt_demo1',
    title: 'Lagos Tech Meetup',
    status: 'published',
    category: 'Tech',
    year: 2025, month: 'OCT', day: '20',
    doors: '18:00', start: '19:00', end: '22:00',
    venue: 'Landmark Centre, Lagos',
    description: 'Monthly gathering of Lagos builders, founders, and designers.',
    tickets: [
      { id: 't1', name: 'General', price: 5000, quantity: 100, sold: 42 },
    ],
    createdAt: '2025-09-12T09:00:00.000Z',
  },
  {
    id: 'evt_demo2',
    title: 'Rooftop Jazz Session',
    status: 'draft',
    category: 'Music',
    year: 2025, month: 'OCT', day: '22',
    doors: '18:30', start: '19:30', end: '23:00',
    venue: 'The Wheatbaker, Ikoyi',
    description: 'An evening of live jazz, small plates, and skyline views.',
    tickets: [
      { id: 't1', name: 'Early bird', price: 15000, quantity: 50, sold: 0 },
      { id: 't2', name: 'Standard', price: 18000, quantity: 80, sold: 0 },
    ],
    createdAt: '2025-09-18T14:30:00.000Z',
  },
];



const ATTENDEE_SEED = {
  evt_demo1: [
    { id: 'a1', name: 'Ada Okafor',     email: 'ada@example.com',    phone: '+234 801 111 1111', tier: 'General', checkedIn: true,  purchasedAt: '2025-09-20T10:12:00.000Z' },
    { id: 'a2', name: 'Tunde Bakare',   email: 'tunde@example.com',  phone: '+234 802 222 2222', tier: 'General', checkedIn: false, purchasedAt: '2025-09-21T14:45:00.000Z' },
    { id: 'a3', name: 'Zainab Yusuf',   email: 'zainab@example.com', phone: '+234 803 333 3333', tier: 'General', checkedIn: true,  purchasedAt: '2025-09-22T08:00:00.000Z' },
    { id: 'a4', name: 'Chidi Nwosu',    email: 'chidi@example.com',  phone: '+234 804 444 4444', tier: 'General', checkedIn: false, purchasedAt: '2025-09-24T19:30:00.000Z' },
    { id: 'a5', name: 'Funmi Adeyemi',  email: 'funmi@example.com',  phone: '+234 805 555 5555', tier: 'General', checkedIn: false, purchasedAt: '2025-09-25T11:15:00.000Z' },
    { id: 'a6', name: 'Emeka Obi',      email: 'emeka@example.com',  phone: '+234 806 666 6666', tier: 'General', checkedIn: true,  purchasedAt: '2025-09-26T16:20:00.000Z' },
    { id: 'a7', name: 'Kemi Balogun',   email: 'kemi@example.com',   phone: '+234 807 777 7777', tier: 'General', checkedIn: false, purchasedAt: '2025-09-27T09:05:00.000Z' },
    { id: 'a8', name: 'Segun Adeleke',  email: 'segun@example.com',  phone: '+234 808 888 8888', tier: 'General', checkedIn: false, purchasedAt: '2025-09-28T12:40:00.000Z' },
  ],
  evt_demo2: [],
};

export function loadAttendees(eventId) {
  try {
    const raw = localStorage.getItem(`admitone.org.attendees.${eventId}`);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return ATTENDEE_SEED[eventId] ?? [];
}

export function saveAttendees(eventId, attendees) {
  localStorage.setItem(`admitone.org.attendees.${eventId}`, JSON.stringify(attendees));
}