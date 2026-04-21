import { redirect } from 'next/navigation';

const HomePage = (): never => {
  redirect('/docs/introduction');
};

export default HomePage;
