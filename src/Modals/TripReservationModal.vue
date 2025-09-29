<template>
  <Page>
    <ActionBar title="Booking" />
    <!-- Design this component by creating 2 more components for the sections -->
    <ScrollView>
      <StackLayout class="p-4 space-y-4">

        <!-- Passengers Section -->
        <StackLayout class="bg-white rounded-2xl shadow p-4 space-y-2">
          <Label text="1 Passengers" class="text-lg font-bold text-green-600" />
          <Label text="* Required information" class="text-xs text-gray-500" />

          <GridLayout columns="*,*" class="gap-2">
            <TextField v-model="firstName" hint="First name *" col="0"
              class="border border-gray-300 rounded-lg px-3 py-2" />
            <TextField v-model="lastName" hint="Last name *" col="1"
              class="border border-gray-300 rounded-lg px-3 py-2" />
          </GridLayout>
        </StackLayout>

        <!-- Seat Reservation Section -->
        <StackLayout class="bg-white rounded-2xl shadow p-4 space-y-3">
          <Label text="2 Seat Reservation" class="text-lg font-bold text-green-600" />

          <!-- Option 1 -->
          <StackLayout @tap="onSelectSeat"
            class="flex-row items-center border border-gray-300 rounded-xl p-3 active:bg-gray-100">
            <Label text="🪑" class="text-2xl mr-3" />
            <StackLayout>
              <Label text="Select your seat" class="font-semibold text-base" />
              <Label text="from 2,99 €" class="text-sm text-gray-500" />
            </StackLayout>
          </StackLayout>

          <!-- Option 2 -->
          
        </StackLayout>

     
      <!-- Lugagge info -->
       

        <!-- Extras Section -->
        <StackLayout class="bg-white rounded-2xl shadow p-4 space-y-3">
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
        <StackLayout class="bg-white rounded-2xl shadow p-4 space-y-3">
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
        <StackLayout class="bg-white rounded-2xl shadow p-4 space-y-3">
    <!-- Section Title -->
    <Label text="5 Payment" class="text-lg font-bold text-green-600" />
    <Label text="Please choose a payment method" class="text-sm text-gray-600" />

    <!-- Cards Option -->
    <StackLayout orientation="horizontal" @tap="selected = 'cards'"
      :class="['flex-row items-center justify-between border rounded-xl p-3',
              selected === 'cards' ? 'border-green-500 bg-green-50' : 'border-gray-300']">
      <StackLayout orientation="horizontal" class="items-center space-x-3">
        <Label :text="selected === 'cards' ? '🔘' : '⚪️'" class="text-xl" />
        <Label text="💳 Card" class="font-semibold text-base" />
      </StackLayout>
    </StackLayout>
    <!-- cash payment -->
    <StackLayout orientation="horizontal" @tap="selected = 'cash'"
      :class="['flex-row items-center justify-between border rounded-xl p-3',
              selected === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-300']">
      <StackLayout orientation="horizontal" class="items-center space-x-3">
        <Label :text="selected === 'cash' ? '🔘' : '⚪️'" class="text-xl" />
        <Label text="💵 Cash" class="font-semibold text-base" />
      </StackLayout>
    </StackLayout>
    </StackLayout>
        <Button text="Proceed  to payment" class="bg-lime-500 text-white font-bold rounded-lg py-2" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts" setup>
import { ref } from "nativescript-vue";

const firstName = ref("");
const lastName = ref("");
const luggageCount = ref(0);
const climateContribution = ref(false);
const email = ref("");
const phone = ref("");
const selected = ref("");
const incrementLuggage = () => {
  luggageCount.value++;
};

const decrementLuggage = () => {
  if (luggageCount.value > 0) {
    luggageCount.value--;
  }
};

const onSelectSeat = () => {
  console.log("Select your seat tapped");
};

const onNeighbourFree = () => {
  console.log("Neighbour-free tapped");
};
</script>
