import { useEffect, useState } from 'react';
import { subscribeAllWorks } from '../supabase/database';
import type { Work } from '../types/member';

export function useAllWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeAllWorks(
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
  }, []);

  return { works, loading, error };
}
