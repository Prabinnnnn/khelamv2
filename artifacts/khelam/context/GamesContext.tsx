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
  status: "open" | "full" | "locked";
  rules: string;
  notes: string;
  kitToBring: string[];
  players: { id: string; name: string; avatar: string }[];
  city: string;
}

const MOCK_GAMES: Game[] = [
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
