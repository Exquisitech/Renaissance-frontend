export interface Team {
  id: string;
  name: string;
  league: string;
  country: string;
  logo: string;
}

export const LEAGUES = ["Premier League", "England"];

export const MOCK_TEAMS: Team[] = [
  // Premier League
  { id: "ars", name: "Arsenal", league: "Premier League", country: "England", logo: "#EF0107" },
  { id: "che", name: "Chelsea", league: "Premier League", country: "England", logo: "#034694" },
  { id: "liv", name: "Liverpool", league: "Premier League", country: "England", logo: "#C8102E" },
  { id: "mci", name: "Manchester City", league: "Premier League", country: "England", logo: "#6CABDD" },
  { id: "mun", name: "Manchester United", league: "Premier League", country: "England", logo: "#DA291C" },
  { id: "tot", name: "Tottenham Hotspur", league: "Premier League", country: "England", logo: "#132257" },

  // Requested Additions
  { id: "rma", name: "Real Madrid", league: "La Liga", country: "Spain", logo: "#FEBE10" },
  { id: "bay", name: "Bayern Munich", league: "Bundesliga", country: "Germany", logo: "#DC052D" },
];
