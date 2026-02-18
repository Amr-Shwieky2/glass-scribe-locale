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

interface DeleteConfirmDialogProps {
  publicId: string | null;
  onConfirm: (publicId: string) => void;
  onCancel: () => void;
}

const DeleteConfirmDialog: FC<DeleteConfirmDialogProps> = ({
  publicId,
  onConfirm,
  onCancel,
}) => (
  <AlertDialog
    open={!!publicId}
    onOpenChange={() => onCancel()}
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Image?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. The image will be permanently deleted
          from Cloudinary.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className="bg-red-600 hover:bg-red-700"
          onClick={() => publicId && onConfirm(publicId)}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default DeleteConfirmDialog;
