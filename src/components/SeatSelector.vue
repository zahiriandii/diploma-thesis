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
              <Button
                v-for="(seat, index) in row.left"
                :key="'L' + index"
                :text="seat.symbol"
                @tap="toggleSeat(i, 'left', index)"
                :class="getSeatClass(seat)"
              />
            </FlexboxLayout>

            <FlexboxLayout col="2" class="justify-start space-x-2">
              <Button
                v-for="(seat, index) in row.right"
                :key="'R' + index"
                :text="seat.symbol"
                @tap="toggleSeat(i, 'right', index)"
                :class="getSeatClass(seat)"
              />
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
import { ref } from 'nativescript-vue';

const seatLayout = ref([
  { left: [{ status: 'available', symbol: '▲' }, { status: 'available', symbol: '▲' }],
    right: [{ status: 'reserved', symbol: 'X' }, { status: 'reserved', symbol: 'X' }] },
  { left: [{ status: 'selected', symbol: '👤' }, { status: 'selected', symbol: '👤' }],
    right: [{ status: 'reserved', symbol: 'X' }, { status: 'reserved', symbol: 'X' }] },
  { left: [{ status: 'available', symbol: '▲' }, { status: 'available', symbol: '▲' }],
    right: [{ status: 'available', symbol: '▲' }, { status: 'reserved', symbol: 'X' }] },
  { left: [{ status: 'reserved', symbol: 'X' }, { status: 'available', symbol: '▲' }],
    right: [{ status: 'available', symbol: '▲' }, { status: 'reserved', symbol: 'X' }] },
  { left: [{ status: 'available', symbol: '▲' }, { status: 'available', symbol: '▲' }],
    right: [{ status: 'reserved', symbol: 'X' }, { status: 'available', symbol: '▲' }] },
  { left: [{ status: 'available', symbol: '▲' }, { status: 'available', symbol: '▲' }],
    right: [{ status: 'reserved', symbol: 'X' }, { status: 'reserved', symbol: 'X' }] },
  { left: [{ status: 'available', symbol: '▲' }, { status: 'available', symbol: '▲' }],
    right: [{ status: 'reserved', symbol: 'X' }, { status: 'available', symbol: '▲' }] },
  { left: [{ status: 'available', symbol: '▲' }, { status: 'available', symbol: '▲' }],
    right: [{ status: 'reserved', symbol: 'X' }, { status: 'available', symbol: '▲' }] },
    { left: [{ status: 'available', symbol: '▲' }, { status: 'available', symbol: '▲' }],
    right: [{ status: 'reserved', symbol: 'X' }, { status: 'available', symbol: '▲' }] },
    { left: [{ status: 'available', symbol: '▲' }, { status: 'available', symbol: '▲' }],
    right: [{ status: 'reserved', symbol: 'X' }, { status: 'available', symbol: '▲' }] },
    { left: [{ status: 'available', symbol: '▲' }, { status: 'available', symbol: '▲' }],
    right: [{ status: 'reserved', symbol: 'X' }, { status: 'available', symbol: '▲' }] },
    { left: [{ status: 'available', symbol: '▲' }, { status: 'available', symbol: '▲' }],
    right: [{ status: 'reserved', symbol: 'X' }, { status: 'available', symbol: '▲' }] },
    { left: [{ status: 'available', symbol: '▲' }, { status: 'available', symbol: '▲' }],
    right: [{ status: 'reserved', symbol: 'X' }, { status: 'available', symbol: '▲' }] },
    { left: [{ status: 'available', symbol: '▲' }, { status: 'available', symbol: '▲' }],
    right: [{ status: 'reserved', symbol: 'X' }, { status: 'available', symbol: '▲' }] },
]);

const selectedSeatsCount = ref(2);

function toggleSeat(rowIndex: number, side: 'left' | 'right', seatIndex: number) {
  const seat = seatLayout.value[rowIndex][side][seatIndex];
  if (seat.status === 'reserved') return;
  if (seat.status === 'selected') {
    seat.status = 'available';
    seat.symbol = '▲';
    selectedSeatsCount.value--;
  } else {
    seat.status = 'selected';
    seat.symbol = '👤';
    selectedSeatsCount.value++;
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
  console.log(`Confirmed ${selectedSeatsCount.value} seat(s)`);
}

function close() {
  console.log('Modal closed');
}
</script>
