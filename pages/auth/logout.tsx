import { ROOT_PATH } from '@/const';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    localStorage.clear();
    router.push(ROOT_PATH);
  }, []);
  return <></>;
}

Logout.getLayout = function getLayout(page: ReactNode) {
  return <>{page}</>;
};
