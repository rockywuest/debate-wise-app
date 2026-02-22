import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { InputValidator } from "./inputValidation";

describe("InputValidator fuzz tests", () => {
  it("rejects suspicious argument content across random inputs", () => {
    const suspiciousToken = fc.constantFrom(
      "<script>alert(1)</script>",
      "javascript:alert(1)",
      "onload=alert(1)",
      "data:text/html,<b>x</b>",
      "vbscript:msgbox(1)",
    );

    fc.assert(
      fc.property(fc.string(), suspiciousToken, fc.string(), (prefix, token, suffix) => {
        const result = InputValidator.validateAndSanitizeArgument(`${prefix}${token}${suffix}`);

        expect(result.isValid).toBe(false);
        expect(result.errors.some((message) => message.includes("nicht erlaubte Inhalte"))).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it("flags overlong arguments for random long strings", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 2001, maxLength: 5000 }), (value) => {
        const result = InputValidator.validateAndSanitizeArgument(value);
        expect(result.isValid).toBe(false);
        expect(result.errors.some((message) => message.includes("max. 2000"))).toBe(true);
      }),
      { numRuns: 50 },
    );
  });

  it("only accepts http and https source URLs", () => {
    const domain = fc.constantFrom("example.com", "sub.domain.org", "test.dev");

    fc.assert(
      fc.property(
        fc.constantFrom("ftp", "file", "javascript", "data", "ws"),
        domain,
        (protocol, domain) => {
          const result = InputValidator.validateSourceUrl(`${protocol}://${domain}/path`);
          expect(result.isValid).toBe(false);
          expect(result.errors.some((message) => message.includes("HTTP/HTTPS"))).toBe(true);
        },
      ),
      { numRuns: 50 },
    );
  });
});
