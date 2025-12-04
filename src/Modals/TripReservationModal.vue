<template>
  
  <Page>
    <ActionBar :title="`${props.departureStation} -> ${props.arrivalStation}`" class="bg-white text-blue-800">
        <NavigationButton
          text="Back"
          ref="navBtn"
          @tap="$navigateBack()"
        />
      </ActionBar>
    <!-- Design this component by creating 2 more components for the sections -->
    <ScrollView>
      <StackLayout class="p-4 space-y-4">

      <!-- Passengers Section -->
      <StackLayout class="bg-white rounded-2xl shadow p-4 mt-5 space-y-2">
        <Label
          :text="`1 Passengers (${totalPassengers} total)`"
          class="text-lg font-bold text-green-600"
        />
        <Label text="* Required information" class="text-xs text-gray-500" />

        <!-- One block per passenger -->
        <StackLayout
          v-for="(p, index) in passengers"
          :key="index"
          class="mb-3"
        >
          <Label
            :text="`Passenger ${index + 1} (${p.type})`"
            class="text-sm font-semibold text-gray-700 mb-1"
          />

          <GridLayout columns="*,*" class="gap-2">
            <TextField
              v-model="p.firstName"
              hint="First name *"
              col="0"
              class="border border-gray-300 rounded-lg px-3 py-2"
            />
            <TextField
              v-model="p.lastName"
              hint="Last name *"
              col="1"
              class="border border-gray-300 rounded-lg px-3 py-2"
            />
          </GridLayout>
        </StackLayout>
      </StackLayout>

        <!-- Seat Reservation Section -->
        <StackLayout class="bg-white rounded-2xl shadow p-4 mt-5 space-y-3">
          <Label text="2 Seat Reservation" class="text-lg font-bold text-green-600" />

          <!-- Option 1 -->
          <StackLayout @tap="onSelectSeat"
            class="flex-row items-center border border-gray-300 rounded-xl p-3 active:bg-gray-100">
            <Label text="🪑" class="text-2xl mr-3" />
            <StackLayout>
              <Label text="Select your seat" class="font-semibold text-base" />
              <Label text="from 2,99 €" class="text-sm text-gray-500" />
              <label :text="`Selected Seat: ${selectedSeats.map(s => s.seatNumber).join(', ')}`  "/>
            </StackLayout>
          </StackLayout>

          <!-- Option 2 -->
          
        </StackLayout>

     
      <!-- Lugagge info -->
       

        <!-- Extras Section -->
        <StackLayout class="bg-white rounded-2xl shadow p-4 mt-5 space-y-3">
          <Label text="3 Extras" class="text-lg font-bold text-green-600" />

          <!-- Included per person -->
          <StackLayout class="flex-row items-center border border-gray-200 rounded-xl p-3 bg-gray-50">
            <Label text="🧳" class="text-2xl mr-3" />
            <StackLayout>
              <Label text="Included per person" class="font-semibold text-base" />
              <Label text="1 Hand Luggage | 7 kg · 42×30×18 cm" class="text-sm text-gray-500" />
              <Label text="1 Hold Luggage | 20 kg · 80×50×30 cm" class="text-sm text-gray-500" />
            </StackLayout>
          </StackLayout>

          <!-- Additional luggage -->
          <GridLayout columns="*,auto,auto,auto" class="items-center border-t border-b border-gray-200 py-3">
            <StackLayout col="0">
              <Label text="Additional luggage" class="font-semibold text-base" />
              <Label text="20 kg · 80×50×30 cm" class="text-sm text-gray-500" />
            </StackLayout>
            <Label text="+ 5,49 €" col="1" class="mr-3 text-sm font-medium text-gray-700" />
            <Button text="-" col="2" class="border border-gray-100 rounded-lg w-4 h-4" @tap="decrementLuggage" />
            <Label :text="luggageCount.toString()" col="3" class="w-8 text-center font-bold" />
            <Button text="+" col="4" class="border border-gray-100 rounded-lg w-4 h-4" @tap="incrementLuggage" />
        </GridLayout>
        </StackLayout>

        <!-- Contact Section -->
        <StackLayout class="bg-white rounded-2xl shadow p-4 mt-5 space-y-3">
          <Label text="4 Contact" class="text-lg font-bold text-green-600" />

          <GridLayout columns="*,*" class="gap-3">
            <TextField v-model="email" hint="Email *"
              class="border border-gray-300 rounded-lg px-3 py-2" col="0" />
            <TextField v-model="phone" hint="Phone number"
              class="border border-gray-300 rounded-lg px-3 py-2" col="1" />
          </GridLayout>

          <Label text="Used only to contact you in case of delays or itinerary changes."
            class="text-xs text-gray-500" />
        </StackLayout>
        
        <Button text="Next" class="bg-lime-500 rounded-2xl shadow border border-gray-200 p-5 mt-2 space-y-2" @tap="proceedToPayment"/>
      </StackLayout>
    </ScrollView>
  </Page>
  
</template>

<script lang="ts" setup>
import { $navigateTo, $showModal, onMounted,ref,computed } from "nativescript-vue";
import TripReservationInfoModal from "./TripReservationInfoModal.vue";
import SeatSelector from "~/components/SeatSelector.vue";
import { isAndroid } from "@nativescript/core";
import { bookingState,totalPassengers } from "~/stores/bookingStore";

type passengerForm = {
  firstName: string,
  lastName: string,
  type: 'ADULT' | 'CHILD' | 'INFANT'
}
const passengers = ref<passengerForm[]>([]);

const luggageCount = ref(0);
const climateContribution = ref(false);
const email = ref("");
const phone = ref("");
const selected = ref("");
const navBtn = ref();
const selectedSeats = ref([]);

const props = defineProps<{
  departureStation: string,
  arrivalStation: string,
  tripId: string,
  departureDate: string,
  departureTime: string,
  arrivalTime: string,
  price: string
}>();

const incrementLuggage = () => {
  luggageCount.value++;
};

const decrementLuggage = () => {
  if (luggageCount.value > 0) {
    luggageCount.value--;
  }
};

const onSelectSeat = () => {
  $showModal(SeatSelector,{
    fullscreen: true,
    props: {
      tripId: props.tripId
    },
    closeCallback: (result) =>
    {
      console.log("Seats selected",result);
      selectedSeats.value = result;
    }
  })
};

const onNeighbourFree = () => {
  console.log("Neighbour-free tapped");
};

const proceedToPayment = () =>
{

  $navigateTo(TripReservationInfoModal,{
    props:{
      departureStation: props.departureStation,
      arrivalStation: props.arrivalStation,
      tripId: props.tripId,
      departureDate: props.departureDate,
      departureTime: props.departureTime,
      arrivalTime: props.arrivalTime,
      price: props.price,
      passengers: passengers.value
    },
    transition: {
      name: 'fade',
      duration: 300
    }
  })
//  $showModal(TripReservationInfoModal,{
//   fullscreen: true,
//   props: {

//   },
//   closeCallback: (data) => 
//   {
    
//   }
//  })
}

onMounted(() => {
  if (isAndroid && navBtn.value?.nativeView?.android) {
    navBtn.value.nativeView.android.systemIcon = 'ic_menu_back'
  }
  console.log("Trip ID:", props.tripId);
  console.log("Selected passengers:", bookingState.selectedPassengers);

  const temp: passengerForm[] = [];

  // Adults
  for (let i = 0; i < bookingState.selectedPassengers.adults; i++) {
    temp.push({ firstName: "", lastName: "", type: "ADULT" });
  }

  // Children
  for (let i = 0; i < bookingState.selectedPassengers.children; i++) {
    temp.push({ firstName: "", lastName: "", type: "CHILD" });
  }

  // Infants
  for (let i = 0; i < bookingState.selectedPassengers.infants; i++) {
    temp.push({ firstName: "", lastName: "", type: "INFANT" });
  }

  passengers.value = temp;
})
</script>
