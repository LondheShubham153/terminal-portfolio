import { z } from "zod";

/**
 * Optional URL field restricted to http(s). Auto-prepends "https://" when a
 * user types a bare domain (e.g. "github.com/me/repo") instead of silently
 * rejecting the whole form — a bare domain is by far the most natural way
 * people type a URL, and previously this caused a confusing silent failure
 * with no visible error.
 */
export const httpUrl = z
  .string()
  .trim()
  .max(500)
  .transform((value) => {
    if (value === "") return value;
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  })
  .refine((value) => value === "" || /^https?:\/\/[^\s]+\.[^\s]+/i.test(value), {
    message: "must be a valid URL",
  })
  .refine((value) => value.length <= 500, { message: "must be 500 characters or fewer" });
