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
        <StackLayout class="bg-white rounded-2xl shadow border border-gray-200 p-4 m-5 space-y-3">
          <Label :text="`${departureDate}`" class="text-base font-semibold text-gray-800" />

          <FlexboxLayout class="items-center">
            <Label text="TestBus" class="bg-lime-200 text-green-700 font-semibold rounded-xl px-3 py-0.5 text-sm" />
          </FlexboxLayout>

          <StackLayout class="mt-2 space-y-3">
            <FlexboxLayout class="justify-between items-center">
              <Label :text="`${departureStation} Main Station`" class="text-gray-700 text-base w-4/5" />
              <Label :text="`${departureTime}`" class="text-gray-800 font-semibold text-base" />
            </FlexboxLayout>

            <FlexboxLayout class="justify-between items-center">
              <Label :text="`${arrivalStation} Main Station`" class="text-gray-700 text-base w-4/5" />
              <Label :text="`${arrivalTime}`" class="text-gray-800 font-semibold text-base" />
            </FlexboxLayout>
          </StackLayout>

          <Label text="DIRECT TRIP" class="text-green-700 font-bold text-sm" />
        </StackLayout>

        <!-- Passengers & seats -->
        <StackLayout class="bg-white rounded-2xl shadow border border-gray-200 p-5 m-5 space-y-2">
          <Label text="Passengers & Seats" class="text-lg font-bold text-gray-800" />
          <StackLayout
            v-for="(p, index) in passengers"
            :key="index"
            class="flex-row justify-between items-center py-1"
          >
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

        <!-- Total -->
        <StackLayout class="bg-white rounded-2xl shadow border border-gray-200 p-5 m-5 space-y-2">
          <FlexboxLayout class="justify-between items-center">
            <Label text="Total (incl. VAT)" class="font-semibold text-base" />
            <Label :text="`${totalPrice} €`" class="font-bold text-base" />
          </FlexboxLayout>

          <StackLayout class="border-t border-gray-300 mt-1 pt-1 space-y-1">
            <FlexboxLayout class="justify-between">
              <Label :text="`${adults} Adults`" class="text-gray-600" />
              <Label :text="`${price} €`" class="text-gray-700" />
            </FlexboxLayout>

            <FlexboxLayout class="justify-between">
              <FlexboxLayout class="items-center space-x-1">
                <Label text="Service Fee" class="text-gray-600" />
                <Label text="ℹ️" class="text-gray-400 text-sm" />
              </FlexboxLayout>
            </FlexboxLayout>
          </StackLayout>
        </StackLayout>

        <!-- Payment selection -->
        <StackLayout class="bg-white rounded-2xl shadow border border-gray-200 p-5 space-y-2">
          <Label text="5 Payment" class="text-lg font-bold text-green-600" />
          <Label text="Please choose a payment method" class="text-sm text-gray-600" />

          <!-- Cards option -->
          <StackLayout
            orientation="horizontal"
            @tap="selectOption('cards')"
            :class="[
              'flex-row items-center justify-between border rounded-xl p-3',
              selected === 'cards' ? 'border-green-500 bg-green-50' : 'border-gray-300'
            ]"
          >
            <StackLayout orientation="horizontal" class="items-center space-x-3">
              <Label :text="selected === 'cards' ? '🔘' : '⚪️'" class="text-xl" />
              <Label text="💳 Card" class="font-semibold text-base" />
            </StackLayout>
          </StackLayout>

          <!-- Cash (not wired to Stripe, optional) -->
          <!-- <StackLayout
            orientation="horizontal"
            @tap="selectOption('cash')"
            :class="[
              'flex-row items-center justify-between border rounded-xl p-3',
              selected === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-300'
            ]"
          >
            <StackLayout orientation="horizontal" class="items-center space-x-3">
              <Label :text="selected === 'cash' ? '🔘' : '⚪️'" class="text-xl" />
              <Label text="💵 Cash" class="font-semibold text-base" />
            </StackLayout>
          </StackLayout> -->

          <!-- Card info (Stripe credit card view) -->
          <StackLayout
            v-if="showCardInfo"
            class="mt-3 bg-gray-50 rounded-xl p-4 space-y-3 border border-green-100"
          >
            <!-- Stripe's native card component -->
            <creditCardView ref="cardView" class="h-40" />
          </StackLayout>
        </StackLayout>

        <!-- Pay button -->
        <StackLayout class="m-5 space-y-2">
        <Button
          :text="isPaying ? 'Processing payment…' : 'Pay'"
          class="bg-lime-500 rounded-2xl shadow border border-gray-200 p-5"
          :isEnabled="!isPaying"
          @tap="confirmBooking"
        />

        <!-- Loading spinner -->
        <ActivityIndicator
          v-if="isPaying"
          :busy="true"
          class="mt-1"
        />
      </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script setup lang="ts">
import { alert } from '@nativescript/core';
import { onMounted, ref, computed,nextTick } from 'nativescript-vue';
import { isAndroid, ApplicationSettings } from '@nativescript/core';
import Home from '~/components/Home.vue';
import { $navigateTo } from 'nativescript-vue';
import { bookingState, totalPassengers, totalPrice, resetBookingState } from '~/stores/bookingStore';

// Stripe plugin
import { Stripe, CreditCardView, CardParams } from '@triniwiz/nativescript-stripe';

// --- Stripe instance (test publishable key) ---
const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51SbknRQICgcpb4qV5qFP47ZV6AdOHpLF69lhnusUvU67GUYRLKom0lagKuDahye8dvc4RJ2Gx5WNmnlY5WVuKxl2003ycnDZPQ';
const stripe = new Stripe(STRIPE_PUBLISHABLE_KEY);

// --- UI state ---
const selected = ref<'cards' | 'cash' | ''>('');
const showCardInfo = ref(false);
const cardView = ref<CreditCardView | null>(null);
const navBtn = ref();
const isPaying = ref(false);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// booking data
const adults = bookingState.selectedPassengers.adults;
const passengers = computed(() => bookingState.passengersForm);

const props = defineProps<{
  departureStation: string;
  arrivalStation: string;
  tripId: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
}>();

const base_backend_url = 'http://10.0.2.2:8080';

// choose payment method
const selectOption = (method: 'cards' | 'cash') => {
  selected.value = method;
  showCardInfo.value = method === 'cards';
};

// Wrap callback-style Stripe.createPaymentMethod in a Promise
const createStripePaymentMethod = (viewRef: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      console.log('createStripePaymentMethod called with viewRef:', viewRef);

      const nativeView: CreditCardView | undefined =
        viewRef?.nativeView ?? viewRef;

      if (!nativeView) {
        console.error('No nativeView on cardView ref:', viewRef);
        return reject(new Error('Card view not ready'));
      }

      const cardParams: CardParams | undefined = nativeView.cardParams;
      console.log('cardParams from nativeView:', cardParams);

      if (!cardParams) {
        console.error('cardParams is null/undefined – card not filled?');
        return reject(new Error('Card details are invalid or incomplete'));
      }

      stripe.createPaymentMethod(cardParams, (error, pm) => {
        if (error) {
          console.log('Stripe createPaymentMethod error:', error);
          reject(error);
        } else {
          console.log('Stripe PaymentMethod created:', pm);
          resolve(pm);
        }
      });
    } catch (e) {
      console.error('Exception in createStripePaymentMethod:', e);
      reject(e);
    }
  });
};


const confirmBooking = async () => {

  if (isPaying.value)
    {
      return;
    }


  try {
    if (selected.value !== 'cards') {
      await alert({
        title: 'Payment method',
        message: 'Please select Card as payment method to pay with Stripe.',
        okButtonText: 'OK'
      });
      return;
    }

    if (!cardView.value) {
      await alert({
        title: 'Card details',
        message: 'Please enter your card details.',
        okButtonText: 'OK'
      });
      return;
    }

    isPaying.value = true;
    await delay(50);
    
    // 1) Create Stripe PaymentMethod from the card
    console.log('cardView.value at confirmBooking:', cardView.value);
    const paymentMethod = await createStripePaymentMethod(cardView.value);
    console.log('Stripe PaymentMethod:', paymentMethod);

    // 2) Ask backend to create & confirm PaymentIntent for this trip & passengers
    const paymentIntentPayload = {
      tripId: Number(props.tripId),
      passengers: bookingState.passengersForm.map(p => ({
        firstName: p.firstName,
        lastName: p.lastName,
        type: p.type,
        seatId: p.seatId
      })),
      paymentMethodId: paymentMethod.id   // <<<<<< IMPORTANT
    };

    console.log('Creating payment intent with payload:', paymentIntentPayload);

    const token = ApplicationSettings.getString('authToken');

    const intentResponse = await fetch(`${base_backend_url}/api/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(paymentIntentPayload)
    });

    if (!intentResponse.ok) {
      const errText = await intentResponse.text();
      console.error('PaymentIntent creation failed:', errText);
      await alert({
        title: 'Payment error',
        message: 'Could not start the payment. Please try again.',
        okButtonText: 'OK'
      });
      return;
    }

    const intentData = await intentResponse.json();
    console.log('PaymentIntent created:', intentData);

    const paymentIntentId = intentData.paymentIntentId as string;
    const paymentStatus = intentData.status as string;

    if (paymentStatus !== 'succeeded') {
      console.warn('Payment not succeeded. Status:', paymentStatus);
      await alert({
        title: 'Payment not completed',
        message: 'The payment did not succeed. Please try another card or try again.',
        okButtonText: 'OK'
      });
      return;
    }

    // 3) Now create the booking in your backend using the paymentIntentId
    const mainPassenger = bookingState.passengersForm[0];

    const bookingPayload = {
      tripId: Number(props.tripId),
      firstName: mainPassenger?.firstName ?? '',
      lastName: mainPassenger?.lastName ?? '',
      contactEmail: bookingState.contactEmail,
      paymentIntentId: paymentIntentId,
      passengers: bookingState.passengersForm.map(p => ({
        firstName: p.firstName,
        lastName: p.lastName,
        type: p.type,
        seatId: p.seatId
      }))
    };

    console.log('Sending booking payload:', bookingPayload);

    const bookingResponse = await fetch(`${base_backend_url}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bookingPayload)
    });

    if (!bookingResponse.ok) {
      const errorText = await bookingResponse.text();
      console.error('Booking failed:', errorText);
      await alert({
        title: 'Error',
        message: 'Booking failed after payment. Please contact support with your payment ID.',
        okButtonText: 'OK'
      });
      return;
    }

    const bookingData = await bookingResponse.json();
    console.log('Booking success:', bookingData);

    await alert({
      title: 'Success',
      message: 'Your booking has been confirmed!',
      okButtonText: 'OK'
    });

    resetBookingState();
    $navigateTo(Home, { clearHistory: true });
  } catch (err) {
    console.error('Error in confirmBooking:', err);
    await alert({
      title: 'Error',
      message: 'Something went wrong during payment. Please try again.',
      okButtonText: 'OK'
    });
  }
  finally
  {
    isPaying.value = false;
  }
};

onMounted(() => {
  if (isAndroid && navBtn.value?.nativeView?.android) {
    navBtn.value.nativeView.android.systemIcon = 'ic_menu_back';
  }
});
</script>

