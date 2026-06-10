// Единый источник правды по серверам, режимам, ссылкам и цветам.

export type ModeKey =
  | 'minigames'
  | 'norules'
  | 'lightrp'
  | 'mediumrp'
  | 'hardrp'
  | 'hell'
  | 'softrp'

/** Один игровой сервер (конкретный IP:PORT внутри режима). */
export interface GameServer {
  label: string // что показать на кнопке, напр. "Medium RP 2"
  ip: string // "185.9.145.76:7777"
  placeholder?: boolean // ещё не запущен
}

/** Карточка режима: цвет, описание, набор серверов. */
export interface ModeCard {
  key: ModeKey
  title: string
  color: string // акцент режима (hex)
  blurb: string // короткое описание
  servers: GameServer[]
  rules?: string // ссылка на документ с правилами режима
  extraLink?: { label: string; href: string } // напр. отдельный сайт Hard RP
}

export interface GameBlock {
  id: string // якорь секции
  path: string // URL подстраницы, напр. "/sl"
  game: string // полное имя игры
  short: string // короткий тег
  tagline: string
  logo: string // путь к логотипу сервера в public/
  discord: string // Discord-сервер игры
  modes: ModeCard[]
}

const SL_IP = '185.9.145.76'
const CBM_IP = '193.164.17.93'

export const COLORS = {
  minigames: '#ffff1f',
  norules: '#f4003d',
  lightrp: '#00fcc1',
  mediumrp: '#03a9f4',
  hardrp: '#ff8c00',
  hell: '#f4003d',
  softrp: '#00fcc1',
} as const satisfies Record<ModeKey, string>

export const SCP_SL: GameBlock = {
  id: 'scpsl',
  path: '/sl',
  game: 'SCP: Secret Laboratory',
  short: 'SCP:SL',
  tagline: 'Командная игра по мотивам Фонда SCP. От хаоса без правил до глубокого ролевого режима.',
  logo: '/logos/sl.png',
  discord: 'https://discord.gg/9VWehX3V7N',
  modes: [
    {
      key: 'minigames',
      title: 'Minigames',
      color: COLORS.minigames,
      blurb: 'Аркадные мини-игры вместо обычных раундов. Открытие - совсем скоро.',
      servers: [{ label: 'Скоро', ip: '', placeholder: true }],
    },
    {
      key: 'norules',
      title: 'No Rules',
      color: COLORS.norules,
      blurb: 'Никаких правил. Бери что хочешь, стреляй в кого хочешь, выживай как можешь.',
      servers: [{ label: 'No Rules', ip: `${SL_IP}:7787` }],
      rules: 'https://docs.google.com/document/d/1JsllZ1oNIQulaNGz3p2lVhsH4z2mzIIyGMiGfotJ5_s/edit?tab=t.0',
    },
    {
      key: 'lightrp',
      title: 'Light RP',
      color: COLORS.lightrp,
      blurb: 'Точка входа для новичков. Минимум правил, легкое освоение.',
      servers: [
        { label: 'Light RP 1', ip: `${SL_IP}:7781` },
        { label: 'Light RP 2', ip: `${SL_IP}:7782` },
      ],
      rules: 'https://docs.google.com/document/d/1Z3-SddIOMDoLUNCVajfh6yViA6EGIEsdsjiZ8-wPKhQ/edit?tab=t.0#heading=h.lrrrcktzkkc3',
    },
    {
      key: 'mediumrp',
      title: 'Medium RP',
      color: COLORS.mediumrp,
      blurb: 'Золотая середина: правила держат игру в рамках, но не сильно ограничивают в размахе.',
      servers: [
        { label: 'Medium RP 1', ip: `${SL_IP}:7777` },
        { label: 'Medium RP 2', ip: `${SL_IP}:7778` },
        { label: 'Medium RP 3', ip: `${SL_IP}:7779` },
      ],
      rules: 'https://docs.google.com/document/d/1wStWgMXMTeaXBB2LsSg3Yy0tnriDrnnHO_Nw6Agalm4/edit?tab=t.wmcqfqrlogd0#heading=h.3p0rek9yucpf',
    },
    {
      key: 'hardrp',
      title: 'Hard RP',
      color: COLORS.hardrp,
      blurb: 'Жёсткий отыгрыш по полным правилам. Для тех, готов играть всерьёз.',
      servers: [{ label: 'Hard RP', ip: `${SL_IP}:7784` }],
      rules: 'https://docs.google.com/document/d/1MLsWuiaynGqKk5ju8GgdNaGdbwK0WnVVpKh1_y7_YRI/edit?tab=t.0',
      extraLink: { label: 'Сайт Hard RP', href: 'https://hrp.funclub.pro/' },
    },
  ],
}

export const SCP_CBM: GameBlock = {
  id: 'scpcbm',
  path: '/cbm',
  game: 'SCP: Containment Breach Multiplayer / CB2',
  short: 'SCP:CBM / CB2',
  tagline: 'Кооперативный хоррор в коридорах Фонда. От мягкого RP до настоящего ада.',
  logo: '/logos/cbm.png',
  discord: 'https://discord.gg/ZFPq2PXKTA',
  modes: [
    {
      key: 'softrp',
      title: 'Soft RP (CBM)',
      color: COLORS.softrp,
      blurb: 'Спокойное знакомство с Containment Breach. Мягкие правила, дружелюбный народ.',
      servers: [{ label: 'Soft RP CBM', ip: `${CBM_IP}:50023` }],
      rules: 'https://docs.google.com/document/d/1xMPpFYia5A-BAYhm7Kg6czExB_FayO--Mtamrkw8xMM/edit?tab=t.0',
    },
    {
      key: 'softrp',
      title: 'Soft RP (CB2)',
      color: COLORS.softrp,
      blurb: 'Тот же мягкий вход, теперь на движке CB2. Осваивайся без спешки.',
      servers: [{ label: 'Soft RP CB2', ip: `${CBM_IP}:1131` }],
      rules: 'https://docs.google.com/document/d/1rp28VI0-YGxNEaqhVBAzkSfEJjCsIVs7PH4TUo2kZ0M/edit?tab=t.0',
    },
    {
      key: 'mediumrp',
      title: 'Medium RP (CB2)',
      color: COLORS.mediumrp,
      blurb: 'Умеренные правила и живой отыгрыш в коридорах CB2.',
      servers: [{ label: 'Medium RP CB2', ip: `${CBM_IP}:1130` }],
      rules: 'https://docs.google.com/document/d/1ESLoE7xVVUEg81HRwn_gUJoulmGSFsfEgZ83UvidBmc/edit?tab=t.0#heading=h.cz0n24xyvgjw',
    },
    {
      key: 'hardrp',
      title: 'Hard RP (CB2)',
      color: COLORS.hardrp,
      blurb: 'Глубокий отыгрыш CB2 для тех, кто знает лор назубок.',
      servers: [{ label: 'Hard RP CB2', ip: `${CBM_IP}:1132` }],
      rules: 'https://docs.google.com/document/d/1GS305aV6RHGvC1Dl_BYpFapX6oWdOJlu-2FsZOHJTAs/edit?tab=t.0',
    },
    {
      key: 'hell',
      title: 'Hell (CB2)',
      color: COLORS.hell,
      blurb: 'Ад без правил. Только для самых отчаянных.',
      servers: [{ label: 'Hell CB2', ip: `${CBM_IP}:1133` }],
      rules: 'https://docs.google.com/document/d/1NatMO5cbZtvCl8y96z9mG8c7B1IgoIdVnY_rErMcx7Y/edit?tab=t.0#heading=h.pl33nruz5q4n',
    },
  ],
}

export const GAME_BLOCKS = [SCP_SL, SCP_CBM]

export type BrandIconName = 'discord' | 'telegram' | 'twitch' | 'youtube' | 'donate'

export interface SocialLink {
  label: string
  href: string
  group: 'discord' | 'telegram' | 'stream' | 'donate'
  icon: BrandIconName
}

/** Discord-серверы по играм — для кнопок с выбором, куда зайти. */
export const DISCORDS = [
  {
    label: 'SCP: Secret Laboratory',
    short: 'SCP:SL',
    href: 'https://discord.gg/9VWehX3V7N',
    logo: SCP_SL.logo,
    tint: '#20a8e8',
  },
  {
    label: 'Containment Breach / CB2',
    short: 'CBM / CB2',
    href: 'https://discord.gg/ZFPq2PXKTA',
    logo: SCP_CBM.logo,
    tint: '#f4003d',
  },
] as const

export const DONATE_URL = 'https://modalniy.store'

export const SOCIALS: SocialLink[] = [
  { label: 'Discord SCP:SL', href: 'https://discord.gg/9VWehX3V7N', group: 'discord', icon: 'discord' },
  { label: 'Discord CBM/CB2', href: 'https://discord.gg/ZFPq2PXKTA', group: 'discord', icon: 'discord' },
  { label: 'Telegram SCP:SL', href: 'https://t.me/funscp', group: 'telegram', icon: 'telegram' },
  { label: 'Telegram CBM/CB2', href: 'https://t.me/funclubscpcbm', group: 'telegram', icon: 'telegram' },
  { label: 'Twitch', href: 'https://www.twitch.tv/funclub_scp', group: 'stream', icon: 'twitch' },
  { label: 'YouTube', href: 'https://www.youtube.com/@FUNCLUB_RU', group: 'stream', icon: 'youtube' },
  { label: 'Донат', href: 'https://modalniy.store', group: 'donate', icon: 'donate' },
]

/** Частые вопросы для главной. Тексты — плейсхолдеры, заменить позже. */
export interface FaqItem {
  q: string
  a: string
}

export const FAQ: FaqItem[] = [
  {
    q: 'Как зайти на сервер?',
    a: 'Выбери интересующий сервер на сайте и скопируй IP - затем открой в игре Direct Connect и вставь адрес.',
  },
  {
    q: 'Чем отличаются режимы?',
    a: 'Строгостью правил и дозволенными рамками отыгрыша. Например, на No Rules вам не требуется знать лор или соблюдать кучу правил, когда на Hard RP все наоборот.',
  },
  {
    q: 'Как стать частью команды?',
    a: 'В канале #анкеты Discord-серверов. У нас куча различных вакансий, место найдется каждому!',
  },
  {
    q: 'Что делать, если столкнулся с нарушителем?',
    a: 'Обратиться к администратору на сервере, либо в канал #жалобы-разбан соответствующего Discord-сервера.',
  },
  {
    q: 'У меня есть предложения, которые могут улучшить проект!',
    a: 'Прекрасно! Отправь его в раздел #предложения-*сервер* соответствующего дискорд-сервера, и его обязательно разберут!',
  },
  {
    q: 'Где можно ознакомиться с отдельным сервером подробнее?',
    a: 'В каналах Discord-серверов #описание-*сервер* (SL), либо в игровом описании сервера.',
  },
]
