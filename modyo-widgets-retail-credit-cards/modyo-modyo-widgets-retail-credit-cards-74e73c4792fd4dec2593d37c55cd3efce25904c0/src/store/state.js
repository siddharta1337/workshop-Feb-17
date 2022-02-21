import { subDays } from 'date-fns';
import i18n from '../i18n';

const LANG = window.liquid ? window.liquid.lang : 'es-CL';

const filter = LANG === 'es-CL'
  ? { name: i18n.t('transactions-list.national'), value: 'clp' }
  : { name: i18n.t('transactions-list.international'), value: 'usd' };

export default {
  activeCardId: null,
  activeTab: 'movements',
  cards: [],
  filterBy: filter,
  fromDate: subDays(new Date(), 30),
  isLoadingCards: true,
  isLoadingTransactions: true,
  paramCardId: 1,
  paramClientId: 1,
  showMovements: false,
  toDate: new Date(),
  transactions: [],
  selectedTransaction: null,
  lang: LANG,
};
