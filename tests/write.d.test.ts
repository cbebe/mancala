import { createHTTPText } from "../src/write";

test("Replace spaces with plus", () => {
  const input = "Hello plus world";
  const output = createHTTPText(input, true);
  const expected = "Hello+plus+world";
  expect(output).toBe(expected);
});

test("Replace spaces with %20, pipes with %7C, and single quotes with %27", () => {
  const input = "Hello |pipe| 'world'";
  const output = createHTTPText(input);
  const expected = "Hello%20%7Cpipe%7C%20%27world%27";
  expect(output).toBe(expected);
});
