import { defaultReduceOptions } from '../defaultReduceOptions';

test('should concat options by default', () => {
  expect(defaultReduceOptions(
    [
      {
        value: 1,
      },
      {
        value: 2,
      },
    ],
    [
      {
        value: 3,
      },
      {
        value: 4,
      },
    ],
  )).toEqual([1, 2, 3, 4]);
});
