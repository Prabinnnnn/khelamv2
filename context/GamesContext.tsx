import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Game {
  id: string;
  title: string;
  sport: string;
  venue: string;
  address: string;
  date: string;
  dateLabel: string;
  time: string;
  duration: string;
  format: string;
  slots: number;
  filledSlots: number;
  price: number;
  isIndoor: boolean;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostBio: string;
  image: string;
  status: "open" | "full" | "locked" | "completed" | "cancelled";
  rules: string;
  notes: string;
  kitToBring: string[];
  players: { id: string; name: string; avatar: string }[];
  city: string;
}

const MOCK_GAMES: Game[] = [
  // ── Kathmandu ──────────────────────────────────────────────
  {
    id: "g1",
    title: "Friday Futsal Clash",
    sport: "Futsal",
    venue: "Pragya Futsal Arena",
    address: "Lazimpat, Kathmandu",
    date: "2026-05-08",
    dateLabel: "Today",
    time: "06:00 PM",
    duration: "60 min",
    format: "5 vs 5",
    slots: 10,
    filledSlots: 7,
    price: 500,
    isIndoor: true,
    hostId: "host_1",
    hostName: "Rohan Maharjan",
    hostAvatar: "",
    hostBio: "Verified host with 45+ games organized. Futsal fanatic.",
    image: "",
    status: "open",
    rules: "No rough play. Bring proper futsal shoes. Be on time.",
    notes: "Parking available at the venue.",
    kitToBring: ["Futsal shoes", "Sports wear", "Water bottle"],
    players: [
      { id: "p1", name: "Sanjay", avatar: "" },
      { id: "p2", name: "Priya", avatar: "" },
      { id: "p3", name: "Bikash", avatar: "" },
      { id: "p4", name: "Anita", avatar: "" },
      { id: "p5", name: "Rajan", avatar: "" },
      { id: "p6", name: "Sita", avatar: "" },
      { id: "p7", name: "Anil", avatar: "" },
    ],
    city: "Kathmandu",
  },
  {
    id: "g2",
    title: "Weekend Football League",
    sport: "Football",
    venue: "ANFA Complex Ground",
    address: "Satdobato, Lalitpur",
    date: "2026-05-08",
    dateLabel: "Today",
    time: "07:30 AM",
    duration: "90 min",
    format: "7 vs 7",
    slots: 14,
    filledSlots: 14,
    price: 300,
    isIndoor: false,
    hostId: "host_2",
    hostName: "Dipesh Gurung",
    hostAvatar: "",
    hostBio: "Football coach and passionate organizer.",
    image: "",
    status: "full",
    rules: "Respect the referee. No cleats above 15mm. Fair play always.",
    notes: "Jersey provided. Bring your own boots.",
    kitToBring: ["Football boots", "Sports wear"],
    players: [],
    city: "Kathmandu",
  },
  {
    id: "g3",
    title: "Evening Cricket Scrimmage",
    sport: "Cricket",
    venue: "Bagmati Cricket Ground",
    address: "Balkhu, Kathmandu",
    date: "2026-05-09",
    dateLabel: "Tomorrow",
    time: "04:00 PM",
    duration: "2 hrs",
    format: "11 vs 11",
    slots: 22,
    filledSlots: 16,
    price: 200,
    isIndoor: false,
    hostId: "host_3",
    hostName: "Sunil KC",
    hostAvatar: "",
    hostBio: "Cricket enthusiast, organizing weekend matches since 2020.",
    image: "",
    status: "open",
    rules: "Bat rotation after 5 overs. No LBW in box cricket format.",
    notes: "Equipment provided at venue.",
    kitToBring: ["Cricket whites or sports wear", "Spikes optional"],
    players: [
      { id: "p1", name: "Sanjay", avatar: "" },
      { id: "p2", name: "Mohan", avatar: "" },
    ],
    city: "Kathmandu",
  },
  {
    id: "g4",
    title: "Basketball 3v3 Showdown",
    sport: "Basketball",
    venue: "Ratna Park Court",
    address: "Ratna Park, Kathmandu",
    date: "2026-05-09",
    dateLabel: "Tomorrow",
    time: "05:30 PM",
    duration: "90 min",
    format: "3 vs 3",
    slots: 6,
    filledSlots: 2,
    price: 150,
    isIndoor: false,
    hostId: "host_4",
    hostName: "Kritika Tamang",
    hostAvatar: "",
    hostBio: "Basketball coach, ex-university team captain.",
    image: "",
    status: "open",
    rules: "Street basketball rules apply. Check ball before scoring.",
    notes: "Ball provided. Sneakers required.",
    kitToBring: ["Basketball sneakers", "Sports wear"],
    players: [
      { id: "p1", name: "Anil", avatar: "" },
      { id: "p2", name: "Priya", avatar: "" },
    ],
    city: "Kathmandu",
  },
  {
    id: "g5",
    title: "Badminton Singles & Doubles",
    sport: "Badminton",
    venue: "Kathmandu Badminton Hall",
    address: "Kamal Pokhari, Kathmandu",
    date: "2026-05-10",
    dateLabel: "Thu May 10",
    time: "08:00 AM",
    duration: "2 hrs",
    format: "Singles & Doubles",
    slots: 8,
    filledSlots: 3,
    price: 250,
    isIndoor: true,
    hostId: "host_5",
    hostName: "Sameer Thapa",
    hostAvatar: "",
    hostBio: "National level badminton player turned community organizer.",
    image: "",
    status: "open",
    rules: "Bring your own racket. Shuttlecocks provided.",
    notes: "Court shoes mandatory. No outdoor shoes.",
    kitToBring: ["Badminton racket", "Court shoes", "Sports wear"],
    players: [
      { id: "p1", name: "Ramesh", avatar: "" },
      { id: "p2", name: "Gita", avatar: "" },
      { id: "p3", name: "Hari", avatar: "" },
    ],
    city: "Kathmandu",
  },
  {
    id: "g6",
    title: "Futsal Morning Rush",
    sport: "Futsal",
    venue: "City Futsal Center",
    address: "New Baneshwor, Kathmandu",
    date: "2026-05-10",
    dateLabel: "Thu May 10",
    time: "07:00 AM",
    duration: "60 min",
    format: "5 vs 5",
    slots: 10,
    filledSlots: 10,
    price: 400,
    isIndoor: true,
    hostId: "host_6",
    hostName: "Bibek Rai",
    hostAvatar: "",
    hostBio: "Daily futsal player. Organized 100+ sessions.",
    image: "",
    status: "locked",
    rules: "No sliding tackles. Wear proper footwear.",
    notes: "Game starts sharp at 7 AM.",
    kitToBring: ["Futsal shoes", "Sports kit"],
    players: [],
    city: "Kathmandu",
  },

  // ── Pokhara ────────────────────────────────────────────────
  {
    id: "g7",
    title: "Lakeside Football Sunday",
    sport: "Football",
    venue: "Pokhara Stadium Ground",
    address: "Ranipauwa, Pokhara",
    date: "2026-05-08",
    dateLabel: "Today",
    time: "06:30 AM",
    duration: "90 min",
    format: "7 vs 7",
    slots: 14,
    filledSlots: 9,
    price: 200,
    isIndoor: false,
    hostId: "host_7",
    hostName: "Nirajan Pun",
    hostAvatar: "",
    hostBio: "Football organizer in Pokhara for 5 years.",
    image: "",
    status: "open",
    rules: "Fair play. Referee decision is final.",
    notes: "Balls provided. Come 15 mins early.",
    kitToBring: ["Boots", "Sports kit"],
    players: [
      { id: "p1", name: "Ram", avatar: "" },
      { id: "p2", name: "Shyam", avatar: "" },
    ],
    city: "Pokhara",
  },
  {
    id: "g8",
    title: "Pokhara Futsal Open",
    sport: "Futsal",
    venue: "Summit Futsal",
    address: "Lakeside, Pokhara",
    date: "2026-05-09",
    dateLabel: "Tomorrow",
    time: "05:00 PM",
    duration: "60 min",
    format: "5 vs 5",
    slots: 10,
    filledSlots: 5,
    price: 350,
    isIndoor: true,
    hostId: "host_8",
    hostName: "Anish Shrestha",
    hostAvatar: "",
    hostBio: "Futsal coach and tournament organizer.",
    image: "",
    status: "open",
    rules: "No rough tackles. Sports shoes only.",
    notes: "Indoor AC court.",
    kitToBring: ["Futsal shoes", "Water bottle"],
    players: [
      { id: "p1", name: "Hari", avatar: "" },
      { id: "p2", name: "Mina", avatar: "" },
    ],
    city: "Pokhara",
  },
  {
    id: "g9",
    title: "Mountain Badminton Club",
    sport: "Badminton",
    venue: "Pokhara Sports Hall",
    address: "Chipledhunga, Pokhara",
    date: "2026-05-10",
    dateLabel: "Thu May 10",
    time: "07:00 AM",
    duration: "2 hrs",
    format: "Doubles",
    slots: 8,
    filledSlots: 2,
    price: 180,
    isIndoor: true,
    hostId: "host_9",
    hostName: "Sunita Gurung",
    hostAvatar: "",
    hostBio: "Badminton enthusiast and coach.",
    image: "",
    status: "open",
    rules: "Bring your own racket. Court shoes required.",
    notes: "Shuttlecocks provided.",
    kitToBring: ["Racket", "Court shoes"],
    players: [{ id: "p1", name: "Binod", avatar: "" }],
    city: "Pokhara",
  },

  // ── Lalitpur ───────────────────────────────────────────────
  {
    id: "g10",
    title: "Patan Cricket Match",
    sport: "Cricket",
    venue: "Patan Dhoka Ground",
    address: "Patan Dhoka, Lalitpur",
    date: "2026-05-08",
    dateLabel: "Today",
    time: "08:00 AM",
    duration: "3 hrs",
    format: "11 vs 11",
    slots: 22,
    filledSlots: 18,
    price: 150,
    isIndoor: false,
    hostId: "host_10",
    hostName: "Rajesh Manandhar",
    hostAvatar: "",
    hostBio: "Cricket club captain, Lalitpur district.",
    image: "",
    status: "open",
    rules: "Standard cricket rules. Umpire decision is final.",
    notes: "Stumps provided. Bring your bat if preferred.",
    kitToBring: ["Whites or sports kit", "Spikes optional"],
    players: [
      { id: "p1", name: "Kiran", avatar: "" },
      { id: "p2", name: "Suman", avatar: "" },
    ],
    city: "Lalitpur",
  },
  {
    id: "g11",
    title: "Lalitpur Futsal Night",
    sport: "Futsal",
    venue: "Goal Futsal Arena",
    address: "Jawalakhel, Lalitpur",
    date: "2026-05-09",
    dateLabel: "Tomorrow",
    time: "08:00 PM",
    duration: "60 min",
    format: "5 vs 5",
    slots: 10,
    filledSlots: 8,
    price: 450,
    isIndoor: true,
    hostId: "host_11",
    hostName: "Suresh Shrestha",
    hostAvatar: "",
    hostBio: "Night futsal regular, hosting for 3 years.",
    image: "",
    status: "open",
    rules: "No sliding. Proper shoes only.",
    notes: "Floodlit court. Great vibes.",
    kitToBring: ["Futsal shoes", "Sports wear"],
    players: [
      { id: "p1", name: "Dev", avatar: "" },
      { id: "p2", name: "Maya", avatar: "" },
    ],
    city: "Lalitpur",
  },

  // ── Bhaktapur ──────────────────────────────────────────────
  {
    id: "g12",
    title: "Bhaktapur Basketball Pickup",
    sport: "Basketball",
    venue: "Durbar Square Court",
    address: "Taumadhi Sq, Bhaktapur",
    date: "2026-05-09",
    dateLabel: "Tomorrow",
    time: "04:00 PM",
    duration: "90 min",
    format: "5 vs 5",
    slots: 10,
    filledSlots: 4,
    price: 100,
    isIndoor: false,
    hostId: "host_12",
    hostName: "Binod Shakya",
    hostAvatar: "",
    hostBio: "Bhaktapur local, organizes weekly pickup games.",
    image: "",
    status: "open",
    rules: "Streetball rules. No hard fouls.",
    notes: "Ball provided. Outdoor court.",
    kitToBring: ["Sneakers", "Sports wear"],
    players: [{ id: "p1", name: "Roshan", avatar: "" }],
    city: "Bhaktapur",
  },
  {
    id: "g13",
    title: "Old City Volleyball",
    sport: "Volleyball",
    venue: "Bhaktapur Community Ground",
    address: "Suryamadhi, Bhaktapur",
    date: "2026-05-10",
    dateLabel: "Thu May 10",
    time: "03:00 PM",
    duration: "2 hrs",
    format: "6 vs 6",
    slots: 12,
    filledSlots: 6,
    price: 80,
    isIndoor: false,
    hostId: "host_13",
    hostName: "Pradip Joshi",
    hostAvatar: "",
    hostBio: "Community sports organizer since 2018.",
    image: "",
    status: "open",
    rules: "Standard volleyball rules. No spiking below net.",
    notes: "Net and ball provided.",
    kitToBring: ["Sports shoes", "Comfortable sportswear"],
    players: [
      { id: "p1", name: "Laxmi", avatar: "" },
      { id: "p2", name: "Ganga", avatar: "" },
    ],
    city: "Bhaktapur",
  },

  // ── Chitwan ────────────────────────────────────────────────
  {
    id: "g14",
    title: "Chitwan Cricket Premier",
    sport: "Cricket",
    venue: "Bharatpur Cricket Ground",
    address: "Bharatpur-10, Chitwan",
    date: "2026-05-08",
    dateLabel: "Today",
    time: "09:00 AM",
    duration: "4 hrs",
    format: "11 vs 11",
    slots: 22,
    filledSlots: 14,
    price: 120,
    isIndoor: false,
    hostId: "host_14",
    hostName: "Amit Tharu",
    hostAvatar: "",
    hostBio: "Chitwan district cricket association member.",
    image: "",
    status: "open",
    rules: "ICC standard rules. No body line bowling.",
    notes: "Equipment available. Bring your own bat if possible.",
    kitToBring: ["Cricket kit", "Sports shoes"],
    players: [{ id: "p1", name: "Santosh", avatar: "" }],
    city: "Chitwan",
  },
  {
    id: "g15",
    title: "Jungle Run Badminton",
    sport: "Badminton",
    venue: "Chitwan Sports Complex",
    address: "Narayangarh, Chitwan",
    date: "2026-05-09",
    dateLabel: "Tomorrow",
    time: "06:00 AM",
    duration: "90 min",
    format: "Singles",
    slots: 4,
    filledSlots: 1,
    price: 100,
    isIndoor: true,
    hostId: "host_15",
    hostName: "Prem Bhandari",
    hostAvatar: "",
    hostBio: "Early morning sports person, badminton lover.",
    image: "",
    status: "open",
    rules: "Bring your racket. Court shoes mandatory.",
    notes: "Early bird session. Fresh mornings guaranteed.",
    kitToBring: ["Racket", "Court shoes"],
    players: [],
    city: "Chitwan",
  },

  // ── Butwal ─────────────────────────────────────────────────
  {
    id: "g16",
    title: "Butwal Futsal League",
    sport: "Futsal",
    venue: "Goal Zone Futsal",
    address: "Traffic Chowk, Butwal",
    date: "2026-05-08",
    dateLabel: "Today",
    time: "07:00 PM",
    duration: "60 min",
    format: "6 vs 6",
    slots: 12,
    filledSlots: 10,
    price: 300,
    isIndoor: true,
    hostId: "host_16",
    hostName: "Deepak Yadav",
    hostAvatar: "",
    hostBio: "Futsal organizer in Butwal, 50+ sessions hosted.",
    image: "",
    status: "open",
    rules: "No slide tackles. Proper footwear required.",
    notes: "Great indoor court with good lighting.",
    kitToBring: ["Futsal shoes", "Sports kit"],
    players: [
      { id: "p1", name: "Saurav", avatar: "" },
      { id: "p2", name: "Alina", avatar: "" },
    ],
    city: "Butwal",
  },

  // ── Biratnagar ─────────────────────────────────────────────
  {
    id: "g17",
    title: "Eastern Cricket Cup",
    sport: "Cricket",
    venue: "Biratnagar Cricket Ground",
    address: "Rangeli Road, Biratnagar",
    date: "2026-05-09",
    dateLabel: "Tomorrow",
    time: "08:00 AM",
    duration: "5 hrs",
    format: "11 vs 11",
    slots: 22,
    filledSlots: 20,
    price: 130,
    isIndoor: false,
    hostId: "host_17",
    hostName: "Bijay Limbu",
    hostAvatar: "",
    hostBio: "Cricket club president, eastern region.",
    image: "",
    status: "open",
    rules: "Standard rules. Umpire decision final.",
    notes: "Stumps and balls provided.",
    kitToBring: ["Cricket whites", "Spikes", "Bat"],
    players: [{ id: "p1", name: "Saroj", avatar: "" }],
    city: "Biratnagar",
  },
  {
    id: "g18",
    title: "Biratnagar Basketball",
    sport: "Basketball",
    venue: "Morang Sports Court",
    address: "Mahendra Chowk, Biratnagar",
    date: "2026-05-10",
    dateLabel: "Thu May 10",
    time: "05:00 PM",
    duration: "90 min",
    format: "5 vs 5",
    slots: 10,
    filledSlots: 6,
    price: 120,
    isIndoor: false,
    hostId: "host_18",
    hostName: "Nabin Rai",
    hostAvatar: "",
    hostBio: "Youth sports coach, Biratnagar.",
    image: "",
    status: "open",
    rules: "Street basketball. Fair play expected.",
    notes: "Ball provided.",
    kitToBring: ["Sneakers", "Sports wear"],
    players: [
      { id: "p1", name: "Niroj", avatar: "" },
      { id: "p2", name: "Smriti", avatar: "" },
    ],
    city: "Biratnagar",
  },

  // ── Birgunj ────────────────────────────────────────────────
  {
    id: "g19",
    title: "Birgunj Futsal Showdown",
    sport: "Futsal",
    venue: "Border Futsal Club",
    address: "Adarshanagar, Birgunj",
    date: "2026-05-08",
    dateLabel: "Today",
    time: "06:00 PM",
    duration: "60 min",
    format: "5 vs 5",
    slots: 10,
    filledSlots: 7,
    price: 280,
    isIndoor: true,
    hostId: "host_19",
    hostName: "Ravi Kumar",
    hostAvatar: "",
    hostBio: "Futsal organizer, Birgunj since 2021.",
    image: "",
    status: "open",
    rules: "No rough play. Futsal shoes only.",
    notes: "Good indoor facility.",
    kitToBring: ["Futsal shoes"],
    players: [{ id: "p1", name: "Anup", avatar: "" }],
    city: "Birgunj",
  },
];

const HOSTED_GAMES: Game[] = [
  {
    id: "hg1",
    title: "My Futsal Session",
    sport: "Futsal",
    venue: "Home Ground Arena",
    address: "Thamel, Kathmandu",
    date: "2026-05-11",
    dateLabel: "Fri May 11",
    time: "06:00 PM",
    duration: "60 min",
    format: "5 vs 5",
    slots: 10,
    filledSlots: 4,
    price: 500,
    isIndoor: true,
    hostId: "user_1",
    hostName: "Aarav Shrestha",
    hostAvatar: "",
    hostBio: "",
    image: "",
    status: "open",
    rules: "Fair play. Good vibes only.",
    notes: "",
    kitToBring: ["Futsal shoes"],
    players: [
      { id: "p1", name: "Sanjay", avatar: "" },
      { id: "p2", name: "Priya", avatar: "" },
      { id: "p3", name: "Bikash", avatar: "" },
      { id: "p4", name: "Anita", avatar: "" },
    ],
    city: "Kathmandu",
  },
];

interface GamesContextType {
  games: Game[];
  allGames: Game[];
  hostedGames: Game[];
  joinedGameIds: string[];
  pastGameIds: string[];
  joinGame: (gameId: string) => Promise<void>;
  leaveGame: (gameId: string) => Promise<void>;
  getGame: (id: string) => Game | undefined;
  addHostedGame: (game: Game) => void;
}

const GamesContext = createContext<GamesContextType | null>(null);

export function GamesProvider({ children }: { children: React.ReactNode }) {
  const [joinedGameIds, setJoinedGameIds] = useState<string[]>([]);
  const [pastGameIds] = useState<string[]>(["pg1"]);
  const [hostedGames, setHostedGames] = useState<Game[]>(HOSTED_GAMES);

  useEffect(() => {
    AsyncStorage.getItem("khelam_joined_games").then((val) => {
      if (val) setJoinedGameIds(JSON.parse(val));
    });
  }, []);

  const joinGame = async (gameId: string) => {
    const updated = [...joinedGameIds, gameId];
    setJoinedGameIds(updated);
    await AsyncStorage.setItem("khelam_joined_games", JSON.stringify(updated));
  };

  const leaveGame = async (gameId: string) => {
    const updated = joinedGameIds.filter((id) => id !== gameId);
    setJoinedGameIds(updated);
    await AsyncStorage.setItem("khelam_joined_games", JSON.stringify(updated));
  };

  const getGame = (id: string) =>
    [...MOCK_GAMES, ...hostedGames].find((g) => g.id === id);

  const addHostedGame = (game: Game) => {
    setHostedGames((prev) => [game, ...prev]);
  };

  return (
    <GamesContext.Provider
      value={{
        games: MOCK_GAMES,
        allGames: MOCK_GAMES,
        hostedGames,
        joinedGameIds,
        pastGameIds,
        joinGame,
        leaveGame,
        getGame,
        addHostedGame,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
}

export function useGames() {
  const ctx = useContext(GamesContext);
  if (!ctx) throw new Error("useGames must be used within GamesProvider");
  return ctx;
}
