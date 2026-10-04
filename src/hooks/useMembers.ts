import { useEffect, useState } from 'react';
import { subscribeMembers } from '../supabase/database';
import type { Member } from '../types/member';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeMembers(
      (data) => {
        setMembers(data);
        setLoading(false);
        setError(null);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { members, loading, error };
}
