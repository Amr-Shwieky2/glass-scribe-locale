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
}

const DeleteConfirmDialog: FC<DeleteConfirmDialogProps> = ({
  publicId,
  onConfirm,
  onCancel,
}) => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as AdminLocale;
  const t = (strings: Record<string, string>) => getAdminText(strings, locale);

  return (
    <AlertDialog
      open={!!publicId}
      onOpenChange={() => onCancel()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(ADMIN_STRINGS.deleteDialog.title)}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(ADMIN_STRINGS.deleteDialog.description)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t(ADMIN_STRINGS.deleteDialog.cancel)}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => publicId && onConfirm(publicId)}
          >
            {t(ADMIN_STRINGS.deleteDialog.confirm)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
