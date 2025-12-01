import { reactive, computed } from "nativescript-vue";

export const bookingState = reactive({
  tripId: null as number | null,
  departureStation: "",
  arrivalStation: "",
  basePrice: 0,

  selectedPassengers: {
    adults: 0,
    children: 0,
    infants: 0
  },

  selectedSeats: [] as { seatId: number; seatNumber: string }[],

  extras: {
    extraLuggageCount: 0
  }
});

export const totalPassengers = computed(() =>
  bookingState.selectedPassengers.adults +
  bookingState.selectedPassengers.children +
  bookingState.selectedPassengers.infants
);

export const totalPrice = computed(() => {
  const base = bookingState.basePrice * totalPassengers.value;
  const extraLuggage = bookingState.extras.extraLuggageCount * 160; // example
  return base + extraLuggage;
});