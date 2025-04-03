export interface Sweepstakes {
  title: string
  featured?: boolean
  sweepstakes_review_count?: number
  player_review_count?: number
  sweepstakes_url?: string
  year_established?: string
  owner?: string
  owner_company_url?: string
  affiliate_url?: string
  logo?: string
  gallery?: Gallery[]
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

export interface Gallery {
  title: string
  image: string
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
  __typename: 'SweepstakesCustomer_support_methodsLive_chat'
  live_chat_url: string
}

interface Email {
  __typename: 'SweepstakesCustomer_support_methodsEmail'
  email: string
}

interface Phone {
  __typename: 'SweepstakesCustomer_support_methodsPhone'
  phone: string
}

interface SupportAvailability {
  __typename: 'SweepstakesCustomer_support_methodsSupport_availability'
  support_availability: string
}

interface Positives {
  __typename: 'SweepstakesPositives_negativesPositives'
  pros: string
}

interface Negatives {
  __typename: 'SweepstakesPositives_negativesNegatives'
  cons: string
}

interface BonusBase {
  bonus_title: string
  bonus_code: string
  bonus_link: string
  bonus_description: string
  __typename: string
}

interface WelcomeBonus extends BonusBase {
  __typename: 'welcome_bonus'
}

interface MatchDepositBonus extends BonusBase {
  __typename: 'matchdeposit_bonus'
}

interface ReloadBonus extends BonusBase {
  __typename: 'reload_bonus'
}

interface RegularBonus extends BonusBase {
  __typename: 'regular_bonus'
}

interface FreeSpinsBonus extends BonusBase {
  __typename: 'freespins_bonus'
}

interface CashbackBonus extends BonusBase {
  __typename: 'cashback_bonus'
}

interface VIPBonus extends BonusBase {
  __typename: 'vip_bonus'
} 