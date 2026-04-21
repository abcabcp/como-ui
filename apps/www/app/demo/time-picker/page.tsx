import { redirect } from 'next/navigation';

const LegacyDemo = (): never => {
  redirect('/docs/components/time-picker');
};

export default LegacyDemo;
