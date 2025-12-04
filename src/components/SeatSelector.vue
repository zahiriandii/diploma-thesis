<template>
  <Page class="bg-white rounded-t-3xl">
    <!-- Use GridLayout with fixed regions -->
    <GridLayout rows="auto, *, auto">

      <!-- Header (row 0) -->
      <StackLayout row="0">
        <FlexboxLayout class="bg-lime-500 py-3 px-4 items-center justify-between">
          <Label text="Seat Reservation" class="text-lg font-bold text-white" />
          <Button text="✕" @tap="close" class="text-white text-2xl bg-transparent" />
        </FlexboxLayout>
        <Label text="Nuremberg — Berlin" class="text-base text-center text-gray-800 mt-2" />
      </StackLayout>

      <!-- Scrollable seat map (row 1) -->
      <ScrollView row="1" height="100%">
        <StackLayout class="px-6 py-4 space-y-2">
          <GridLayout
            v-for="(row, i) in seatLayout"
            :key="i"
            columns="*, 25, *"
            class="items-center justify-between"
          >
            <FlexboxLayout col="0" class="justify-end space-x-2">
              <StackLayout
                v-for="(seat, index) in row.left"
                :key="'L' + index"
                class="items-center mx-1"
              >
                <Label
                  :text="seat.seatNumber"
                  class="text-xs text-gray-600 mb-0.5"
                />
                <Button
                  :text="seat.symbol"
                  @tap="toggleSeat(i, 'left', index)"
                  :class="getSeatClass(seat)"
                />
              </StackLayout>
            </FlexboxLayout>

            <FlexboxLayout col="2" class="justify-start space-x-2">
              <StackLayout
                v-for="(seat, index) in row.right"
                :key="'R' + index"
                class="items-center mx-1"
              >
                <Label
                  :text="seat.seatNumber"
                  class="text-xs text-gray-600 mb-0.5"
                />
                <Button
                  :text="seat.symbol"
                  @tap="toggleSeat(i, 'right', index)"
                  :class="getSeatClass(seat)"
                />
              </StackLayout>
            </FlexboxLayout>

            <Label :text="i + 1" class="absolute left-0 text-xs text-gray-600" style="margin-left: -16;" />
          </GridLayout>
        </StackLayout>
      </ScrollView>

      <!-- Bottom bar (row 2) -->
      <GridLayout row="2" columns="*, auto" class="border-t border-gray-200 px-4 py-3 bg-white">
        <Label
          :text="`${selectedSeatsCount} seat${selectedSeatsCount !== 1 ? 's' : ''} reserved\n+ MKD ${selectedSeatsCount * 160}.00`"
          class="text-gray-700 text-sm font-semibold vertical-center"
        />
        <Button
          text="CONFIRM"
          @tap="confirmSelection"
          class="bg-lime-500 text-white rounded-lg px-6 py-3 font-semibold col-1"
        />
      </GridLayout>

    </GridLayout>
  </Page>
</template>

<script setup lang="ts">
import { $closeModal, ref } from 'nativescript-vue';
import { onMounted } from 'nativescript-vue';
import { getString } from '@nativescript/core/application-settings';
import { alert } from '@nativescript/core';


const props = defineProps<{
  tripId: string,
  maxSeats: number
}>();


// Our seat layout for the UI
type SeatView = {
  seatId: number;
  seatNumber: string;
  status: 'available' | 'reserved' | 'selected';
  symbol: string;
};

type SeatRow = {
  left: SeatView[];
  right: SeatView[];
};

const seatLayout = ref<SeatRow[]>([]);
const selectedSeatsCount = ref(0);
const selectedSeatIds = ref<number[]>([]);

// Load from backend when modal opens
const loadSeats = async () => {
  try {
    const url = `http://10.0.2.2:8080/trips/${props.tripId}/seats`;
    console.log("Loading seats from:", url);

     const token = getString('authToken');
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
   

    if (!response.ok) {
      const text = await response.text();
      console.log("Seat load error:", text);
      console.log("Seat load status:", response.status);
      return;
    }

    const data = await response.json();
    console.log("SeatStatusDTO[] from backend:", data);

    // data is [{ seatId, seatNumber, reserved }, ...]

    // Sort & map to our 2+2 layout
    const sorted = data.sort((a: any, b: any) =>
      a.seatNumber.localeCompare(b.seatNumber)
    );

    const rows: SeatRow[] = [];

    for (let i = 0; i < sorted.length; i += 4) {
      const slice = sorted.slice(i, i + 4);

      const left = slice.slice(0, 2).map((s: any): SeatView => ({
        seatId: s.seatId,
        seatNumber: s.seatNumber,
        status: s.reserved ? 'reserved' : 'available',
        symbol: s.reserved ? 'X' : '▲'
      }));

      const right = slice.slice(2, 4).map((s: any): SeatView => ({
        seatId: s.seatId,
        seatNumber: s.seatNumber,
        status: s.reserved ? 'reserved' : 'available',
        symbol: s.reserved ? 'X' : '▲'
      }));

      rows.push({ left, right });
    }

    seatLayout.value = rows;
    selectedSeatsCount.value = 0;
    selectedSeatIds.value = [];

  } catch (e) {
    console.log("Network error loading seats:", e);
  }
};

onMounted(() => {
  loadSeats();
});

function toggleSeat(rowIndex: number, side: 'left' | 'right', seatIndex: number) {
   const seat = seatLayout.value[rowIndex][side][seatIndex];
  if (seat.status === 'reserved') return;

  if (seat.status === 'selected') {
    // unselect
    seat.status = 'available';
    seat.symbol = '▲';
    selectedSeatsCount.value--;
    selectedSeatIds.value = selectedSeatIds.value.filter(id => id !== seat.seatId);
  } else {
    // BEFORE selecting a new seat, check limit
    if (selectedSeatsCount.value >= props.maxSeats) {
      console.log(`You can select maximum ${props.maxSeats} seat(s).`);
      alert(`You can only select ${props.maxSeats} seat(s).`)
      return;
    }

    // select
    seat.status = 'selected';
    seat.symbol = '👤';
    selectedSeatsCount.value++;
    selectedSeatIds.value.push(seat.seatId);
  }
}

function getSeatClass(seat:any) {
  return [
    'w-12 h-12 rounded-md border text-base font-bold',
    seat.status === 'available' ? 'border-gray-400 text-gray-600 bg-white' : '',
    seat.status === 'reserved' ? 'bg-gray-300 border-gray-300 text-gray-400' : '',
    seat.status === 'selected' ? 'bg-lime-500 text-white' : ''
  ];
}

function confirmSelection() {
  // Build a flat list of selected seats with seatId + seatNumber
  const selectedSeats = seatLayout.value
    .flatMap(row => [...row.left, ...row.right])
    .filter(seat => seat.status === 'selected')
    .map(seat => ({
      seatId: seat.seatId,
      seatNumber: seat.seatNumber
    }));

  console.log("Confirming seats:", selectedSeats);

  $closeModal(selectedSeats); //  sends data back to closeCallback
}

function close() {
  $closeModal();
}
</script>
