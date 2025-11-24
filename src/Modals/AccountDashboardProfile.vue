<template>
  <Frame>
  <Page>
    <!-- Top bar -->
    
      <ActionBar title="Account Dashboard" class="bg-white text-blue-800">
        <NavigationButton
          text="Back"
          android.systemIcon="ic_menu_back"
          @tap="$modal.close(null)"
        />
      </ActionBar>
   

    <!-- Main content -->
    <GridLayout rows="auto,*" class="bg-gray-100">
      <!-- Cards grid -->
      <GridLayout
        row="1"
        rows="auto,auto"
        columns="*,*"
        class="bg-white"
      >
        <!-- Profile card -->
        <StackLayout
          row="0" col="0"
          class="p-4 border-r border-b border-gray-200 items-center"
          @tap="goToProfile"
        >
          <Label text="👤" class="text-3xl mb-2" />
          <Label text="Your profile" class="text-base font-semibold text-gray-800" />
          <Label text="It's all about you" class="text-xs text-gray-500 mt-1" />
        </StackLayout>

        <!-- Bookings card -->
        <StackLayout
          row="0" col="1"
          class="p-4 border-b border-gray-200 items-center"
          @tap="goToBookings"
        >
          <Label text="🚌" class="text-3xl mb-2" />
          <Label text="Bookings" class="text-base font-semibold text-gray-800" />
          <Label text="Your trips" class="text-xs text-gray-500 mt-1" />
        </StackLayout>

        <!-- Logout card (full width bottom) -->
        <StackLayout
          row="1" col="0" colSpan="2"
          class="p-4 items-center"
          @tap="logout"
        >
          <Label text="🚪" class="text-3xl mb-2" />
          <Label text="Logout" class="text-base font-semibold text-red-600" />
          <Label text="Sign out from this device" class="text-xs text-gray-500 mt-1" />
        </StackLayout>
      </GridLayout>
    </GridLayout>
  </Page>
  </Frame>
</template>

<script setup lang="ts">
import { ApplicationSettings } from '@nativescript/core';
import { $closeModal, $navigateTo } from 'nativescript-vue';
// import ProfilePage from './ProfilePage.vue'
// import BookingsPage from './BookingsPage.vue'

const goToProfile = () => {
  // later: navigate to profile screen
  // $navigateTo(ProfilePage);
};

const goToBookings = () => {
  // later: navigate to bookings screen
  // $navigateTo(BookingsPage);
};

const logout = () => {
  ApplicationSettings.remove('authToken');
  ApplicationSettings.remove('userId');
  ApplicationSettings.remove('userEmail');
  ApplicationSettings.remove('firstName');
  ApplicationSettings.remove('lastName');

  // tell parent that we logged out
  $closeModal({ loggedOut: true });
  console.log("Logged out successfuly ");
};
</script>
