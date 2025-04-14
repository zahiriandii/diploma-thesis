<template>
    <Page>
  <FlexboxLayout flexDirection="column" class="h-full bg-gray-100 p-4">
    
    <!-- Back Button -->
    <FlexboxLayout flexDirection="row" class="mb-4 items-center ">
  <Button
    text="X"
    @tap="$modal.close"
    color="black"
    class="rounded-md mr-4 text-2xl bg-slate-200"
  />
  <Label
    text="Choose a city"
    class="bg-gray-400 text-white px-10 py-2 rounded-xl text-xl"
  />
</FlexboxLayout>
    <!-- Main content in a scrollable layout -->
    <ScrollView class="flex-1">
      <StackLayout class="p-4 rounded-2xl shadow-xl border-2 border-yellow-600 bg-white">

        <!-- Title -->
        

        <!-- City List -->
        <StackLayout>
          <StackLayout
            v-for="(city, index) in cities"
            :key="index"
            class="bg-white p-6 m-2 rounded-xl shadow-md"
            @tap="selectDesiredCity({ index })"
          >
            <Label :text="city" class="text-2xl text-black" />
          </StackLayout>
        </StackLayout>

      </StackLayout>
    </ScrollView>

  </FlexboxLayout>
</Page>

  </template>
  
  <script lang="ts" setup>
  import { $closeModal } from 'nativescript-vue';
  
    
    
   const props = defineProps<{
    cities: string[] 
   }>()
   
   const selectDesiredCity = (args: any) => {
    const index = args.index;  // Get the index of the selected item
    const city = props.cities[index];  // Access the selected city from the cities array
    $closeModal(city);  // Close modal and return selected city
  
  };
  
    
  </script>