import { redirect } from 'next/navigation';

const LegacyDemo = (): never => {
  redirect('/docs/components/number-picker');
};

export default LegacyDemo;
