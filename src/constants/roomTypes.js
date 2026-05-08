export const ROOM_TYPES = [
  "Standard Room",
  "Superior Room",
  "Single",
  "Double",
  "Twin",
  "Deluxe",
  "Executive Room",
  "Suite",
  "Junior Suite",
  "Presidential Suite",
  "Penthouse Suite",
];

export const ROOM_TYPE_OPTIONS = ROOM_TYPES.map((type) => ({
  value: type,
  label: type,
}));

export const ROOM_TYPE_ICONS = {
  "Standard Room": "🏨",
  "Superior Room": "✦",
  Single: "🛏",
  Double: "🛏🛏",
  Twin: "Ⅱ",
  Deluxe: "◆",
  "Executive Room": "◼",
  Suite: "👑",
  "Junior Suite": "◇",
  "Presidential Suite": "♛",
  "Penthouse Suite": "△",
};
