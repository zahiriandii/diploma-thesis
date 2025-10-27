
<template>
  
  <Page>
    <ActionBar title="Bus Trips" class="bg-white text-blue-800">
        <NavigationButton
          text="Back"
          android.systemIcon="ic_menu_back"
          @tap="$navigateBack()"
        />
      </ActionBar>
  <StackLayout >
    <TripDateSelector />
    <TripComponent v-for="(trip , index) in trips"
                    :index="index"
                    v-bind="trip">

    </TripComponent>
  </StackLayout>
  </Page>
  
</template>

<script setup lang="ts">
import { StackLayout } from '@nativescript/core';
import TripComponent from '~/components/TripComponent.vue';
import TripDateSelector from '~/components/TripDateSelector.vue';
import { ref } from 'nativescript-vue';
import { $navigateBack } from 'nativescript-vue';
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
  }
])
</script>