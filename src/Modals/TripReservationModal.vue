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
              :class="[!p.firstName ? 'error-input' : '', 'border rounded-lg px-3 py-2']"
              hint="First name *"
            />
           <TextField
            v-model="p.lastName"
            :class="[!p.lastName ? 'error-input' : '', 'border rounded-lg px-3 py-2']"
            col="1"
            hint="Last name *"
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
            
            <Image src="~/assets/icons/travel-2.png" width="24" height="24" />

            <StackLayout>
                <Label text="Select your seat" class="font-semibold text-base" />
                <Label text="Free " class="text-sm text-gray-500" />

                <!-- Bold selected seat numbers -->
                <Label>
                  <FormattedString>
                    <Span :text="`Selected Seats: `"
                          fontWeight="bold" 
                          color="green"/>
                    <Span 
                      :text="selectedSeats.map(s => s.seatNumber).join(', ')" 
                      fontWeight="bold"
                      color="red"
                    />
                  </FormattedString>
                </Label>

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
            <Image src="~/assets/icons/suitcase.png" width="24" height="24" />
            <StackLayout>
              <Label text="Included per person" class="font-semibold text-base" />
              <Label text="1 Hand Luggage | 7 kg · 42×30×18 cm" class="text-sm text-gray-500" />
              <Label text="1 Hold Luggage | 20 kg · 80×50×30 cm" class="text-sm text-gray-500" />
            </StackLayout>
          </StackLayout>

          <!-- Additional luggage -->
          <GridLayout
            columns="*, auto, auto, auto, auto"
            class="items-center border-t border-b border-gray-200 py-3"
          >
            <StackLayout col="0">
              <Label text="Additional luggage" class="font-semibold text-base" />
              <Label text="20 kg · 80×50×30 cm" class="text-sm text-gray-500" />
            </StackLayout>

            <Label text="+ 3 €" col="1" class="mr-3 text-sm font-medium text-gray-700" />

            <!-- Small rounded - button -->
            <Button
              text="-"
              col="2"
              class="border border-gray-300 rounded-full text-center"
              width="35"
              height="35"
              @tap="decrementLuggage()"
            />

            <!-- Luggage count -->
            <Label
              :text="luggageCount.toString()"
              col="3"
              class="w-8 text-center font-bold"
            />

            <!-- Small rounded + button -->
            <Button
              text="+"
              col="4"
              class="border border-gray-300 rounded-full text-center"
              width="35"
              height="35"
              @tap="incrementLuggage()"
            />
          </GridLayout>

        </StackLayout>

        <!-- Contact Section -->
        <StackLayout class="bg-white rounded-2xl shadow p-4 mt-5 space-y-3">
          <Label text="4 Contact" class="text-lg font-bold text-green-600" />

          <GridLayout  class="gap-3">
            <TextField
              v-model="email"
              :class="[!email ? 'error-input' : '', 'border rounded-lg px-3 py-2']"
              col="0"
              hint="Email address"
            />
            <!-- <TextField
              v-model="phone"
              :class="[!phone ? 'error-input' : '', 'border rounded-lg px-3 py-2']"
              col="1"
              hint="Last name *"
            /> -->
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
import { alert, FontWeight, isAndroid } from "@nativescript/core";
import { bookingState,totalPassengers ,passengerForm} from "~/stores/bookingStore";


const passengers = ref<passengerForm[]>([]);

// const luggageCount = ref(0);
const climateContribution = ref(false);
const email = ref("");
const phone = ref("");
const selected = ref("");
const navBtn = ref();
const selectedSeats = ref<{ seatId: number; seatNumber: string }[]>([]);

const props = defineProps<{
  departureStation: string,
  arrivalStation: string,
  tripId: string,
  departureDate: string,
  departureTime: string,
  arrivalTime: string,
  price: number
}>();

const luggageCount = ref(bookingState.extras.extraLuggageCount);

const incrementLuggage = () => {
  luggageCount.value++;
  bookingState.extras.extraLuggageCount = luggageCount.value;
};

const decrementLuggage = () => {
  if (luggageCount.value > 0) {
    luggageCount.value--;
    bookingState.extras.extraLuggageCount = luggageCount.value;
  }
};

const onSelectSeat = () => {
  $showModal(SeatSelector,{
    fullscreen: true,
    props: {
      tripId: props.tripId,
      maxSeats: totalPassengers.value
    },
    closeCallback: (result?: { seatId: number; seatNumber: string }[]) =>
    {
      if (!result || result.length === 0) {
        console.log("No seats selected");
        return;
      }

      console.log("Seats selected", result);

      // 1) Save locally
      selectedSeats.value = result;

      // 2) Save in global booking state
      bookingState.selectedSeats = result;

      // 3) Map seats to passengers by index
      bookingState.passengersForm.forEach((passenger, index) => {
        const seat = result[index];

        if (seat) {
          passenger.seatId = seat.seatId;
          passenger.seatNumber = seat.seatNumber;
        } else {
          // If fewer seats selected than passengers, clear remaining
          passenger.seatId = undefined;
          passenger.seatNumber = undefined;
        }
      });
    }
  })
};

const onNeighbourFree = () => {
  console.log("Neighbour-free tapped");
};

const proceedToPayment = () =>
{

    if (!validateForm())
    {
      return;
    }

  bookingState.contactEmail = email.value;
  bookingState.constactPhone = phone.value
  $navigateTo(TripReservationInfoModal,{
    props:{
      departureStation: props.departureStation,
      arrivalStation: props.arrivalStation,
      tripId: props.tripId,
      departureDate: props.departureDate,
      departureTime: props.departureTime,
      arrivalTime: props.arrivalTime,
      price: props.price
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
const validateForm = () => {
  // Validate passengers
  for (let p of bookingState.passengersForm) {
    if (!p.firstName || !p.lastName) {
      alert({
        title: "Missing information",
        message: "Please fill in all passenger first and last names.",
        okButtonText: "OK"
      });
      return false;
    }
  }

  // Validate seat selection
  if (!bookingState.selectedSeats || bookingState.selectedSeats.length === 0) {
    alert({
      title: "Select seat",
      message: "Please select at least one seat before proceeding.",
      okButtonText: "OK"
    });
    return false;
  }

  // Validate email
  if (!email.value || email.value.trim() === "") {
    alert({
      title: "Email required",
      message: "Please enter your contact email.",
      okButtonText: "OK"
    });
    return false;
  }

  return true; // all good
};


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
  bookingState.passengersForm = temp;
})
</script>
<style  scoped>
.error-input {
  border-color: red;
  border-width: 2;
}
</style>