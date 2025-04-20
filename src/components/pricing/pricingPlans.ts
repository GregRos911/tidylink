
const pricingPlans = [
  {
    name: "Free Plan",
    priceId: null, // Free tier does not use Stripe
    price: "$0",
    description: "Try all features free for 1 week. After that, you'll need to upgrade to a paid plan.",
    features: [
      "Up to 7 short links per week",
      "Up to 5 QR codes",
      "Basic analytics",
      "All starter features for 1 week"
    ],
    buttonText: "Start free trial (1 week)",
    color: "from-neutral-100 to-neutral-200",
    highlighted: false
  },
  {
    name: "Starter Plan",
    priceId: "price_1RG74DKsMMugzAZwjxqj0tY3",
    price: "$5/mo",
    description: "Everything you need to create your own short links.",
    features: [
      "Up to 200 short links per month",
      "10 QR code generations",
      "60 days of scan & click data",
      "An advanced UTM builder",
      "Link & QR code redirects",
      "Advanced QR code customizations"
    ],
    buttonText: "Get started",
    color: "from-blue-100 to-blue-200",
    highlighted: false
  },
  {
    name: "Growth Plan",
    priceId: "price_1RG776KsMMugzAZwplIX6K9N",
    price: "$20/mo",
    description: "Support a growing team with extra features.",
    features: [
      "Up to 700 short links per month",
      "20 QR codes per month",
      "Premium QR codes with analytics",
      "Unlimited click history tracking",
      "Team collaboration features",
      "Branded links"
    ],
    buttonText: "Get started",
    color: "from-purple-100 to-purple-200",
    highlighted: true
  },
  {
    name: "Enterprise Plan",
    priceId: "price_1RG798KsMMugzAZwG2CXzMJe",
    price: "$150/mo",
    description: "A ton of features that will help your business grow and scale up.",
    features: [
      "Unlimited short links",
      "White-label link shortening",
      "Dedicated account manager",
      "SSO and advanced security",
      "Custom contract & SLA"
    ],
    buttonText: "Get started",
    color: "from-pink-100 to-pink-200",
    highlighted: false
  }
];

export default pricingPlans;
