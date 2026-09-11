import type { OfflineEntry } from '../types';

/**
 * Parses SMS-style commands into structured entries.
 * Supported formats (case-insensitive):
 *   SALE <amount> <item description>
 *   EXPENSE <amount> <expense type>
 *
 * Examples:
 *   "SALE 5000 Tomatoes basket"      -> sale, ₦5000, "Tomatoes basket"
 *   "EXPENSE 2000 Transport"          -> expense, ₦2000, "Transport"
 */
export function parseSMS(rawMessage: string): Omit<OfflineEntry, 'id' | 'status' | 'timestamp'> {
  const trimmed = rawMessage.trim();
  const match = trimmed.match(/^(SALE|EXPENSE)\s+(\d+)\s*(.*)$/i);

  if (!match) {
    return { rawMessage, type: 'unknown' };
  }

  const [, keyword, amountStr, description] = match;
  const type = keyword.toUpperCase() === 'SALE' ? 'sale' : 'expense';

  return {
    rawMessage,
    type,
    amount: Number(amountStr),
    description: description.trim() || (type === 'sale' ? 'Sale via SMS' : 'Expense via SMS'),
  };
}