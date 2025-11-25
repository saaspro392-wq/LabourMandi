import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-language-toggle">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          data-testid="lang-en"
          className={language === 'en' ? 'bg-primary text-primary-foreground' : ''}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('hi')}
          data-testid="lang-hi"
          className={language === 'hi' ? 'bg-primary text-primary-foreground' : ''}
        >
          हिन्दी
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
