import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const originalText = new WeakMap();
const translatableAttributes = ['placeholder', 'aria-label', 'title'];
const blockedTags = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT']);
const keyMap = {
  Home: 'nav.home',
  Services: 'nav.services',
  Plans: 'nav.plans',
  Coaches: 'nav.coaches',
  Contact: 'nav.contact',
  Dashboard: 'nav.dashboard',
  Logout: 'nav.logout',
  Members: 'sidebar.members',
  Payments: 'sidebar.payments',
  Attendance: 'sidebar.attendance',
  Settings: 'sidebar.settings',
  Profile: 'sidebar.profile',
  Administrator: 'roles.admin',
  Coach: 'roles.coach',
  Member: 'roles.member',
  Save: 'common.save',
  Cancel: 'common.cancel',
  Delete: 'common.delete',
  Edit: 'common.edit',
  Actions: 'common.actions',
  Status: 'common.status',
  Name: 'common.name',
  Email: 'common.email',
  Phone: 'common.phone',
  Password: 'common.password',
  Active: 'status.active',
  Pending: 'status.pending',
  Paid: 'status.paid',
  Unpaid: 'status.unpaid',
  Expired: 'status.expired',
  Rejected: 'status.rejected',
  Cancelled: 'status.cancelled',
  active: 'status.active',
  pending: 'status.pending',
  paid: 'status.paid',
  unpaid: 'status.unpaid',
  expired: 'status.expired',
  rejected: 'status.rejected',
  cancelled: 'status.cancelled',
};

const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();

const slugify = (value) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const isTranslatableText = (value) => {
  const text = normalizeText(value);
  if (!text || text.length < 2 || text.length > 260) return false;
  if (!/[A-Za-z]/.test(text)) return false;
  if (/^[\d\s.,:/+%-]+$/.test(text)) return false;
  return true;
};

const shouldSkipElement = (element) => {
  if (!element) return true;
  if (blockedTags.has(element.tagName)) return true;
  if (element.closest('[data-no-i18n]')) return true;
  return false;
};

const translateValue = (i18n, value) => {
  const source = normalizeText(value);
  if (!isTranslatableText(source)) return value;
  const key = keyMap[source] || `raw.${slugify(source)}`;
  return i18n.t(key, { defaultValue: source });
};

const translateTextNodes = (root, i18n) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    if (shouldSkipElement(node.parentElement)) return;
    const current = normalizeText(node.nodeValue || '');
    if (!isTranslatableText(current)) return;

    if (!originalText.has(node)) {
      originalText.set(node, current);
    }

    const nextValue = translateValue(i18n, originalText.get(node));
    if (node.nodeValue !== nextValue) {
      node.nodeValue = nextValue;
    }
  });
};

const translateAttributes = (root, i18n) => {
  const elements = root.querySelectorAll(translatableAttributes.map((attribute) => `[${attribute}]`).join(','));

  elements.forEach((element) => {
    if (shouldSkipElement(element)) return;

    translatableAttributes.forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value || !isTranslatableText(value)) return;

      const originalAttribute = `data-i18n-original-${attribute}`;
      if (!element.hasAttribute(originalAttribute)) {
        element.setAttribute(originalAttribute, value);
      }

      const translated = translateValue(i18n, element.getAttribute(originalAttribute));
      if (element.getAttribute(attribute) !== translated) {
        element.setAttribute(attribute, translated);
      }
    });
  });
};

export default function DomTranslator() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const translatePage = () => {
      translateTextNodes(document.body, i18n);
      translateAttributes(document.body, i18n);
    };

    translatePage();

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(translatePage);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: translatableAttributes,
    });

    return () => observer.disconnect();
  }, [i18n, i18n.language]);

  return null;
}
