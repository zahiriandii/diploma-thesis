import { reactive, computed } from "nativescript-vue";

export type passengerForm = {
  firstName: string;
  lastName: string;
  type: 'ADULT' | 'CHILD' | 'INFANT';
  seatId?: number;
  seatNumber?: string;
};

export const bookingState = reactive({
  tripId: null as number | null,
  departureStation: "",
  arrivalStation: "",
  basePrice: 100,

  selectedPassengers: {
    adults: 1,
    children: 0,
    infants: 0
  },
  passengersForm: [] as passengerForm[],

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
  const extraLuggage = bookingState.extras.extraLuggageCount * 3; // example
  return base + extraLuggage;
});