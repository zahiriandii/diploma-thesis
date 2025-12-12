<template>
    <Page>
        <ActionBar title=" info" class="bg-white text-blue-800">
      <NavigationButton ref="navBtn" text="Back" @tap="$navigateBack()" />
    </ActionBar>
  <StackLayout class="bg-white rounded-2xl p-4">
    
    <!-- Header -->
    <GridLayout columns="auto,*" class="mb-4">
      <!-- Close (X) -->
      <Button
        text="✕"
        backgroundColor="transparent"
        class="text-xl text-gray-500"
        height="40"
        padding="0"
        @tap="close"
      />

      <!-- Title -->
      <Label
        col="1"
        text="Bus Info"
        class="text-lg font-bold text-center"
      />
    </GridLayout>

    <!-- Content -->
    <Label
      text="Test bus info"
      class="text-base text-gray-700 text-center"
      textWrap="true"
    />

  </StackLayout>
  </Page>
</template>

<script setup lang="ts">
import { Page } from "@nativescript/core";
import { $navigateBack } from "nativescript-vue";

function close() {
  $navigateBack();
}
</script>
