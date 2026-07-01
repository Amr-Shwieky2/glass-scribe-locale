'use client';
import { type FC } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { ADMIN_STRINGS, getAdminText, type AdminLocale } from '@/data/admin-strings';

interface DeleteConfirmDialogProps {
  publicId: string | null;
  onConfirm: (publicId: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmDialog: FC<DeleteConfirmDialogProps> = ({
  publicId,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as AdminLocale;
  const t = (strings: Record<string, string>) => getAdminText(strings, locale);

  return (
    <AlertDialog
      open={!!publicId}
      onOpenChange={(open) => { if (!open && !isLoading) onCancel(); }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(ADMIN_STRINGS.deleteDialog.title)}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(ADMIN_STRINGS.deleteDialog.description)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t(ADMIN_STRINGS.deleteDialog.cancel)}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 disabled:opacity-60"
            disabled={isLoading}
            onClick={(e) => { e.preventDefault(); publicId && onConfirm(publicId); }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white inline-block" />
                {t(ADMIN_STRINGS.deleteDialog.confirm)}…
              </span>
            ) : t(ADMIN_STRINGS.deleteDialog.confirm)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
