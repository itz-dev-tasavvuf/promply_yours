
import React from 'react';

export type IconType =
  | 'AcademicCapIcon' | 'AdjustmentsIcon' | 'AnnotationIcon' | 'ArchiveIcon' | 'ArrowCircleDownIcon'
  | 'ArrowCircleLeftIcon' | 'ArrowCircleRightIcon' | 'ArrowCircleUpIcon' | 'ArrowDownIcon' | 'ArrowLeftIcon'
  | 'ArrowNarrowDownIcon' | 'ArrowNarrowLeftIcon' | 'ArrowNarrowRightIcon' | 'ArrowNarrowUpIcon' | 'ArrowRightIcon'
  | 'ArrowUpIcon' | 'ArrowsExpandIcon' | 'AtSymbolIcon' | 'BackspaceIcon' | 'BadgeCheckIcon' | 'BanIcon'
  | 'BeakerIcon' | 'BellIcon' | 'BookOpenIcon' | 'BookmarkAltIcon' | 'BookmarkIcon' | 'BriefcaseIcon'
  | 'CakeIcon' | 'CalculatorIcon' | 'CalendarIcon' | 'CameraIcon' | 'CashIcon' | 'ChartBarIcon'
  | 'ChartPieIcon' | 'ChartSquareBarIcon' | 'ChatAlt2Icon' | 'ChatAltIcon' | 'ChatIcon' | 'CheckCircleIcon'
  | 'CheckIcon' | 'ChevronDoubleDownIcon' | 'ChevronDoubleLeftIcon' | 'ChevronDoubleRightIcon' | 'ChevronDoubleUpIcon'
  | 'ChevronDownIcon' | 'ChevronLeftIcon' | 'ChevronRightIcon' | 'ChevronUpIcon' | 'ChipIcon'
  | 'ClipboardCheckIcon' | 'ClipboardCopyIcon' | 'ClipboardListIcon' | 'ClipboardIcon' | 'ClockIcon'
  | 'CloudDownloadIcon' | 'CloudUploadIcon' | 'CloudIcon' | 'CodeIcon' | 'CogIcon' | 'CollectionIcon'
  | 'ColorSwatchIcon' | 'CreditCardIcon' | 'CubeTransparentIcon' | 'CubeIcon' | 'CurrencyBangladeshiIcon'
  | 'CurrencyDollarIcon' | 'CurrencyEuroIcon' | 'CurrencyPoundIcon' | 'CurrencyRupeeIcon' | 'CurrencyYenIcon'
  | 'CursorClickIcon' | 'DatabaseIcon' | 'DesktopComputerIcon' | 'DeviceMobileIcon' | 'DeviceTabletIcon'
  | 'DocumentAddIcon' | 'DocumentDownloadIcon' | 'DocumentDuplicateIcon' | 'DocumentRemoveIcon' | 'DocumentReportIcon'
  | 'DocumentSearchIcon' | 'DocumentTextIcon' | 'DocumentIcon' | 'DotsCircleHorizontalIcon' | 'DotsHorizontalIcon'
  | 'DotsVerticalIcon' | 'DownloadIcon' | 'DuplicateIcon' | 'EmojiHappyIcon' | 'EmojiSadIcon'
  | 'ExclamationCircleIcon' | 'ExclamationIcon' | 'ExternalLinkIcon' | 'EyeOffIcon' | 'EyeIcon'
  | 'FastForwardIcon' | 'FilmIcon' | 'FilterIcon' | 'FingerPrintIcon' | 'FireIcon' | 'FlagIcon'
  | 'FolderDownloadIcon' | 'FolderOpenIcon' | 'FolderRemoveIcon' | 'FolderAddIcon' | 'FolderIcon'
  | 'GiftIcon' | 'GlobeAltIcon' | 'GlobeIcon' | 'HandIcon' | 'HashtagIcon' | 'HeartIcon' | 'HomeIcon'
  | 'IdentificationIcon' | 'InboxInIcon' | 'InboxIcon' | 'InformationCircleIcon' | 'KeyIcon'
  | 'LibraryIcon' | 'LightBulbIcon' | 'LightningBoltIcon' | 'LinkIcon' | 'LocationMarkerIcon'
  | 'LockClosedIcon' | 'LockOpenIcon' | 'LoginIcon' | 'LogoutIcon' | 'MailOpenIcon' | 'MailIcon'
  | 'MapIcon' | 'MenuAlt1Icon' | 'MenuAlt2Icon' | 'MenuAlt3Icon' | 'MenuAlt4Icon' | 'MenuIcon'
  | 'MicrophoneIcon' | 'MinusCircleIcon' | 'MinusSmIcon' | 'MinusIcon' | 'MoonIcon' | 'MusicNoteIcon'
  | 'NewspaperIcon' | 'OfficeBuildingIcon' | 'PaperAirplaneIcon' | 'PaperClipIcon' | 'PauseIcon'
  | 'PencilAltIcon' | 'PencilIcon' | 'PhoneIncomingIcon' | 'PhoneMissedCallIcon' | 'PhoneOutgoingIcon'
  | 'PhoneIcon' | 'PhotographIcon' | 'PlayIcon' | 'PlusCircleIcon' | 'PlusSmIcon' | 'PlusIcon'
  | 'PresentationChartBarIcon' | 'PresentationChartLineIcon' | 'PrinterIcon' | 'PuzzleIcon'
  | 'QrcodeIcon' | 'QuestionMarkCircleIcon' | 'ReceiptRefundIcon' | 'ReceiptTaxIcon' | 'RefreshIcon'
  | 'ReplyIcon' | 'RewindIcon' | 'RssIcon' | 'SaveAsIcon' | 'SaveIcon' | 'ScaleIcon'
  | 'ScissorsIcon' | 'SearchCircleIcon' | 'SearchIcon' | 'SelectorIcon' | 'ServerIcon' | 'ShareIcon'
  | 'ShieldCheckIcon' | 'ShieldExclamationIcon' | 'ShoppingBagIcon' | 'ShoppingCartIcon' | 'SortAscendingIcon'
  | 'SortDescendingIcon' | 'SparklesIcon' | 'SpeakerphoneIcon' | 'StarIcon' | 'StatusOfflineIcon'
  | 'StatusOnlineIcon' | 'StopIcon' | 'SunIcon' | 'SupportIcon' | 'SwitchHorizontalIcon'
  | 'SwitchVerticalIcon' | 'TableIcon' | 'TagIcon' | 'TemplateIcon' | 'TerminalIcon'
  | 'ThumbDownIcon' | 'ThumbUpIcon' | 'TicketIcon' | 'TranslateIcon' | 'TrashIcon' | 'TrendingDownIcon'
  | 'TrendingUpIcon' | 'TruckIcon' | 'UploadIcon' | 'UserAddIcon' | 'UserCircleIcon' | 'UserGroupIcon'
  | 'UserRemoveIcon' | 'UserIcon' | 'UsersIcon' | 'VariableIcon' | 'VideoCameraIcon' | 'ViewBoardsIcon'
  | 'ViewGridAddIcon' | 'ViewGridIcon' | 'ViewListIcon' | 'VolumeOffIcon' | 'VolumeUpIcon'
  | 'WifiIcon' | 'XCircleIcon' | 'XIcon' | 'ZoomInIcon' | 'ZoomOutIcon'
  | 'SupabaseIcon' | 'NetlifyIcon' | 'GitHubIcon';


interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: IconType;
  className?: string;
}

// This is a highly simplified representation.
// A full implementation would have specific SVG paths for each icon.
const iconMap: Record<IconType, React.ReactNode> = {
  HomeIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  SparklesIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
  ClipboardListIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
  CogIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
  QuestionMarkCircleIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 1.152-.448 2.196-1.175 2.965l-.24.215c-.606.507-1.278 1.047-1.278 1.822v.006M10 18h4m-2-14a9 9 0 11-6.364 2.636A9 9 0 0112 3z" />,
  SunIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />,
  MoonIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />,
  SearchIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
  UserCircleIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  LogoutIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
  CursorClickIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l5-2 2 8z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519A4 4 0 0012 4.023a4 4 0 00-2.121-3.496m-.707.707L9.5 3.879M12 20.977a4 4 0 002.121 3.496m.707-.707L14.5 20.121M4.023 12A4 4 0 007.519 14.121m-.707.707L3.879 14.5M20.977 12a4 4 0 00-3.496-2.121m.707-.707L20.121 9.5" />,
  UploadIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
  CheckCircleIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  CheckIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
  CurrencyDollarIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  SwitchHorizontalIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
  CollectionIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
  LightningBoltIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
  DesktopComputerIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  CodeIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
  DocumentTextIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  PhotographIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  MicrophoneIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />,
  TranslateIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9.001a18.033 18.033 0 01-2.826-2.826l.04.039-.038-.039L12 12m0 0l.048.047.004-.004-.014-.014-.034.009L12 12zm0 0L12 12m2.828 4.95A18.023 18.023 0 0017.588 9M9 12h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  EyeIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />,
  ChatAlt2Icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />,
  XIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
  MenuIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />,
  ArrowRightIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />,
  ChipIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m14-4h-4a2 2 0 00-2 2v4m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4m-6 4h6m-6 4h6m6-4h.01M12 12h.01M12 9h.01M12 6h.01M9 12H5M9 9H5M9 6H5m6 6V5m0 0V3" />,
  RefreshIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0015.357 2m0 0H15" />,
  PencilAltIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
  BadgeCheckIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
  ClipboardCopyIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />,
  DocumentReportIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 00-4-4H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm8-10V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a4 4 0 014-4h2z" />,
  IdentificationIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 4h.01M9 12h.01M9 15h.01M12 15h.01M15 15h.01M12 12h.01M15 12h.01M15 9h.01M12 9h.01" />,
  DatabaseIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7a8 8 0 0116 0M4 12v3c0 2.21 3.582 4 8 4s8-1.79 8-4v-3" />,
  SupabaseIcon: <path d="M2.41,1.38,11.8,7.05a.2.2,0,0,1,0,.36L2.41,13Z" />,
  NetlifyIcon: <path d="M8.7,1.1H6.1A.5.5,0,0,0,5.6,1.6V8.9a.1.1,0,0,1-.2.1L2,6.3a.5.5,0,0,0-.7,0L.1,7.4a.5.5,0,0,0,0,.7L5.8,14a.5.5,0,0,0,.7,0l5.7-5.9a.5.5,0,0,0,0-.7L11,6.3a.5.5,0,0,0-.7,0l-1.4,1.4a.1.1,0,0,1-.2-.1V1.6A.5.5,0,0,0,8.7,1.1Z" />,
  GitHubIcon: <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.577.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" />,
  FolderIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />,
  FolderOpenIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />,
  CubeIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
  TrendingUpIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
  FireIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />,
  TicketIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />,
  PlusCircleIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
  CubeTransparentIcon: <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />,
} as Record<IconType, React.ReactNode>; // Added 'as' to satisfy the initial type before filling placeholders

// Placeholder for icons not explicitly defined
const PlaceholderIconSvg = <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>; // Ban Icon

// All IconType values
const allIconTypes: IconType[] = [
  'AcademicCapIcon', 'AdjustmentsIcon', 'AnnotationIcon', 'ArchiveIcon', 'ArrowCircleDownIcon',
  'ArrowCircleLeftIcon', 'ArrowCircleRightIcon', 'ArrowCircleUpIcon', 'ArrowDownIcon', 'ArrowLeftIcon',
  'ArrowNarrowDownIcon', 'ArrowNarrowLeftIcon', 'ArrowNarrowRightIcon', 'ArrowNarrowUpIcon', 'ArrowRightIcon',
  'ArrowUpIcon', 'ArrowsExpandIcon', 'AtSymbolIcon', 'BackspaceIcon', 'BadgeCheckIcon', 'BanIcon',
  'BeakerIcon', 'BellIcon', 'BookOpenIcon', 'BookmarkAltIcon', 'BookmarkIcon', 'BriefcaseIcon',
  'CakeIcon', 'CalculatorIcon', 'CalendarIcon', 'CameraIcon', 'CashIcon', 'ChartBarIcon',
  'ChartPieIcon', 'ChartSquareBarIcon', 'ChatAlt2Icon', 'ChatAltIcon', 'ChatIcon', 'CheckCircleIcon',
  'CheckIcon', 'ChevronDoubleDownIcon', 'ChevronDoubleLeftIcon', 'ChevronDoubleRightIcon', 'ChevronDoubleUpIcon',
  'ChevronDownIcon', 'ChevronLeftIcon', 'ChevronRightIcon', 'ChevronUpIcon', 'ChipIcon',
  'ClipboardCheckIcon', 'ClipboardCopyIcon', 'ClipboardListIcon', 'ClipboardIcon', 'ClockIcon',
  'CloudDownloadIcon', 'CloudUploadIcon', 'CloudIcon', 'CodeIcon', 'CogIcon', 'CollectionIcon',
  'ColorSwatchIcon', 'CreditCardIcon', 'CubeTransparentIcon', 'CubeIcon', 'CurrencyBangladeshiIcon',
  'CurrencyDollarIcon', 'CurrencyEuroIcon', 'CurrencyPoundIcon', 'CurrencyRupeeIcon', 'CurrencyYenIcon',
  'CursorClickIcon', 'DatabaseIcon', 'DesktopComputerIcon', 'DeviceMobileIcon', 'DeviceTabletIcon',
  'DocumentAddIcon', 'DocumentDownloadIcon', 'DocumentDuplicateIcon', 'DocumentRemoveIcon', 'DocumentReportIcon',
  'DocumentSearchIcon', 'DocumentTextIcon', 'DocumentIcon', 'DotsCircleHorizontalIcon', 'DotsHorizontalIcon',
  'DotsVerticalIcon', 'DownloadIcon', 'DuplicateIcon', 'EmojiHappyIcon', 'EmojiSadIcon',
  'ExclamationCircleIcon', 'ExclamationIcon', 'ExternalLinkIcon', 'EyeOffIcon', 'EyeIcon',
  'FastForwardIcon', 'FilmIcon', 'FilterIcon', 'FingerPrintIcon', 'FireIcon', 'FlagIcon',
  'FolderDownloadIcon', 'FolderOpenIcon', 'FolderRemoveIcon', 'FolderAddIcon', 'FolderIcon',
  'GiftIcon', 'GlobeAltIcon', 'GlobeIcon', 'HandIcon', 'HashtagIcon', 'HeartIcon', 'HomeIcon',
  'IdentificationIcon', 'InboxInIcon', 'InboxIcon', 'InformationCircleIcon', 'KeyIcon',
  'LibraryIcon', 'LightBulbIcon', 'LightningBoltIcon', 'LinkIcon', 'LocationMarkerIcon',
  'LockClosedIcon', 'LockOpenIcon', 'LoginIcon', 'LogoutIcon', 'MailOpenIcon', 'MailIcon',
  'MapIcon', 'MenuAlt1Icon', 'MenuAlt2Icon', 'MenuAlt3Icon', 'MenuAlt4Icon', 'MenuIcon',
  'MicrophoneIcon', 'MinusCircleIcon', 'MinusSmIcon', 'MinusIcon', 'MoonIcon', 'MusicNoteIcon',
  'NewspaperIcon', 'OfficeBuildingIcon', 'PaperAirplaneIcon', 'PaperClipIcon', 'PauseIcon',
  'PencilAltIcon', 'PencilIcon', 'PhoneIncomingIcon', 'PhoneMissedCallIcon', 'PhoneOutgoingIcon',
  'PhoneIcon', 'PhotographIcon', 'PlayIcon', 'PlusCircleIcon', 'PlusSmIcon', 'PlusIcon',
  'PresentationChartBarIcon', 'PresentationChartLineIcon', 'PrinterIcon', 'PuzzleIcon',
  'QrcodeIcon', 'QuestionMarkCircleIcon', 'ReceiptRefundIcon', 'ReceiptTaxIcon', 'RefreshIcon',
  'ReplyIcon', 'RewindIcon', 'RssIcon', 'SaveAsIcon', 'SaveIcon', 'ScaleIcon',
  'ScissorsIcon', 'SearchCircleIcon', 'SearchIcon', 'SelectorIcon', 'ServerIcon', 'ShareIcon',
  'ShieldCheckIcon', 'ShieldExclamationIcon', 'ShoppingBagIcon', 'ShoppingCartIcon', 'SortAscendingIcon',
  'SortDescendingIcon', 'SparklesIcon', 'SpeakerphoneIcon', 'StarIcon', 'StatusOfflineIcon',
  'StatusOnlineIcon', 'StopIcon', 'SunIcon', 'SupportIcon', 'SwitchHorizontalIcon',
  'SwitchVerticalIcon', 'TableIcon', 'TagIcon', 'TemplateIcon', 'TerminalIcon',
  'ThumbDownIcon', 'ThumbUpIcon', 'TicketIcon', 'TranslateIcon', 'TrashIcon', 'TrendingDownIcon',
  'TrendingUpIcon', 'TruckIcon', 'UploadIcon', 'UserAddIcon', 'UserCircleIcon', 'UserGroupIcon',
  'UserRemoveIcon', 'UserIcon', 'UsersIcon', 'VariableIcon', 'VideoCameraIcon', 'ViewBoardsIcon',
  'ViewGridAddIcon', 'ViewGridIcon', 'ViewListIcon', 'VolumeOffIcon', 'VolumeUpIcon',
  'WifiIcon', 'XCircleIcon', 'XIcon', 'ZoomInIcon', 'ZoomOutIcon',
  'SupabaseIcon', 'NetlifyIcon', 'GitHubIcon'
];

// Populate iconMap with placeholders for any missing icons
allIconTypes.forEach(type => {
  if (!iconMap[type]) {
    iconMap[type] = PlaceholderIconSvg;
  }
});


export const Icon: React.FC<IconProps> = ({ icon, className = 'w-6 h-6', ...props }) => {
  const commonProps = {
    className,
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    ...props,
  };
  
  const IconSvg = iconMap[icon] || PlaceholderIconSvg; // Fallback if icon name is somehow not in map

  if (icon === 'SupabaseIcon' || icon === 'NetlifyIcon') {
    return <svg {...commonProps} fill="currentColor" strokeWidth="0" viewBox="0 0 14 14.36"><g>{IconSvg}</g></svg>
  }
  if (icon === 'GitHubIcon') {
    return <svg {...commonProps} fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"><g>{IconSvg}</g></svg>
  }
  
  return <svg {...commonProps}>{IconSvg}</svg>;
};

export default Icon;