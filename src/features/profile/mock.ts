export const profileMock = {
  userId: 'user-1',
  name: 'Alex Johnson',
  learningLanguage: 'Spanish',
  learningFlag: 'ES',
  memberSince: 'January 2024',
  stats: [
    { key: 'lessons', label: 'Lessons', value: '42', icon: 'book' },
    { key: 'streak', label: 'Day Streak', value: '12', icon: 'flame' },
    { key: 'xp', label: 'Total XP', value: '1250', icon: 'trophy' },
  ],
};

export const progressMock = {
  daysStudied: 5,
  totalTime: '12h 45m',
  lessons: 42,
  accuracy: 88,
  week: [
    { day: 'M', value: 10 },
    { day: 'T', value: 28 },
    { day: 'W', value: 45 },
    { day: 'T', value: 18 },
    { day: 'F', value: 52 },
    { day: 'S', value: 38 },
    { day: 'S', value: 6 },
  ],
};

export const streakMock = {
  days: 12,
  week: [
    { day: 'M', done: true },
    { day: 'T', done: true },
    { day: 'W', done: true },
    { day: 'T', done: true, highlight: true },
    { day: 'F', done: false },
    { day: 'S', done: false },
    { day: 'S', done: false },
  ],
  freezeEnabled: true,
  freezeCount: 2,
};

export const notificationsMock = [
  {
    id: 'n1',
    title: 'Keep your streak alive!',
    body: "You're 5 minutes away from your daily goal. Do a quick lesson...",
    time: '2h ago',
    icon: 'alarm',
    tone: 'orange',
    unread: true,
    section: 'Today',
  },
  {
    id: 'n2',
    title: 'New Badge Unlocked!',
    body: "Congratulations! You've mastered 50 new words this week. Keep it...",
    time: '5h ago',
    icon: 'ribbon',
    tone: 'gold',
    unread: true,
    section: 'Today',
  },
  {
    id: 'n3',
    title: 'New Course Available',
    body: 'Spanish Level 2 is now ready for download. Check out the new...',
    time: '1d ago',
    icon: 'information-circle',
    tone: 'blue',
    unread: false,
    section: 'Yesterday',
  },
  {
    id: 'n4',
    title: 'Review Time',
    body: "It's time to review your weak words. A quick 5-min session is...",
    time: '1d ago',
    icon: 'time',
    tone: 'gray',
    unread: false,
    section: 'Yesterday',
  },
  {
    id: 'n5',
    title: 'Weekly Goal Met',
    body: 'You crushed your weekly goal of 200XP! Great work.',
    time: '3d ago',
    icon: 'trophy',
    tone: 'gray',
    unread: false,
    section: 'Earlier',
  },
];
