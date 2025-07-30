import { nameIsValid, fullTrim, getTotal } from '../app';

describe('nameIsValid', () => {
  test('возвращает true, если имя корректное (только буквы, длина ≥ 2)', () => {
    expect(nameIsValid('alex')).toBe(true);
  });

  test('возвращает false, если имя состоит из одного символа', () => {
    expect(nameIsValid('a')).toBe(false);
  });

  test('возвращает false, если имя содержит недопустимые символы (цифры, спецсимволы)', () => {
    expect(nameIsValid('alex1')).toBe(false);
    expect(nameIsValid('al_ex')).toBe(false);
  });
});

describe('fullTrim', () => {
  test('удаляет все пробелы между символами', () => {
    expect(fullTrim(' a b c ')).toBe('abc');
  });

  test('удаляет табуляции и переносы строк', () => {
    expect(fullTrim('a\tb\nc')).toBe('abc');
  });

  test('возвращает пустую строку, если передано null или undefined', () => {
    expect(fullTrim(null)).toBe('');
    expect(fullTrim(undefined)).toBe('');
  });
});

describe('getTotal', () => {
  test('правильно считает сумму заказа без скидки', () => {
    expect(getTotal([{ price: 10, quantity: 2 }])).toBe(20);
  });

  test('выбрасывает ошибку, если скидка некорректная (отрицательная, >99 или не число)', () => {
    expect(() => getTotal([{ price: 10, quantity: 1 }], -5)).toThrow();
    expect(() => getTotal([{ price: 10, quantity: 1 }], 150)).toThrow();
    expect(() => getTotal([{ price: 10, quantity: 1 }], 'abc')).toThrow();
  });

  test.each([
    ['один товар без скидки', [{ price: 10, quantity: 1 }], 0, 10],
    ['несколько товаров без скидки', [{ price: 10, quantity: 2 }, { price: 5, quantity: 4 }], 0, 40],
    ['один товар со скидкой 50%', [{ price: 100, quantity: 1 }], 50, 50],
    ['несколько товаров со скидкой 10%', [{ price: 50, quantity: 2 }, { price: 20, quantity: 1 }], 10, 108],
    ['пустой список товаров', [], 10, 0],
  ])(
    'возвращает правильную сумму (%s)',
    (_, items, discount, expected) => {
      expect(getTotal(items, discount)).toBe(expected);
    }
  );
});
