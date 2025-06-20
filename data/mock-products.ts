import type { Product } from "@/types/product"


export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Basmati Rice (Premium)",
    description: "Aged long-grain aromatic rice, perfect for Biryani and Pulao. Grown in the foothills of the Himalayas.",
    price: 150, // Price per kg
    unit: "kg",
    image: "/placeholder.svg?height=400&width=400", // Replace with actual image paths
    category: "grains",
    farmer: {
      id: "farmer1",
      name: "Punjab Agro Fields",
      location: "Amritsar, Punjab",
      image: "/placeholder.svg?height=100&width=100", // Replace with actual image paths
    },
    organic: false,
    inStock: true,
    quantity: 500, // Quantity in kg
  },
  {
    id: "2",
    name: "Moong Dal (Split Yellow Lentils)",
    description: "Polished split yellow lentils, easy to cook and digest. Staple food for everyday meals.",
    price: 125, // Price per kg
    unit: "kg",
    image: "/placeholder.svg?height=400&width=400",
    category: "pulses",
    farmer: {
      id: "farmer2",
      name: "Deccan Pulses Collective",
      location: "Gulbarga, Karnataka",
      image: "/placeholder.svg?height=100&width=100",
    },
    organic: true,
    inStock: true,
    quantity: 350, // Quantity in kg
  },
  {
    id: "3",
    name: "Fresh Bhindi (Okra)",
    description: "Tender and fresh Lady's Finger (Okra), locally sourced. Ideal for sabzi or frying.",
    price: 60, // Price per kg
    unit: "kg",
    image: "/placeholder.svg?height=400&width=400",
    category: "vegetables",
    farmer: {
      id: "farmer3",
      name: "Coastal Green Farms",
      location: "Ratnagiri, Maharashtra",
      image: "/placeholder.svg?height=100&width=100",
    },
    organic: false,
    inStock: true,
    quantity: 40, // Quantity in kg
  },
  {
    id: "4",
    name: "Red Onions (Pyaaz)",
    description: "Farm-fresh red onions, essential for Indian cooking. Strong flavor.",
    price: 45, // Price per kg
    unit: "kg",
    image: "/placeholder.svg?height=400&width=400",
    category: "vegetables",
    farmer: {
      id: "farmer4",
      name: "Nashik Onion Growers",
      location: "Nashik, Maharashtra",
      image: "/placeholder.svg?height=100&width=100",
    },
    organic: false,
    inStock: true,
    quantity: 1000, // Quantity in kg
  },
  {
    id: "5",
    name: "Alphonso Mangoes (Seasonal)",
    description: "Premium quality 'Hapus' mangoes known for their sweetness and aroma. Available only during season.",
    price: 800, // Price per dozen (can be very variable)
    unit: "dozen",
    image: "/placeholder.svg?height=400&width=400",
    category: "fruits",
    farmer: {
      id: "farmer5",
      name: "Konkan Orchards",
      location: "Devgad, Maharashtra",
      image: "/placeholder.svg?height=100&width=100",
    },
    organic: true,
    inStock: true, // Assuming it's currently mango season
    quantity: 50, // Quantity in dozens
  },
  {
    id: "6",
    name: "Whole Wheat Grain (Gehu)",
    description: "High-quality whole wheat grains, suitable for milling fresh atta at home.",
    price: 2800, // Price per quintal (100 kg)
    unit: "quintal",
    image: "/placeholder.svg?height=400&width=400",
    category: "grains",
    farmer: {
      id: "farmer6",
      name: "Haryana Wheat Farms",
      location: "Hisar, Haryana",
      image: "/placeholder.svg?height=100&width=100",
    },
    organic: false,
    inStock: false, // Example: Out of stock
    quantity: 0,
  },
  {
    id: "7",
    name: "Fresh Palak (Spinach Bunch)",
    description: "Leafy green spinach, rich in iron and vitamins. Sold in bunches.",
    price: 20, // Price per bunch
    unit: "bunch",
    image: "/placeholder.svg?height=400&width=400",
    category: "vegetables",
    farmer: {
      id: "farmer7",
      name: "Ganga Greens",
      location: "Varanasi, Uttar Pradesh",
      image: "/placeholder.svg?height=100&width=100",
    },
    organic: true,
    inStock: true,
    quantity: 150, // Quantity in bunches
  },
  {
    id: "8",
    name: "Potatoes (Aloo)",
    description: "Versatile potatoes suitable for curries, roasting, boiling, and chips.",
    price: 30, // Price per kg
    unit: "kg",
    image: "/placeholder.svg?height=400&width=400",
    category: "vegetables",
    farmer: {
      id: "farmer8",
      name: "Himalayan Potato Farm",
      location: "Shimla, Himachal Pradesh",
      image: "/placeholder.svg?height=100&width=100",
    },
    organic: false,
    inStock: true,
    quantity: 800, // Quantity in kg
  },
   {
    id: "9",
    name: "Turmeric Powder (Haldi)",
    description: "Pure, ground turmeric powder from Salem. Known for its vibrant color and medicinal properties.",
    price: 200, // Price per kg (for powder)
    unit: "kg",
    image: "/placeholder.svg?height=400&width=400",
    category: "spices",
    farmer: {
      id: "farmer9",
      name: "Salem Spice Traders",
      location: "Salem, Tamil Nadu",
      image: "/placeholder.svg?height=100&width=100",
    },
    organic: true,
    inStock: true,
    quantity: 100, // Quantity in kg
  },
  {
    id: "10",
    name: "Pure Cow Ghee",
    description: "Traditionally made pure ghee from cow's milk. Rich aroma and granular texture.",
    price: 800, // Price per kg
    unit: "kg", // Often sold in jars, but kg is a standard unit
    image: "/placeholder.svg?height=400&width=400",
    category: "dairy",
    farmer: {
      id: "farmer10",
      name: "Anand Dairy Cooperative",
      location: "Anand, Gujarat",
      image: "/placeholder.svg?height=100&width=100",
    },
    organic: false,
    inStock: true,
    quantity: 50, // Quantity in kg
  },
   {
    id: "11",
    name: "Cauliflower (Phool Gobi)",
    description: "Fresh, firm heads of cauliflower. Excellent for Gobi Manchurian or Aloo Gobi.",
    price: 40, // Price per piece (often sold by piece)
    unit: "piece",
    image: "/placeholder.svg?height=400&width=400",
    category: "vegetables",
    farmer: {
      id: "farmer11",
      name: "Nilgiri Vegetable Growers",
      location: "Ooty, Tamil Nadu",
      image: "/placeholder.svg?height=100&width=100",
    },
    organic: true,
    inStock: true,
    quantity: 100, // Quantity in pieces
  },
   {
    id: "12",
    name: "Fresh Coconut (Nariyal)",
    description: "Whole coconuts, great for cooking, extracting milk, or drinking fresh water.",
    price: 35, // Price per piece
    unit: "piece",
    image: "/placeholder.svg?height=400&width=400",
    category: "fruits", // Botanically a fruit, often used like a vegetable/nut
    farmer: {
      id: "farmer12",
      name: "Kerala Coconut Grove",
      location: "Kochi, Kerala",
      image: "/placeholder.svg?height=100&width=100",
    },
    organic: true,
    inStock: false, // Example: Out of stock
    quantity: 0,
  },
]