<template>
    <Page>
      
      <GridLayout rows="auto, *" columns="auto, *">
        
        <!-- Back Button (Row 0, Column 0) -->
        <Button
          text="Back"
          @tap="$modal.close"
          row="0"
          col="1"
          backgroundColor="#007aff"
          color="white"
          borderRadius="5"
        />
        
        
        <StackLayout row="2" col="0" colSpan="2" class="p-4 m-2">
        <Label text="Choose a city" class="bg-green-500 text-20px p-2 mt-4 mb-2" />
    
        <ListView :items="cities" @itemTap="selectDesiredCity" class="bg-blue-200 p-4 mt-2">
           <template #item="{ item }">
            <StackLayout class="p-4 m-2">
             <Label :text="item" class="bg-blue-200 text-20px p-2 m-1" />
            </StackLayout>
           </template>
         </ListView>
          </StackLayout>
         
        
        
        
  
      </GridLayout>
      
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