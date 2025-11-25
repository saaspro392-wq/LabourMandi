import { Search, Mic, Briefcase, LogIn, User, Wallet, LogOut, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CATEGORIES } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/lib/useLanguage";

interface HeaderProps {
  user: any;
  onSignOut: () => void;
  onOpenPostJob: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export function Header({
  user,
  onSignOut,
  onOpenPostJob,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: HeaderProps) {
  const [, navigate] = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 backdrop-blur-md shadow-sm">
      <div className="w-full max-w-full flex h-14 sm:h-16 lg:h-20 items-center gap-2 sm:gap-4 px-3 sm:px-6">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 cursor-pointer group" data-testid="link-home">
            <div className="bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-sm sm:text-base lg:text-lg rounded-lg px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 group-hover:shadow-lg group-hover:shadow-red-500/50 group-hover:scale-105 transition-all duration-200">
              LM
            </div>
            <div className="hidden sm:flex items-baseline gap-1">
              <span className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">Labour</span>
              <span className="text-xs sm:text-sm lg:text-base font-semibold text-red-600">Mandi</span>
            </div>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md lg:max-w-lg relative hidden xs:block">
          <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 pointer-events-none" />
          <Input
            type="search"
            placeholder={t('enterPinOrCity')}
            className="pl-8 sm:pl-10 pr-9 sm:pr-10 h-8 sm:h-9 rounded-full bg-slate-100 border border-slate-300 text-slate-900 text-sm placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-red-600 shadow-md hover:shadow-lg transition-shadow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-0.5 sm:right-1 top-1/2 -translate-y-1/2 h-6 sm:h-7 w-6 sm:w-7 rounded-full hover:bg-slate-200"
            data-testid="button-voice-search"
          >
            <Mic className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          {/* Category Dropdown - Hidden on small screens */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="hidden lg:flex w-40 h-9 rounded-lg bg-slate-100 border border-slate-300 hover:shadow-md transition-shadow text-xs sm:text-sm font-medium text-slate-900" data-testid="select-category">
              <SelectValue placeholder={t('allCategories')} />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-300">
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Post Job Button */}
          <Button
            onClick={onOpenPostJob}
            className="hidden sm:flex h-9 px-3 gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all text-xs sm:text-sm font-semibold"
            data-testid="button-post-job"
          >
            <Briefcase className="h-4 w-4" />
            <span className="hidden lg:inline">{t('postJob')}</span>
          </Button>

          {/* Wallet Balance */}
          {user && (
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg shadow-sm" data-testid="wallet-balance-display">
              <Wallet className="h-4 w-4 text-red-600" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-600">Balance</span>
                <span className="text-sm sm:text-base font-bold text-red-600">₹{user.walletBalance || 0}</span>
              </div>
            </div>
          )}

          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                data-testid="button-language"
              >
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-white border border-slate-300">
              <DropdownMenuItem
                onClick={() => setLanguage('en')}
                className={`cursor-pointer ${language === 'en' ? 'bg-red-100 text-red-600 font-semibold' : 'text-slate-700'}`}
                data-testid="lang-english"
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('hi')}
                className={`cursor-pointer ${language === 'hi' ? 'bg-red-100 text-red-600 font-semibold' : 'text-slate-700'}`}
                data-testid="lang-hindi"
              >
                हिन्दी
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('ta')}
                className={`cursor-pointer ${language === 'ta' ? 'bg-red-100 text-red-600 font-semibold' : 'text-slate-700'}`}
                data-testid="lang-tamil"
              >
                தமிழ்
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth / User Menu */}
          {user && user.id ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 sm:h-9 px-1 sm:px-2 gap-1 sm:gap-2 hover:bg-gray-800 transition-colors rounded-lg"
                  data-testid="button-user-menu"
                >
                  <Avatar className="h-6 sm:h-7 w-6 sm:w-7">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-600 text-white text-xs font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline text-sm font-medium">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-950 border border-gray-700">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <div className="flex items-center gap-2 w-full cursor-pointer" data-testid="link-profile">
                      <User className="h-4 w-4" />
                      Profile
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 font-semibold text-emerald-400" data-testid="text-wallet-balance">
                  <Wallet className="h-4 w-4" />
                  ₹{user.walletBalance || 0}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={onSignOut} className="gap-2 text-red-400 cursor-pointer" data-testid="button-logout">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => navigate('/auth/otp-login')}
              className="h-8 sm:h-9 px-2 sm:px-3 gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all text-xs sm:text-sm rounded-lg"
              data-testid="button-signin"
            >
              <LogIn className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
