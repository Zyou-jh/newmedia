import { useEffect, useState } from 'react';
import { subscribeMemberWorks } from '../supabase/database';
import type { Work } from '../types/member';

export function useWorks(memberId: string | undefined) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeMemberWorks(
      memberId,
      (data) => {
        setWorks(data);
        setLoading(false);
        setError(null);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [memberId]);

  return { works, loading, error, reload: () => Promise.resolve() };
}
