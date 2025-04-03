import { videoBlockSchema } from "@/components/blocks/video";
import type { Collection } from "tinacms";

const Sweepstakes: Collection = {
  label: "Sweepstakes",
  name: "sweepstakes",
  path: "content/sweepstakes",
  format: "mdx",

  defaultItem: () => {
    return {
      title: 'New Sweepstakes',
      date: new Date().toISOString(),
 
    }
  },
  ui: {
    router: ({ document }) => {                  
      return `/sweepstakes/${document._sys.breadcrumbs.join("/")}`;
    },
  },
  fields: [
    {
      type: "string",
      label: "Brand Name",
      name: "title",
      isTitle: true,
      required: true,
    },
    {
      type: 'boolean',
      name: 'featured',
      label: 'Featured'
    },
    {
      type: 'number',
      name: 'sweepstakes_review_count',
      label: 'Sweepstakes Review Count',
      description:'Safety Index Sweepstakes Review Count.'
    },
    {
      type: 'number',
      name: 'player_review_count',
      label: 'Player rating Count',
      description:'Safety Index Players Rating Count.'
    },
    {
      type: "string",
      label: "Website URL / Visit Sweepstakes",
      name: "sweepstakes_url",
      searchable: false,
    },
    {
      label: "Year Established",
      name: "year_established",
      type: "datetime",
      ui: {
        dateFormat: 'YYYY',
        parse: (value: any) => {
          return value && typeof value.format === 'function' ? value.format('YYYY') : value;
        },
      },
    },
    {
      type: "string",
      label: "Owner Company",
      name: "owner",
    },
    {
      type: "string",
      label: "Owner Company URL",
      name: "owner_company_url",
    },
    {
      type: "string",
      label: "Affiliate Program URL",
      name: "affiliate_url",
    },
    {
      type: "image",
      name: "logo",
      label: "LOGO Image",
    },
    {
      type: "image",
      name: "heroImg",
      label: "Hero Image",
    },
    {
      label: "Image Gallery",
      name: "gallery",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          // Field values are accessed by item?.<Field name>
          return { label: item?.title };
        },
      },
      fields: [
        {
          label: "Title",
          name: "title",
          type: "string",
        },
        { label: "Image", name: "image", type: "image" }
      ],
    },
    {
      type: "rich-text",
      label: "Excerpt",
      name: "excerpt",
    },
    {
      type: "rich-text",
      label: "Body",
      name: "_body",
      templates: [
        {
          name: "BlockQuote",
          label: "Block Quote",
          fields: [
            {
              name: "children",
              label: "Quote",
              type: "rich-text",
            },
            {
              name: "authorName",
              label: "Author",
              type: "string",
            },
          ],
        },
        {
          name: "DateTime",
          label: "Date & Time",
          inline: true,
          fields: [
            {
              name: "format",
              label: "Format",
              type: "string",
              options: ["utc", "iso", "local"],
            },
          ],
        },
        {
          name: "NewsletterSignup",
          label: "Newsletter Sign Up",
          fields: [
            {
              name: "children",
              label: "CTA",
              type: "rich-text",
            },
            {
              name: "placeholder",
              label: "Placeholder",
              type: "string",
            },
            {
              name: "buttonText",
              label: "Button Text",
              type: "string",
            },
            {
              name: "disclaimer",
              label: "Disclaimer",
              type: "rich-text",
            },
          ],
          ui: {
            defaultItem: {
              placeholder: "Enter your email",
              buttonText: "Notify Me",
            },
          },
        },
        videoBlockSchema,
      ],
      isBody: true,
    },
    {
      type: "datetime",
      label: "Posted Date",
      name: "date",
      ui: {
        dateFormat: "MMMM DD YYYY",
        timeFormat: "hh:mm A",
      },
    },
    {
      type: 'string',
      name: 'tags',
      label: 'Tags',
      list: true,
      searchable: true,
      ui: {
        component: 'tags',
      },
    },
    {
      label: "Mobile App",
      name: "mobile_app",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: `${item.marketplace}` }
        },
          defaultItem: {
            marketplace: true,
            android_app: "#",
            ios_app: "#",
        }
      },
      fields: [
        {
          type: 'boolean',
          name: 'marketplace',
          label: 'IN marketplace'
        },
        {
          label: "Android Mobile App",
          name: "android_app",
          type: "string",
        },
        {
          label: "IOS Mobile App",
          name: "ios_app",
          type: "string",
        }
      ]
    },

{
  label: "Supported Currencies",
  name: "currencies",
  type: "object",
  list: true,
  ui: {
    itemProps: (item) => {
      return { label: `${item.count}` }
    },
      defaultItem: {
        count: 25,
        all_currencies: "United States Dollar (USD), Euro (EUR), British Pound Sterling (GBP), Japanese Yen (JPY), Canadian Dollar (CAD), Australian Dollar (AUD), Swiss Franc (CHF), Chinese Yuan Renminbi (CNY), Indian Rupee (INR), South Korean Won (KRW), Brazilian Real (BRL), Mexican Peso (MXN), Russian Ruble (RUB), Hong Kong Dollar (HKD), Singapore Dollar (SGD), New Zealand Dollar (NZD), Swedish Krona (SEK), Norwegian Krone (NOK), Danish Krone (DKK), Turkish Lira (TRY), South African Rand (ZAR), United Arab Emirates Dirham (AED), Saudi Riyal (SAR), Indonesian Rupiah (IDR), Thai Baht (THB)",
    }
  },
  fields: [
    {
      label: "Currencies count",
      name: "count",
      type: 'number',
    },
    {
      label: "All Currencies",
      name: "all_currencies",
      type: "string",
      ui: {
        component: "textarea"
      }
    }
  ]
},
{
  label: "Licensing Authorities",
  name: "authorities",
  type: "object",
  list: true,
  ui: {
    itemProps: (item) => {
      return { label: `${item.count}` }
    },
      defaultItem: {
        count: 28,
        all_authorities: "Alderney (AGCC), Belgium (KSC), Colombia (COLJ), Comoros (AOFA), Connecticut (DCP), Curaçao (ANT), Curaçao (GCB), Curaçao (CIL), Curaçao (CEG), Curaçao (GC), Denmark (DGA), Germany (GGL), Gibraltar (GLA), Isle of Man (GSC), Italy (ADM), Kahnawake (KGC), Malta (MGA), Michigan (MGCB), Netherlands (KSA), New Brunswick (TGC), New Jersey (DGE), Ontario (iGO), Pennsylvania (PGCB), Portugal (SRIJ), Spain (DGOJ), Sweden (SGA), Switzerland (ESBK), United Kingdom (UKGC)",
    }
  },
  fields: [
    {
      label: "Authorities count",
      name: "count",
      type: 'number',
    },
    {
      label: "All Authorities",
      name: "all_authorities",
      type: "string",
      ui: {
        component: "textarea"
      }
    }
  ]
},
{
  label: "Restricted countries",
  name: "restricted_countries",
  type: "object",
  list: true,
  ui: {
    itemProps: (item) => {
      return { label: `${item.count}` }
    },
      defaultItem: {
        count: 0,
        all_restricted_countries: "",
    }
  },
  fields: [
    {
      label: "Restricted countries count",
      name: "count",
      type: 'number',
    },
    {
      label: "All Restricted countries",
      name: "all_restricted_countries",
      type: "string",
      ui: {
        component: "textarea"
      }
    }
  ]
},

{
  label: "Language versions",
  name: "language",
  type: "object",
  list: true,
  ui: {
    itemProps: (item) => {
      return { label: `${item.count}` }
    },
      defaultItem: {
        count: 51,
        all_language: "Albanian, Armenian, Arabic, Azerbaijani, Bengali, Bulgarian, Portuguese, Bosnian, Chinese, Czech, German, Danish, English, Spanish, Estonian, Finnish, French, Georgian, Greek, Hebrew, Hindi, Croatian, Hungarian, Indonesian, Italian, Japanese, Central Khmer, Korean, Kurdish, Kazakh, Persian, Latvian, Lithuanian, Macedonian, Malay, Norwegian, Nepali, Polish, Romanian, Serbian, Russian, Swedish, Slovenian, Somali, Swahili, Thai, Tajik, Turkish, Ukrainian, Uzbek, Vietnamese",
    }
  },
  fields: [
    {
      label: "Language versions count",
      name: "count",
      type: 'number',
    },
    {
      label: "All Language",
      name: "all_language",
      type: "string",
      ui: {
        component: "textarea"
      }
    }
  ]
},
{
  label: "Deposit Methods",
  name: "deposit_methods",
  type: "object",
  list: true,
  ui: {
    itemProps: (item) => {
      return { label: `${item.count}` }
    },
      defaultItem: {
        count: 14,
        all_deposit_methods: "Maestro, Visa, MasterCard, Skrill, Neteller, Payz, Neosurf, iDebit, Interac, MiFinity, MuchBetter, Bank Wire Transfer, Paysafecard, Pay4Fun",
    }
  },
  fields: [
    {
      label: "Deposit Methods count",
      name: "count",
      type: 'number',
    },
    {
      label: "All Deposit Methods",
      name: "all_deposit_methods",
      type: "string",
      ui: {
        component: "textarea"
      }
    }
  ]
},
{
  label: "Withdrawal Methods",
  name: "withdrawal_methods",
  type: "object",
  list: true,
  ui: {
    itemProps: (item) => {
      return { label: `${item.count}` }
    },
      defaultItem: {
        count: 12,
        all_withdrawal_methods: "Maestro, Visa, MasterCard, Skrill, Neteller, Payz, iDebit, Interac, MiFinity, MuchBetter, Bank Wire Transfer, Pay4Fun",
        withdrawal_limit_per_month: '$10,000',
        withdrawal_limit_per_week: '$2,500',
        withdrawal_limit_per_day: '$1,500'
    }
  },
  fields: [
    {
      label: "Withdrawal Methods count",
      name: "count",
      type: 'number',
    },
    {
      label: "All Withdrawal Methods",
      name: "all_withdrawal_methods",
      type: "string",
      ui: {
        component: "textarea"
      }
    },
    {
      label: "Withdrawal Limit / per month",
      name: "withdrawal_limit_per_month",
      type: "string",
    },
    {
      label: "Withdrawal Limit / per week",
      name: "withdrawal_limit_per_week",
      type: "string",
    },
    {
      label: "Withdrawal Limit / per day",
      name: "withdrawal_limit_per_day",
      type: "string",
    }
  ]
},
{
  label: "Software Providers",
  name: "software_providers",
  type: "object",
  list: true,
  ui: {
    itemProps: (item) => {
      return { label: `${item.count}` }
    },
      defaultItem: {
        count: 55,
        all_software_providers: "Pragmatic Play, Evolution Gaming, BGaming, Play'n GO, Playson, Wazdan, Push Gaming, TrueLab Games, Spinomenal, Thunderkick, Relax Gaming, Hacksaw Gaming, Nolimit City, Elk Studios, Endorphina, Yggdrasil Gaming, Red Tiger Gaming, 1x2Games, Amusnet (Former EGT Interactive), Avatar UX, Big Time Gaming, Booming Games, Betsoft, Crazy Tooth Studio, Eyecon, Fantasma Games, Games Global, Gaming Corps, Gamomat, Golden Hero Games, Holle Games, High5Games, Iron Dog Studios, Just For The Win, Kalamba Games, NetEnt, Northern Lights Gaming, Oryx Gaming, Pocket Games Soft, Platipus Gaming, Red Rake Gaming, ReelPlay, Revolver Gaming, Spade Gaming, Spearhead Studios, Spinmatic Entertainment, SmartSoft Gaming, Spribe, Spinoro, Playtech, Leander Games, Tom Horn Gaming, Caleta Gaming, Swintt, Mascot Gaming, Atomic Slot Lab, Indigo Magic",
    }
  },
  fields: [
    {
      label: "Software Providers count",
      name: "count",
      type: 'number',
    },
    {
      label: "All Software Providers",
      name: "all_software_providers",
      type: "string",
      ui: {
        component: "textarea"
      }
    }
  ]
},
{
  label: "Game Categories",
  name: "game_categories",
  type: "object",
  list: true,
  ui: {
    itemProps: (item) => {
      return { label: `categories: ${item.game_category.length} / games: ${item.all_games_count}` }
    },
      defaultItem: {
        all_games_count: 100,
        game_category: [
          "slots",
          "roulette",
          "blackjack",
          "betting",
          "video_poker",
          "bingo",
          "baccarat",
          "jackpot_games",
          "live_games",
          "no_poker",
          "craps_dice",
          "keno",
          "scratch_cards",
          "sports_betting",
          "esports_betting",
          "crash_games"
          
        ]
    }
  },
  fields: [
    {
      label: "Number of Games count",
      name: "all_games_count",
      type: 'number',
    },
    {
      type: 'string',
      name: 'game_category',
      label: 'Game Category',
      list: true,
        options: [
          { value: "slots", label: "Slots" },
          { value: "roulette", label: "Roulette" },
          { value: "blackjack", label: "Blackjack" },
          { value: "betting", label: "Betting" },
          { value: "video_poker", label: "Video Poker" },
          { value: "bingo", label: "Bingo" },
          { value: "baccarat", label: "Baccarat" },
          { value: "jackpot_games", label: "Jackpot Games" },
          { value: "live_games", label: "Live Games" },
          { value: "no_poker", label: "No Poker" },
          { value: "craps_dice", label: "Craps and Dice" },
          { value: "keno", label: "Keno" },
          { value: "scratch_cards", label: "Scratch Cards" },
          { value: "esports_betting", label: "eSports Betting" },
          { value: "sports_betting", label: "Sports Betting" },
          { value: "crash_games", label: "Crash Games" }
        ]
    }
  ]
},
{
  label: "Customer Support Methods",
  name: "customer_support_methods",
  type: "object",
  list: true,
  templates: [
    {
      label: "Live Chat",
      name: "live_chat",
      fields: [{
        label: "Live Chat link",
        name: "live_chat_url",
        type: 'string',
      }]
    },
    {
      label: "Email",
      name: "email",
      fields: [{
        label: "Email",
        name: "email",
        type: 'string',
      }]
    },
    {
      label: "Phone",
      name: "phone",
      fields: [{
        label: "Phone",
        name: "phone",
        type: 'string',
      }]
    },
    {
      label: "Support Availability",
      name: "support_availability",
      fields: [{
        label: "Support Availability",
        name: "support_availability",
        type: 'string',
        ui: {
          component: "textarea"
        }
      }]
    },
  ]
},
{
  label: "Positives-Negatives",
  name: "positives_negatives",
  type: "object",
  list: true,
  templates: [
    {
      label: "Positives",
      name: "positives",
      fields: [{
        label: "Pros",
        name: "pros",
        type: 'string',
        ui: {
          component: "textarea"
        }
      }]
    },
    {
      label: "Negatives",
      name: "negatives",
      fields: [{
        label: "Cons",
        name: "cons",
        type: 'string',
        ui: {
          component: "textarea"
        }
      }]
    },
  ]
},

{
  label: "Casino Bonuses",
  name: "bonuses",
  type: "object",
  list: true,
  templates: [
    {
      label: "Welcome Bonus",
      name: "welcome_bonus",
      fields: [
        {
          label: "Bonus Title",
          name: "bonus_title",
          type: 'string'
        },
        {
          label: "Bonus Code",
          name: "bonus_code",
          type: 'string'
        },
        {
          label: "Bonus Link",
          name: "bonus_link",
          type: 'string'
        },
        {
        label: "Bonus description",
        name: "bonus_description",
        type: "rich-text",
      }]
    },
    {
      label: "Match Deposit Bonus",
      name: "matchdeposit_bonus",
      fields: [
        {
          label: "Bonus Title",
          name: "bonus_title",
          type: 'string'
        },
        {
          label: "Bonus Code",
          name: "bonus_code",
          type: 'string'
        },
        {
          label: "Bonus Link",
          name: "bonus_link",
          type: 'string'
        },
        {
        label: "Bonus description",
        name: "bonus_description",
        type: "rich-text",
      }]
    },
    {
      label: "Reload Bonus",
      name: "reload_bonus",
      fields: [
        {
          label: "Bonus Title",
          name: "bonus_title",
          type: 'string'
        },
        {
          label: "Bonus Code",
          name: "bonus_code",
          type: 'string'
        },
        {
          label: "Bonus Link",
          name: "bonus_link",
          type: 'string'
        },
        {
        label: "Bonus description",
        name: "bonus_description",
        type: "rich-text",
      }]
    },
    {
      label: "Regular Bonus",
      name: "regular_bonus",
      fields: [
        {
          label: "Bonus Title",
          name: "bonus_title",
          type: 'string'
        },
        {
          label: "Bonus Code",
          name: "bonus_code",
          type: 'string'
        },
        {
          label: "Bonus Link",
          name: "bonus_link",
          type: 'string'
        },
        {
        label: "Bonus description",
        name: "bonus_description",
        type: "rich-text",
      }]
    },
    {
      label: "Free Spins Bonus",
      name: "freespins_bonus",
      fields: [
        {
          label: "Bonus Title",
          name: "bonus_title",
          type: 'string'
        },
        {
          label: "Bonus Code",
          name: "bonus_code",
          type: 'string'
        },
        {
          label: "Bonus Link",
          name: "bonus_link",
          type: 'string'
        },
        {
        label: "Bonus description",
        name: "bonus_description",
        type: "rich-text",
      }]
    },
    {
      label: "Cashback Bonus",
      name: "cashback_bonus",
      fields: [
        {
          label: "Bonus Title",
          name: "bonus_title",
          type: 'string'
        },
        {
          label: "Bonus Code",
          name: "bonus_code",
          type: 'string'
        },
        {
          label: "Bonus Link",
          name: "bonus_link",
          type: 'string'
        },
        {
        label: "Bonus description",
        name: "bonus_description",
        type: "rich-text",
      }]
    },
    {
      label: "VIP Bonus",
      name: "vip_bonus",
      fields: [
        {
          label: "Bonus Title",
          name: "bonus_title",
          type: 'string'
        },
        {
          label: "Bonus Code",
          name: "bonus_code",
          type: 'string'
        },
        {
          label: "Bonus Link",
          name: "bonus_link",
          type: 'string'
        },
        {
        label: "Bonus description",
        name: "bonus_description",
        type: "rich-text",
      }]
    },
  ]
},
    
  ],
};

export default Sweepstakes;





