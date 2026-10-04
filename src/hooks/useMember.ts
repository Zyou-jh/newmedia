import { useEffect, useState } from 'react';
import { subscribeMember } from '../supabase/database';
import type { Member } from '../types/member';

export function useMember(id: string | undefined) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeMember(
      id,
      (data) => {
        setMember(data);
        setLoading(false);
        setError(null);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [id]);

  return { member, loading, error };
}
