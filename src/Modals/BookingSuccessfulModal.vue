<template>
  <Page>

      <StackLayout class="p-6 items-center space-y-4">
        <Label text="🎉 Booking Successful!" class="text-xl font-bold text-green-600" />

        <Button
          text="Go to Home"
          class="bg-lime-500 text-white rounded-xl px-6 py-2"
          @tap="goHome"
        />
      </StackLayout>
   
  </Page>
</template>

<script setup lang="ts">
import Home from '~/components/Home.vue';
import { $navigateTo } from 'nativescript-vue';

const goHome = () => {
  $navigateTo(Home, {
    clearHistory: true,
  });
};
</script>
