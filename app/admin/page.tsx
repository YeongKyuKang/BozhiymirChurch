import { redirect } from 'next/navigation';

export default function AdminPage() {
  // /admin 접속 시 /admin/dashboard로 자동 이동
  redirect('/admin/dashboard');
}