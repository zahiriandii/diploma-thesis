
<template>
  <Frame>
  <Page>
    <ActionBar title="Bus Trips" class="bg-white text-blue-800">
        <NavigationButton
          text="Back"
          android.systemIcon="ic_menu_back"
          @tap="$modal.close"
        />
      </ActionBar>
  <StackLayout >
    <TripComponent v-for="(trip , index) in trips"
                    :index="index"
                    v-bind="trip">

    </TripComponent>
  </StackLayout>
  </Page>
  </Frame>
</template>

<script setup lang="ts">
import { StackLayout } from '@nativescript/core';
import TripComponent from '~/components/TripComponent.vue';
import { ref } from 'nativescript-vue';
import { $closeModal } from 'nativescript-vue';
const props = defineProps<{
    citys: []
}>();

const trips = ref([
  {
    departureTime: "19:55",
    departureStation: `${props.citys[0]}`,
    duration: "11:15 hrs",
    transfers: "1 transfer",
    arrivalTime: "07:10 +1 day",
    arrivalStation: `${props.citys[1]}`,
    price: "€45.47"
  },
  {
    departureTime: "08:30",
    departureStation: "Munich Central Station",
    duration: "7:45 hrs",
    transfers: "Direct",
    arrivalTime: "16:15",
    arrivalStation: "Vienna Erdberg (VIB)",
    price: "€39.99"
  }
])
</script>