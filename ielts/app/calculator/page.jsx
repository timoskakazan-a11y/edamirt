import Link from 'next/link';
import Calculator from '../../components/Calculator';

export const metadata = { title: 'Калькулятор баллов IELTS' };

export default function CalculatorPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div className="crumbs"><Link href="/">Главная</Link> / Калькулятор</div>
        <h1>Калькулятор баллов IELTS</h1>
        <p className="muted" style={{ maxWidth: 680 }}>
          Общий балл равен среднему четырёх модулей, округлённому до ближайшей половины: .25 округляется вверх до .5, а
          .75 до следующего целого.
        </p>
      </div>
      <Calculator />
    </div>
  );
}
