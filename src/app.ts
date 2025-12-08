import { createApp, registerElement } from 'nativescript-vue';
import AppRoot from './components/AppRoot.vue';
import './app.css';
import RadCalendar from 'nativescript-ui-calendar/vue';
import { CreditCardView } from '@triniwiz/nativescript-stripe';

registerElement('CreditCardView', () => CreditCardView);

const app = createApp(AppRoot);

app.use(RadCalendar);

app.start();