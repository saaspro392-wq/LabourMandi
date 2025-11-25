import { useTheme } from './theme-context';
import { t } from './i18n';

export function useI18n() {
  const { language } = useTheme();

  const translate = (key: string): string => {
    return t(key, language);
  };

  return { t: translate, language };
}
