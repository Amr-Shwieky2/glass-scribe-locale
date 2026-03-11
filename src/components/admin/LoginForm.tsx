import { useState, type FC } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ADMIN_STRINGS, getAdminText, type AdminLocale } from '@/data/admin-strings';

const LoginForm: FC = () => {
  const { login } = useAdmin();
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as AdminLocale;
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = (strings: Record<string, string>) => getAdminText(strings, locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(password);

    if (!result.success) {
      toast({
        title: t(ADMIN_STRINGS.login.failed),
        description: result.error || t(ADMIN_STRINGS.login.invalidPassword),
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img
            src="/logo.png"
            alt="Shwaki Brothers"
            className="w-20 h-20 mx-auto mb-4"
          />
          <CardTitle className="text-2xl text-brand-navy">{t(ADMIN_STRINGS.login.title)}</CardTitle>
          <p className="text-brand-navy/60 text-sm mt-2">
            {t(ADMIN_STRINGS.login.subtitle)}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t(ADMIN_STRINGS.login.password)}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t(ADMIN_STRINGS.login.passwordPlaceholder)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-navy"
              disabled={isLoading}
            >
              {isLoading ? t(ADMIN_STRINGS.login.loggingIn) : t(ADMIN_STRINGS.login.loginButton)}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
