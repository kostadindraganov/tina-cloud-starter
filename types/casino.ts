export interface Casino {
  title: string
  featured?: boolean
  casino_review_count?: number
  player_review_count?: number
  casino_url?: string
  year_established?: string
  owner?: string
  owner_company_url?: string
  affiliate_url?: string
  logo?: string
  heroImg?: string
  excerpt?: any
  _body?: any
  date?: string
  tags?: string[]
  mobile_app?: MobileApp[]
  currencies?: Currency[]
  authorities?: Authority[]
  restricted_countries?: RestrictedCountry[]
  language?: Language[]
  deposit_methods?: DepositMethod[]
  withdrawal_methods?: WithdrawalMethod[]
  software_providers?: SoftwareProvider[]
  game_categories?: GameCategory[]
  customer_support_methods?: (LiveChat | Email | Phone | SupportAvailability)[]
  positives_negatives?: (Positives | Negatives)[]
  bonuses?: (WelcomeBonus | MatchDepositBonus | ReloadBonus | RegularBonus | FreeSpinsBonus | CashbackBonus | VIPBonus)[]
}

interface MobileApp {
  marketplace: boolean
  android_app: string
  ios_app: string
}

interface Currency {
  count: number
  all_currencies: string
}

interface Authority {
  count: number
  all_authorities: string
}

interface RestrictedCountry {
  count: number
  all_restricted_countries: string
}

interface Language {
  count: number
  all_language: string
}

interface DepositMethod {
  count: number
  all_deposit_methods: string
}

interface WithdrawalMethod {
  count: number
  all_withdrawal_methods: string
  withdrawal_limit_per_month?: string
  withdrawal_limit_per_week?: string
  withdrawal_limit_per_day?: string
}

interface SoftwareProvider {
  count: number
  all_software_providers: string
}

interface GameCategory {
  all_games_count: number
  game_category: string[]
}

interface LiveChat {
  __typename: 'CasinoCustomer_support_methodsLive_chat'
  live_chat_url: string
}

interface Email {
  __typename: 'CasinoCustomer_support_methodsEmail'
  email: string
}

interface Phone {
  __typename: 'CasinoCustomer_support_methodsPhone'
  phone: string
}

interface SupportAvailability {
  __typename: 'CasinoCustomer_support_methodsSupport_availability'
  support_availability: string
}

interface Positives {
  _template: 'positives'
  pros: string
}

interface Negatives {
  _template: 'negatives'
  cons: string
}

interface BonusBase {
  bonus_title: string
  bonus_code: string
  bonus_link: string
  bonus_description: string
}

interface WelcomeBonus extends BonusBase {
  _template: 'welcome_bonus'
}

interface MatchDepositBonus extends BonusBase {
  _template: 'match_deposit_bonus'
}

interface ReloadBonus extends BonusBase {
  _template: 'reload_bonus'
}

interface RegularBonus extends BonusBase {
  _template: 'regular_bonus'
}

interface FreeSpinsBonus extends BonusBase {
  _template: 'free_spins_bonus'
}

interface CashbackBonus extends BonusBase {
  _template: 'cashback_bonus'
}

interface VIPBonus extends BonusBase {
  _template: 'vip_bonus'
} 