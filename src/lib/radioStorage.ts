import { RadioStation, DEFAULT_STATIONS } from "@/data/defaultStations";

const KEYS = {
  stations: "radio_stations_custom",
  favorites: "radio_favorites",
  lastPlayed: "radio_last_played",
  disabled: "radio_disabled",
};

/** Merge default stations with any admin overrides from localStorage */
export function getStations(): RadioStation[] {
  const raw = localStorage.getItem(KEYS.stations);
  if (!raw) return DEFAULT_STATIONS;
  try {
    const custom: RadioStation[] = JSON.parse(raw);
    // Build map of custom stations (added/edited)
    const map = new Map<string, RadioStation>();
    DEFAULT_STATIONS.forEach((s) => map.set(s.id, s));
    custom.forEach((s) => map.set(s.id, s));
    return Array.from(map.values());
  } catch {
    return DEFAULT_STATIONS;
  }
}

export function saveStations(stations: RadioStation[]) {
  localStorage.setItem(KEYS.stations, JSON.stringify(stations));
  window.dispatchEvent(new Event("radio-stations-updated"));
}

export function getFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(KEYS.favorites);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function toggleFavorite(id: string): Set<string> {
  const favs = getFavorites();
  if (favs.has(id)) favs.delete(id);
  else favs.add(id);
  localStorage.setItem(KEYS.favorites, JSON.stringify([...favs]));
  return favs;
}

export function getLastPlayed(): string | null {
  return localStorage.getItem(KEYS.lastPlayed);
}

export function setLastPlayed(id: string) {
  localStorage.setItem(KEYS.lastPlayed, id);
}
