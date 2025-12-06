import { createApp } from 'nativescript-vue';
import AppRoot from './components/AppRoot.vue';
import './app.css';
import RadCalendar from 'nativescript-ui-calendar/vue';


const app = createApp(AppRoot);
app.use(RadCalendar);
app.start();
