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
      
      
      <StackLayout row="2" col="0" colSpan="2">
        <Label text="Choose a city" />
        <ListView :items="cities" @itemTap="selectDesiredCity">
          <template #item="{ item }">
            <StackLayout>
              <Label :text="item" />
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
  console.log('Selected city:', city);
  $closeModal(city);  // Close modal and return selected city

};

  
</script>