import 'server-only';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { UserMenu } from '@/components/auth/user-menu';
import { Button } from '@/components/ui/button';

export async function AuthStatus() {
  const supabase = createClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return <UserMenu user={user} />;
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" asChild>
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
}