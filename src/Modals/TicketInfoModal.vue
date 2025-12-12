<!-- SearchBookingModal.vue (full, modified) -->
<template>
  <Page>
    <ActionBar title="Ticket info" class="bg-white text-blue-800">
      <NavigationButton ref="navBtn" text="Back" @tap="$navigateBack()" />
    </ActionBar>

    <ScrollView>
      <StackLayout class="p-4 bg-white rounded-2xl">

        <!-- SEARCH AREA (hidden when ticket is saved) -->
        <StackLayout v-if="!hasSavedTicket">
          <Label text="Find your booking" class="text-xl font-bold mb-2" />

          <Label text="Booking ID" class="text-sm text-gray-600 mb-1" />
          <TextField
            v-model="bookingIdInput"
            hint="e.g. 123"
            keyboardType="number"
            class="border border-gray-200 rounded-xl px-3 py-2 mb-3"
          />

          <GridLayout columns="*,*" columnGap="12" class="mt-2">
            <Button
              col="0"
              text="Search"
              :isEnabled="canSearch && !isLoading"
              height="40"
              padding="0"
              class="bg-lime-400 rounded-lg text-sm font-semibold"
              @tap="searchBooking"
            />

            <Button
              col="1"
              text="Close"
              height="40"
              padding="0"
              class="bg-gray-200 rounded-lg text-sm"
              @tap="close"
            />
          </GridLayout>
        </StackLayout>

        <ActivityIndicator :busy="isLoading" v-if="isLoading" class="my-3" />

        <Label v-if="errorMessage" :text="errorMessage" class="text-red-500 mt-2" />

        <!-- RESULT CARD -->
        <StackLayout v-if="booking" class="mt-3 p-3 border border-gray-200 rounded-2xl">
          <Label :text="`Booking #${booking.bookingId}`" class="text-lg font-bold" />
          <Label :text="`${booking.firstName} ${booking.lastName}`" class="text-base mt-1" />
          <Label :text="booking.contactEmail" class="text-gray-600 mt-1" />
          <Label :text="`Status: ${booking.status}`" class="mt-2 font-semibold text-green-700" />
          <Label
            v-if="booking.dateCreated"
            :text="`Created: ${booking.dateCreated}`"
            class="text-gray-600 mt-1"
          />

          <Label text="Passengers" class="font-bold mt-3" />

          <StackLayout v-if="booking.passengers?.length">
            <GridLayout
              v-for="(p, i) in booking.passengers"
              :key="p.id ?? i"
              columns="*,auto"
              class="py-2 border-b border-gray-100"
            >
              <Label col="0" :text="`${p.firstName} ${p.lastName} • ${p.passengerType}`" />
              <Label col="1" :text="`Seat : ${p.seatNumber}` || '-'" class="font-bold" />
            </GridLayout>
          </StackLayout>

          <Label v-else text="No passengers found." class="text-gray-600 mt-1" />
        </StackLayout>

        <!-- DELETE TICKET (shown only when ticket is saved) -->
        <Button
          v-if="hasSavedTicket"
          text="Delete ticket"
          height="40"
          padding="0"
          class="bg-red-100 text-red-600 rounded-xl font-semibold text-sm mt-4"
          @tap="deleteSavedTicket"
        />

      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script setup lang="ts">
import { ref, computed } from "nativescript-vue";
import { alert, confirm, ApplicationSettings } from "@nativescript/core";
import { $navigateBack } from "nativescript-vue";

type PassengerDTO = {
  id: number;
  firstName: string;
  lastName: string;
  passengerType: "ADULT" | "CHILD" | "INFANT";
  seatNumber: string; // e.g. "1D"
};

type BookingDTO = {
  bookingId: number;
  tripId: number;
  firstName: string;
  lastName: string;
  contactEmail: string;
  status: "RESERVED" | "CONFIRMED" | "PENDING" | "CANCELLED";
  dateCreated: string;
  passengers: PassengerDTO[];
};

const API_BASE_URL = "http://10.0.2.2:8080";
const STORAGE_KEY = "savedTicketInfo";

const bookingIdInput = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

function saveTicketToStorage(ticket: BookingDTO) {
  ApplicationSettings.setString(STORAGE_KEY, JSON.stringify(ticket));
}

function loadTicketFromStorage(): BookingDTO | null {
  const raw = ApplicationSettings.getString(STORAGE_KEY, "");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BookingDTO;
  } catch {
    return null;
  }
}

function deleteTicketFromStorage() {
  ApplicationSettings.remove(STORAGE_KEY);
}

const booking = ref<BookingDTO | null>(loadTicketFromStorage());
const hasSavedTicket = computed(() => booking.value !== null);

const canSearch = computed(() => /^\d+$/.test(bookingIdInput.value.trim()));

const token = ApplicationSettings.getString("authToken", "");

async function searchBooking() {
  errorMessage.value = "";
  booking.value = null;

  const id = bookingIdInput.value.trim();
  if (!/^\d+$/.test(id)) {
    await alert("Please enter a valid numeric Booking ID.");
    return;
  }

  isLoading.value = true;
  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const text = await res.text(); // read once

    if (!res.ok) {
      if (res.status === 404) throw new Error("Booking not found.");
      if (res.status === 401) throw new Error("Unauthorized. Please login again.");
      throw new Error(`Request failed (${res.status}).`);
    }

    const data = JSON.parse(text) as BookingDTO;

    booking.value = data;
    saveTicketToStorage(data);
    bookingIdInput.value = ""; // optional
  } catch (e: any) {
    errorMessage.value = e?.message ?? "Something went wrong.";
  } finally {
    isLoading.value = false;
  }
}

async function deleteSavedTicket() {
  const ok = await confirm({
    title: "Delete ticket",
    message: "Remove this ticket from your device?",
    okButtonText: "Delete",
    cancelButtonText: "Cancel",
  });

  if (!ok) return;

  deleteTicketFromStorage();
  booking.value = null;
  errorMessage.value = "";
}

function close() {
  $navigateBack();
}
</script>
