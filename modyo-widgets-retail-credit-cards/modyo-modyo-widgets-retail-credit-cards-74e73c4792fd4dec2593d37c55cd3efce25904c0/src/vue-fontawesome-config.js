/* Config file for Fontawesome icons */
/* Import the icons you need to use. */
/* DOCUMENTATION: https://github.com/FortAwesome/vue-fontawesome#introduction */

import Vue from 'vue';
// CORE LIBRARY
import { library } from '@fortawesome/fontawesome-svg-core';

// Free Regular icons
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';

// Solid icons
import {
  faChevronLeft, faChevronRight, faChevronDown, faCog,
  faTimes, faBan, faCircleNotch, faArrowLeft, faCalendar, faSearch, faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

// Brands icons
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faChevronLeft, faChevronRight, faChevronDown, faCog,
  faCcVisa, faCcMastercard, faTimes, faBan, faCircleNotch, faArrowLeft, faCalendar,
  faSearch, faExclamationTriangle, faFilePdf);

Vue.component('FontAwesomeIcon', FontAwesomeIcon);
