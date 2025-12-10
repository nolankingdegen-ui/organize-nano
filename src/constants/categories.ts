export const ROOM_CATEGORIES = [
  { id: "room", label: "Room", icon: "🛏️" },
  { id: "office", label: "Office Workspace", icon: "💼" },
  { id: "event-hall", label: "Event Hall / Banquet Hall", icon: "🎉" },
  { id: "kitchen", label: "Kitchen", icon: "🍳" },
  { id: "home-gym", label: "Home Gym", icon: "💪" },
  { id: "garage", label: "Garage / Workshop", icon: "🔧" },
  { id: "garden", label: "Garden / Backyard", icon: "🌿" },
  { id: "classroom", label: "Classroom / Study Area", icon: "📚" },
  { id: "studio-apartment", label: "Studio Apartment", icon: "🏠" },
  { id: "hotel-room", label: "Hotel Room", icon: "🏨" },
  { id: "photo-studio", label: "Photography / YouTube Studio", icon: "📸" },
  { id: "music-studio", label: "Music Studio", icon: "🎵" },
  { id: "medical", label: "Doctor's Clinic / Medical Room", icon: "⚕️" },
  { id: "car-showroom", label: "Car Showroom", icon: "🚗" },
  { id: "exhibition", label: "Exhibition / Booth Setup", icon: "🖼️" },
  { id: "gym", label: "Gym / Fitness Center", icon: "🏋️" },
  { id: "airbnb", label: "Airbnb Space", icon: "🏡" },
  { id: "vr-gaming", label: "VR Gaming Room", icon: "🎮" },
  { id: "home-theatre", label: "Home Theatre", icon: "🎬" },
  { id: "rv", label: "Camper Van / RV Interior", icon: "🚐" },
  { id: "popup-shop", label: "Pop-up Shop / Kiosk", icon: "🛍️" },
] as const;

export type RoomCategoryId = (typeof ROOM_CATEGORIES)[number]["id"];

export const getCategoryLabel = (id: RoomCategoryId): string => {
  return ROOM_CATEGORIES.find((cat) => cat.id === id)?.label || "Room";
};

export const getCategoryPrompt = (id: RoomCategoryId): string => {
  const prompts: Record<RoomCategoryId, string> = {
    room: "bedroom or living room",
    office: "office workspace with professional organization and productivity focus",
    "event-hall": "event hall or banquet hall with elegant setup and seating arrangements",
    kitchen: "kitchen with efficient storage, clean countertops, and organized appliances",
    "home-gym": "home gym with proper equipment layout and motivational atmosphere",
    garage: "garage or workshop with tool organization and efficient storage systems",
    garden: "garden or backyard with landscaping, seating areas, and plant arrangements",
    classroom: "classroom or study area with organized learning space and materials",
    "studio-apartment": "studio apartment with space-efficient furniture and multi-functional areas",
    "hotel-room": "hotel room with welcoming ambiance and organized amenities",
    "photo-studio": "photography or YouTube studio with proper lighting, backdrop, and equipment setup",
    "music-studio": "music studio with acoustic treatment and equipment organization",
    medical: "medical clinic or examination room with professional medical equipment and cleanliness",
    "car-showroom": "car showroom with attractive vehicle display and presentation",
    exhibition: "exhibition space or booth with engaging display and visitor flow",
    gym: "fitness center with organized equipment zones and motivational atmosphere",
    airbnb: "Airbnb rental space with welcoming decor and guest amenities",
    "vr-gaming": "VR gaming room with safe play space and immersive setup",
    "home-theatre": "home theatre with comfortable seating and optimal viewing setup",
    rv: "camper van or RV interior with space-efficient storage and cozy atmosphere",
    "popup-shop": "pop-up shop or kiosk with attractive product display and customer flow",
  };

  return prompts[id] || "room";
};
