import { type FC } from 'react';
import { ProtectedRoute } from '@/contexts/AdminContext';
import LoginForm from '@/components/admin/LoginForm';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin: FC = () => (
  <ProtectedRoute fallback={<LoginForm />}>
    <AdminDashboard />
  </ProtectedRoute>
);

export default Admin;
