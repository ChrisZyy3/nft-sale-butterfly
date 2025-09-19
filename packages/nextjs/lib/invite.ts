const INVITE_CODE_REGEX = /^0x[a-f0-9]{40}$/;

const INVITE_STORAGE_KEY = "hb-invite-code";
const REFERRAL_STORAGE_KEY = "hb-referral-stats";
export const REFERRAL_EVENT_NAME = "hb-referral-updated";
export const INVITE_PARAM_KEY = "invite";

type ReferralStore = Record<string, number>;

type ReferralEventDetail = {
  address?: string;
};

const isBrowser = () => typeof window !== "undefined";

export function normalizeInviteCode(code?: string | null): string | null {
  if (!code) {
    return null;
  }
  const normalized = code.trim().toLowerCase();
  return INVITE_CODE_REGEX.test(normalized) ? normalized : null;
}

export function createInviteCode(address?: string | null): string | null {
  return normalizeInviteCode(address);
}

export function isValidInviteCode(code?: string | null): boolean {
  return normalizeInviteCode(code) !== null;
}

export function storeInviteCode(code: string) {
  const normalized = normalizeInviteCode(code);
  if (!normalized || !isBrowser()) {
    return;
  }
  try {
    window.localStorage.setItem(INVITE_STORAGE_KEY, normalized);
  } catch (error) {
    console.error("Failed to store invite code", error);
  }
}

export function getStoredInviteCode(): string | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(INVITE_STORAGE_KEY);
    return normalizeInviteCode(stored);
  } catch (error) {
    console.error("Failed to read stored invite code", error);
    return null;
  }
}

function readReferralStore(): ReferralStore {
  if (!isBrowser()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as ReferralStore;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return Object.entries(parsed).reduce<ReferralStore>((acc, [address, value]) => {
      const normalized = normalizeInviteCode(address);
      if (!normalized) {
        return acc;
      }
      const numericValue = Number(value);
      acc[normalized] = Number.isFinite(numericValue) ? numericValue : 0;
      return acc;
    }, {});
  } catch (error) {
    console.error("Failed to parse referral store", error);
    return {};
  }
}

function writeReferralStore(store: ReferralStore) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error("Failed to persist referral store", error);
  }
}

function dispatchReferralEvent(address?: string) {
  if (!isBrowser()) {
    return;
  }

  const eventDetail: ReferralEventDetail = { address };
  const event = new CustomEvent<ReferralEventDetail>(REFERRAL_EVENT_NAME, { detail: eventDetail });
  window.dispatchEvent(event);
}

export function incrementReferralCount(inviterCode: string) {
  const normalized = normalizeInviteCode(inviterCode);
  if (!normalized) {
    return;
  }

  const store = readReferralStore();
  store[normalized] = (store[normalized] ?? 0) + 1;
  writeReferralStore(store);
  dispatchReferralEvent(normalized);
}

export function getReferralCount(address?: string | null): number {
  const normalized = normalizeInviteCode(address);
  if (!normalized) {
    return 0;
  }

  const store = readReferralStore();
  return store[normalized] ?? 0;
}

export const PROMOTION_RULES = [
  "通过邀请链接登录DAPP才能购买",
  "购买至少1枚NFT，才能拥有邀请链接",
  "购买1枚推广后，才有邀请奖励",
];
