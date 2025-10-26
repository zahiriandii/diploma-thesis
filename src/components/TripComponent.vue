
<template>
    
  <StackLayout class="m-2 p-4 rounded-2xl bg-white shadow">
    <!-- Header -->
    <FlexboxLayout class="mb-2 space-x-2">
      <Label text="Test" class="px-2 py-1 rounded bg-green-200 text-xs font-medium" />
      <Label text="Bus" class="px-2 py-1 rounded bg-lime-200 text-xs font-medium" />
    </FlexboxLayout>

    <!-- Main info row -->
    <FlexboxLayout class="justify-between mb-2">
      <StackLayout>
        <Label :text="departureTime" class="text-xl font-bold" />
        <Label :text="departureStation" class="text-sm text-gray-500" />
      </StackLayout>

      <StackLayout class="items-center">
        <Label :text="duration" class="text-sm text-gray-700" />
        <Label :text="transfers" class="text-sm text-gray-500" />
      </StackLayout>

      <StackLayout class="items-end">
        <Label :text="arrivalTime" class="text-xl font-bold" />
        <Label :text="arrivalStation" class="text-sm text-gray-500" />
      </StackLayout>
    </FlexboxLayout>

    <!-- Extras row -->
    <FlexboxLayout class="justify-between mb-2">
      <Label text="WiFi" class="text-xs text-gray-600" />
      <Label text="Power" class="text-xs text-gray-600" />
      <Label text="Almost full" class="text-xs text-gray-600" />
      <Label :text="price" class="text-lg font-bold text-black" />
    </FlexboxLayout>

    <!-- Continue button -->
    <Button text="Continue" class="bg-lime-500 text-white font-bold rounded-lg py-2" @tap="tripReservation" />
  </StackLayout>


</template>

<script setup lang="ts">
import { $showModal } from 'nativescript-vue';
import TripReservationModal from '~/Modals/TripReservationModal.vue';

defineProps({
  departureTime: { type: String, default: "19:55" },
  departureStation: { type: String, default: "Kumanovo Central Station" },
  duration: { type: String, default: "11:15 hrs" },
  transfers: { type: String, default: "0 transfer" },
  arrivalTime: { type: String, default: "07:10 +1 day" },
  arrivalStation: { type: String, default: "Brussels Central Station" },
  price: { type: String, default: "€100" }
})

const tripReservation = () =>
{
  $showModal(TripReservationModal,{
    fullscreen: true,
    props: {

    },
    closeCallback: (tripData) =>
    {

    }
  })
}
</script>