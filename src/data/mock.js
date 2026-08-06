export const FARMER = { name: "Karthi", plan: "Premium Farmer" };

export const VEGETABLES = [
  { id: "tomato", name: "Tomato", photo: "/produce/tomato.jpg", color: "bg-red-100" },
  { id: "onion", name: "Onion", photo: "/produce/onion.jpg", color: "bg-purple-100" },
  { id: "potato", name: "Potato", photo: "/produce/potato.jpg", color: "bg-amber-100" },
  { id: "brinjal", name: "Brinjal (Eggplant)", photo: "/produce/brinjal.jpg", color: "bg-purple-100" },
  { id: "okra", name: "Okra", photo: "/produce/okra.jpg", color: "bg-green-100" },
  { id: "spinach", name: "Spinach", photo: "/produce/spinach.jpg", color: "bg-green-100" },
  { id: "cabbage", name: "Cabbage", photo: "/produce/cabbage.jpg", color: "bg-lime-100" },
  { id: "cauliflower", name: "Cauliflower", photo: "/produce/cauliflower.jpg", color: "bg-stone-100" },
  { id: "carrot", name: "Carrot", photo: "/produce/carrot.jpg", color: "bg-orange-100" },
  { id: "beetroot", name: "Beetroot", photo: "/produce/beetroot.jpg", color: "bg-rose-100" },
  { id: "green-chili", name: "Green Chili", photo: "/produce/green-chili.jpg", color: "bg-green-100" },
  { id: "capsicum", name: "Capsicum", photo: "/produce/capsicum.jpg", color: "bg-pink-100" },
  { id: "cucumber", name: "Cucumber", photo: "/produce/cucumber.jpg", color: "bg-green-100" },
  { id: "pumpkin", name: "Pumpkin", photo: "/produce/pumpkin.jpg", color: "bg-orange-100" },
  { id: "bitter-gourd", name: "Bitter Gourd", photo: "/produce/bitter-gourd.jpg", color: "bg-lime-100" },
  { id: "bottle-gourd", name: "Bottle Gourd", photo: "/produce/bottle-gourd.jpg", color: "bg-lime-100" },
  { id: "radish", name: "Radish", photo: "/produce/radish.jpg", color: "bg-pink-100" },
  { id: "drumstick", name: "Drumstick", photo: "/produce/drumstick.jpg", color: "bg-lime-100" },
  { id: "coriander", name: "Coriander", photo: "/produce/coriander.jpg", color: "bg-green-100" },
  { id: "mint", name: "Mint", photo: "/produce/mint.jpg", color: "bg-teal-100" },
];

export const MARKET_PRICE = {
  tomato: 31, onion: 22, potato: 20, brinjal: 26, okra: 38, spinach: 20,
  cabbage: 16, cauliflower: 28, carrot: 24, beetroot: 22, "green-chili": 65,
  capsicum: 45, cucumber: 18, pumpkin: 15, "bitter-gourd": 34, "bottle-gourd": 20,
  radish: 18, drumstick: 55, coriander: 12, mint: 10,
};

export const LISTINGS = [
  { id: 1, veg: "tomato", name: "Tomato", qty: 250, unit: "Kg", price: 28, harvested: "Today", status: "Live", views: 128, orders: 22, photo: "/produce/tomato.jpg", color: "bg-red-100" },
  { id: 2, veg: "onion", name: "Onion", qty: 500, unit: "Kg", price: 22, harvested: "Yesterday", status: "Live", views: 96, orders: 18, photo: "/produce/onion.jpg", color: "bg-purple-100" },
  { id: 3, veg: "spinach", name: "Spinach", qty: 60, unit: "Bunch", price: 18, harvested: "Today", status: "Live", views: 64, orders: 12, photo: "/produce/spinach.jpg", color: "bg-green-100" },
];

export const ORDERS = [
  { id: 1, buyer: "Rajesh Traders", item: "20 Kg Tomato", value: 1850, advance: 370, status: "New" },
  { id: 2, buyer: "Kannan Stores", item: "15 Kg Onion", value: 1320, advance: 264, status: "New" },
  { id: 3, buyer: "Fresh Mart", item: "10 Kg Spinach", value: 450, advance: 90, status: "New" },
];

export const DELIVERY = { truck: "TN09 AB 1234", driver: "Murugan", rating: 4.8, eta: "14 mins" };

export const NOTIFICATIONS = [
  { text: "New order from Rajesh Traders — 20 Kg Tomato", time: "12 minutes ago" },
  { text: "Truck TN09 AB 1234 is 5 km from delivery point", time: "38 minutes ago" },
  { text: "80% balance of ₹1,480 released for a delivered order", time: "1 day ago" },
  { text: "Your GPS verification was successful", time: "2 days ago" },
];

export const INSIGHTS = [
  { veg: "Tomato", text: "Tomato demand is high today. Best time to sell before 2 PM.", extra: "Expected profit ₹5,200" },
  { veg: "Onion", text: "Onion price may increase by 15% in next 2 days. Consider holding.", extra: "" },
  { veg: "Rain", text: "Rain expected tomorrow. Plan your harvest today.", extra: "" },
];
