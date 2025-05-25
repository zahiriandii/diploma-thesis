import { createApp } from 'nativescript-vue';
import Home from './components/Home.vue';
import './app.css';
import RadCalendar from 'nativescript-ui-calendar/vue';

const app = createApp(Home);
app.use(RadCalendar);
app.start();
