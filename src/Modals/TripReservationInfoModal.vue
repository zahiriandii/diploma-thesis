<template>
  
  <Page>
    <ActionBar title="Ticket Info" class="bg-white text-blue-800">
        <NavigationButton
          text="Back"
          ref="navBtn"
          @tap="$navigateBack()"
        />
      </ActionBar>
    <ScrollView>
      <StackLayout class="p-4 space-y-3">

        <!-- Trip Card -->
        <StackLayout class="bg-white rounded-2xl shadow border border-gray-200 p-4 m-5  space-y-3">

          <!-- Date -->
          <Label :text="`${departureDate}`" class="text-base font-semibold text-gray-800" />

          <!-- Operator -->
          <FlexboxLayout class="items-center">
            <Label text="TestBus" class="bg-lime-200 text-green-700 font-semibold rounded-xl px-3 py-0.5 text-sm" />
          </FlexboxLayout>

          <!-- Route -->
          <StackLayout class="mt-2 space-y-3">
            <FlexboxLayout class="justify-between items-center">
              <Label :text="`${departureStation} Main Station`" class="text-gray-700 text-base w-4/5 " />
              <Label :text="`${departureTime}`" class="text-gray-800 font-semibold text-base" />
            </FlexboxLayout>

            <FlexboxLayout class="justify-between items-center">
              <Label :text="`${arrivalStation} Main Station`" class="text-gray-700 text-base w-4/5" />
              <Label :text="`${arrivalTime}`" class="text-gray-800 font-semibold text-base" />
            </FlexboxLayout>
          </StackLayout>

          <!-- Direct Trip -->
          <Label text="DIRECT TRIP" class="text-green-700 font-bold text-sm" />

        </StackLayout>
        <!-- Passenger info  -->
        <StackLayout class="bg-white rounded-2xl shadow border border-gray-200 p-5 m-5 space-y-2">
          <Label text="Passengers & Seats" class="text-lg font-bold text-gray-800" />

          <StackLayout
            v-for="(p, index) in passengers"
            :key="index"
            class="flex-row justify-between items-center py-1"
          >
            <!-- Left: name + type -->
            <StackLayout>
              <Label
                :text="`${index + 1}. ${p.firstName || 'Passenger'} ${p.lastName || ''}`"
                class="font-semibold text-base"
              />
              <Label
                :text="`Type: ${p.type}`"
                class="text-xs text-gray-500"
              />
            </StackLayout>

            <!-- Right: seat -->
            <Label
              v-if="p.seatNumber"
              :text="`Seat ${p.seatNumber}`"
              class="font-bold text-base text-green-700"
            />
            <Label
              v-else
              text="No seat selected"
              class="text-sm text-gray-400"
            />
          </StackLayout>
        </StackLayout>

        <!-- Total Section -->
        <StackLayout class="bg-white rounded-2xl shadow border border-gray-200 p-5 m-5 space-y-2">

          <FlexboxLayout class="justify-between items-center">
            <Label text="Total (incl. VAT)" class="font-semibold text-base" />
            <Label :text="`${totalPrice} €`" class="font-bold text-base" />
          </FlexboxLayout>

          <StackLayout class="border-t border-gray-300 mt-1 pt-1 space-y-1">
            <FlexboxLayout class="justify-between">
              <Label :text=" `${adults} Adults`" class="text-gray-600" />
              <Label :text="`${price} €`" class="text-gray-700" />
            </FlexboxLayout>

            <FlexboxLayout class="justify-between">
              <FlexboxLayout class="items-center space-x-1">
                <Label text="Service Fee" class="text-gray-600" />
                <Label text="ℹ️" class="text-gray-400 text-sm" />
              </FlexboxLayout>
              <!-- <Label text="0,99 €" class="text-gray-700" /> -->
            </FlexboxLayout>
          </StackLayout>

        </StackLayout>

        <!-- Payment Selection Section -->
    <StackLayout class="bg-white rounded-2xl shadow border border-gray-200 p-5 space-y-2">
          <Label text="5 Payment" class="text-lg font-bold text-green-600" />
          <Label text="Please choose a payment method" class="text-sm text-gray-600" />

          <!-- Card Option -->
          <StackLayout
            orientation="horizontal"
            @tap="selectOption('cards')"
            :class="[
              'flex-row items-center justify-between border rounded-xl p-3',
              selected === 'cards' ? 'border-green-500 bg-green-50' : 'border-gray-300'
            ]">
            <StackLayout orientation="horizontal" class="items-center space-x-3">
              <Label :text="selected === 'cards' ? '🔘' : '⚪️'" class="text-xl" />
              <Label text="💳 Card" class="font-semibold text-base" />
            </StackLayout>
          </StackLayout>

          <!-- Cash Option -->
          <StackLayout
            orientation="horizontal"
            @tap="selectOption('cash')"
            :class="[
              'flex-row items-center justify-between border rounded-xl p-3',
              selected === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-300'
            ]">
            <StackLayout orientation="horizontal" class="items-center space-x-3">
              <Label :text="selected === 'cash' ? '🔘' : '⚪️'" class="text-xl" />
              <Label text="💵 Cash" class="font-semibold text-base" />
            </StackLayout>
          </StackLayout>

          <!-- Card Info Section -->
          <StackLayout
            v-if="showCardInfo"
            class="mt-3 bg-gray-50 rounded-xl p-4 space-y-3 border border-green-100">
            <TextField hint="Cardholder Name" v-model="CardHolderName"/>
            <TextField hint="Card Number" v-model="CardNumber" keyboardType="number" />
            <StackLayout orientation="horizontal" class="space-x-2">
              <TextField hint="MM/YY" v-model="CardMonthAndYearExpirity" width="45%" />
              <TextField hint="CVV" width="45%" v-model="CardCVV" keyboardType="number" />
            </StackLayout>
          </StackLayout>
        </StackLayout>

      <StackLayout >
        <Button text="Pay" class="bg-lime-500 rounded-2xl shadow border border-gray-200 p-5 m-5 space-y-2" @tap="confirmBooking"/>
      </StackLayout>
     
      </StackLayout>
    </ScrollView>
  </Page>
 
</template>

<script setup lang="ts">
import { alert, StackLayout } from '@nativescript/core';
import { onMounted,ref ,computed, $navigateBack} from 'nativescript-vue';
import { isAndroid } from '@nativescript/core';
import { bookingState,totalPassengers ,totalPrice,resetBookingState} from '~/stores/bookingStore';
import { ApplicationSettings } from '@nativescript/core';
import { $navigateTo } from 'nativescript-vue';
import Home from '~/components/Home.vue';
import BookingSuccessfulModal from './BookingSuccessfulModal.vue';

const selected = ref("");
const showCardInfo = ref(false);
const CardHolderName = ref("");
const CardNumber = ref();
const CardMonthAndYearExpirity = ref('');
const CardCVV = ref();
const navBtn = ref();

const adults = bookingState.selectedPassengers.adults;


const passengers = computed(() => bookingState.passengersForm);

const props = defineProps<{
  departureStation: string,
  arrivalStation: string,
  tripId: string,
  departureDate: string,
  departureTime: string,
  arrivalTime: string,
  price: number
}>()



const selectOption = async (method: string) =>
{
  selected.value = method;

  if (method === 'cards')
    {
      showCardInfo.value = true;
    }
    else
    {
      showCardInfo.value = false;
    }
}
const base_backend_url = 'http://10.0.2.2:8080';

const confirmBooking = async () => {
  try {
    // You will take main contact from first passenger or bookingState
    const mainPassenger = bookingState.passengersForm[0];

    const payload = {
      tripId: Number(props.tripId),
      firstName: mainPassenger?.firstName ?? "",
      lastName: mainPassenger?.lastName ?? "",
      contactEmail: bookingState.contactEmail,
      passengers: bookingState.passengersForm.map(p => ({
        firstName: p.firstName,
        lastName: p.lastName,
        type: p.type,
        seatId: p.seatId
      }))
    };

    console.log("Sending booking payload:", payload);

    // Get your JWT token from wherever you store it (auth store, AppSettings, etc.)
    const token = ApplicationSettings.getString('authToken');

    const response = await fetch(`${base_backend_url}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Booking failed:", errorText);
      alert({
        title: "Error",
        message: "Booking failed. Please try again.",
        okButtonText: "OK"
      });
      return;
    }

    const data = await response.json();
    console.log("Booking success:", data);

    alert({
      title: "Success",
      message: "Your booking has been confirmed!",
      okButtonText: "OK"
    });

    // Optionally navigate to "My bookings" or home screen here
    resetBookingState();
    $navigateTo(Home,{
      clearHistory: true
    });
    

  } catch (err) {
    console.error("Error calling booking API:", err);
    alert({
      title: "Error",
      message: "Something went wrong. Please check your connection.",
      okButtonText: "OK"
    });
  }
 
};





onMounted(() => {
  if (isAndroid && navBtn.value?.nativeView?.android) {
    navBtn.value.nativeView.android.systemIcon = 'ic_menu_back'
  }
})
</script>
