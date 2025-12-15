
<template>
  
  <Page>
  <ActionBar title="Bus Trips" class="bg-white text-blue-800">
    <NavigationButton ref="navBtn" text="Back" @tap="$navigateBack()" />
  </ActionBar>

  <!-- Full-page layout -->
  <GridLayout rows="auto,*">

    <!-- top: date selector -->
    <TripDateSelector row="0" @date-changed="onDateChanged" />

    <!-- bottom: content area (fills the rest of the screen) -->
    <GridLayout row="1">

      <!-- Loading -->
      <Label
        v-if="isLoading"
        text="Loading trips..."
        horizontalAlignment="center"
        verticalAlignment="center"
        class="text-lg"
      />

      <!-- Empty / Error message centered -->
      <Label
        v-else-if="errorMessage"
        :text="errorMessage"
        textWrap="true"
        horizontalAlignment="center"
        verticalAlignment="center"
        class="text-center text-2xl font-bold text-red-500 px-6"
      />

      <!-- Trips list -->
      <ScrollView v-else>
        <StackLayout>
          <TripComponent
            v-for="(trip, index) in trips"
            :key="trip.tripId ?? index"
            :index="index"
            v-bind="trip"
          />
        </StackLayout>
      </ScrollView>

    </GridLayout>
  </GridLayout>
</Page>

  
</template>

<script setup lang="ts">
import TripComponent from '~/components/TripComponent.vue';
import TripDateSelector from '~/components/TripDateSelector.vue';
import { ref, onMounted } from 'nativescript-vue';
import { isAndroid } from '@nativescript/core';

const navBtn = ref();

const props = defineProps<{
  cityFrom: string,
  cityTo: string,
  date: string  // already "YYYY-MM-DD" from Home 
}>();

const trips = ref<any[]>([]);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

const base_backend_url = 'http://busapp-alb-536116599.eu-north-1.elb.amazonaws.com';

const currentDate = ref(props.date);

//  helpers 
const formatTime = (isoString: string) => {
  // "2025-11-24T23:11:45" -> "23:11"
  if (!isoString) return '';
  return isoString.substring(11, 16);
};

const calculateDuration = (startISO: string, endISO: string) => {
  const start = new Date(startISO);
  const end   = new Date(endISO);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return '';
  }

  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return `${hours}h ${minutes}m`;
};

// main loader 
const loadTrips = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = null;

    const url =
      `${base_backend_url}/trips/search` +
      `?cityFromName=${encodeURIComponent(props.cityFrom)}` +
      `&cityToName=${encodeURIComponent(props.cityTo)}` +
      `&date=${encodeURIComponent(currentDate.value)}`;

    console.log('Search URL:', url);

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      console.log('Trip error msg:', text);
      errorMessage.value = 'Could not load trips';
      return;
    }

    const data = await response.json();
    console.log('Raw trips from backend:', data);

    // If backend returns [], this is where you’ll see it
    if (!Array.isArray(data) || data.length === 0) {
      trips.value = [];
      errorMessage.value = 'No trips available for this date.';
      return;
    }

    // MAP BACKEND TRIP -> UI TRIP FOR TripComponent 
    trips.value = data.map((t: any) => ({
      departureTime: formatTime(t.departureTime),
      departureStation: t.cityFrom,
      duration: calculateDuration(t.departureTime, t.arrivalTime),
      seats: `${t.seats} seats available`,
      arrivalTime: formatTime(t.arrivalTime),
      arrivalStation: t.cityTo,
      price: `${t.price}`,
      tripId: t.tripId,  
      departureDate: props.date
    }));

    console.log('Mapped trips for UI:', trips.value);

  } catch (error) {
    console.log('Network error while searching trips', error);
    errorMessage.value = 'Network Error ...';
  } finally {
    isLoading.value = false;
  }
};

const onDateChanged = (newDate: string) => {
  console.log("Date changed from TripDateSelector:", newDate);
  currentDate.value = newDate;
  loadTrips(); // fetch again with new date, same cities
};
onMounted(() => {
  if (isAndroid && navBtn.value?.nativeView?.android) {
    navBtn.value.nativeView.android.systemIcon = 'ic_menu_back';
  }

  loadTrips();
});
</script>
