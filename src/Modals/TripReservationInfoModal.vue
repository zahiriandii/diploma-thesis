<template>
  <StackLayout class="bg-white rounded-2xl border border-gray-300">
    <!-- Trip Info -->
    <StackLayout class="p-4">
      <!-- Date -->
      <Label text="Tue, 30 Sep" class="font-semibold text-gray-900 text-base" />

      <!-- Operator -->
      <Label text="FlixBus"
             class="bg-green-200 text-green-700 text-xs font-bold px-2 py-0.5 rounded-lg w-fit mt-1" />

      <!-- Route with vertical line -->
      <GridLayout columns="auto, *" rows="auto,auto" class="mt-3">
        <!-- Icons + line -->
        <StackLayout col="0" rowSpan="2" class="items-center">
          <Label text="⬤" class="text-red-500 text-sm" />
          <StackLayout class="flex-1 w-px bg-gray-400 my-1"></StackLayout>
          <Label text="⬤" class="text-red-500 text-sm" />
        </StackLayout>

        <!-- Start station -->
        <GridLayout col="1" row="0" columns="*,auto" class="items-center mb-2">
          <Label text="Berlin Südkreuz train station"
                 class="text-gray-800 text-sm font-medium"
                 col="0" />
          <Label text="00:15"
                 class="text-gray-800 text-sm font-semibold"
                 col="1" />
        </GridLayout>

        <!-- End station -->
        <GridLayout col="1" row="1" columns="*,auto" class="items-center">
          <Label text="Vienna Erdberg (Busterminal VIB)"
                 class="text-gray-800 text-sm font-medium"
                 col="0" />
          <Label text="09:10"
                 class="text-gray-800 text-sm font-semibold"
                 col="1" />
        </GridLayout>
      </GridLayout>

      <!-- Direct Trip -->
      <Label text="DIRECT TRIP"
             class="text-green-700 font-bold text-xs mt-3" />
    </StackLayout>

    <!-- Divider -->
    <StackLayout class="h-px bg-gray-200"></StackLayout>

    <!-- Price Summary -->
    <StackLayout class="p-4 space-y-2">
      <GridLayout columns="*,auto">
        <Label text="Total (incl. VAT)" class="font-bold text-gray-900" col="0" />
        <Label text="50,98 €" class="font-bold text-gray-900" col="1" />
      </GridLayout>

      <GridLayout columns="*,auto">
        <Label text="1 Adult" class="text-gray-700 text-sm" col="0" />
        <Label text="49,99 €" class="text-gray-700 text-sm" col="1" />
      </GridLayout>

      <GridLayout columns="*,auto">
        <Label text="Service Fee" class="text-gray-700 text-sm" col="0" />
        <Label text="0,99 €" class="text-gray-700 text-sm" col="1" />
      </GridLayout>
    </StackLayout>
  </StackLayout>
</template>

<script setup lang="ts">
</script>
