<script lang="ts" setup>

  import { FlexboxLayout, StackLayout } from '@nativescript/core';
import { $showModal, ref } from 'nativescript-vue';
import CityModal from '~/Modals/CityModal.vue';
import CityToModal from '~/Modals/CityToModal.vue';
import DateSelectionModal from '~/Modals/DateSelectionModal.vue';
import PassengersModal from '~/Modals/PassengersModal.vue';
import ReturnDateSelection from '~/Modals/ReturnDateSelection.vue';
import SearchModal from '~/Modals/SearchModal.vue';


  const selectedCity = ref('');
  const selectedTo = ref('');
  const selectedDate = ref();
  const selectedReturnDate = ref();
  const selectedPassengers = ref({
    adults: 0,
    children: 0,
    infants: 0
  });
  var formatedOneWay = ref('');
  var formatedReturnDate = ref('');
   const selectCity = () =>
   {
    $showModal(CityModal, {
      fullscreen: true,
      props: {
        cities: ["Kumanovo","Skopje","Wien"] 
      },
      closeCallback: (selected) =>
      {
        selectedCity.value = selected;
      }
    });
   }

   const selectCityTo = () =>
   {
     $showModal(CityToModal, {
      fullscreen: true,
      props: {
        cities: ["Kumanovo","Skopje","Wien"]
      },
      closeCallback: (selected) => 
      {
        selectedTo.value = selected;
      }
     })
   }
    // OneWayDateSelection
   const openDateModal = () =>
   {
    $showModal(DateSelectionModal,{
      fullscreen: true,
      props: {
         //selected: selectedDate.value
      },
      closeCallback : (result) => 
      {
        selectedDate.value = result
        formatedOneWay = selectedDate.value.toLocaleDateString("en-US",
        {
          weekday: "short",
          day: "numeric",
        });
      }
      
    })
    
   }

   const openReturnDateSelection = () =>
   {
     $showModal(ReturnDateSelection,{
      fullscreen: true,
      props:
      {

      },
      closeCallback: (result) =>
      {
        selectedReturnDate.value = result;
        formatedReturnDate = selectedReturnDate.value.toLocaleDateString("en-US",
        {
          weekday: "short",
          day: "numeric",
        });
      }
     })
   }
   const selectPassengers = () =>
   {
    $showModal(PassengersModal,{
      fullscreen: true,
      props: {

      },
      closeCallback: (result) =>
      {
        if (result)
        {
        selectedPassengers.value = result
        console.log(selectedPassengers.value.adults)
        }
        else
        {
          console.log("Modal closed without selection");
        }
         
      }
    })
   }

  const searchForTrips = () =>
  {
    $showModal(SearchModal,{
      fullscreen: true,
      props:{
        citys: [selectedCity.value,selectedTo.value] //error only on VsCode
      },
      closeCallback: (result) =>
      {

      }
    })
  }

</script>

<template>
  
  <Page>
    <StackLayout>
      <!-- Custom "ActionBar" -->
      

      <!-- Page content -->
      <StackLayout style="border-width: 2; border-color: #818cf8;" 
                   class=" mt-5 pt-36 rounded-xl shadow-xl" 
                   width="350" height="500">
        
        
        
      <Button :text="selectedCity == '' ? 'From' : selectedCity " @tap="selectCity" width="200" class=" bg-lime-200 rounded-md shadow-xl"/>
      <!-- Flexbox inside StackLayout -->
     <FlexboxLayout justifyContent="center" alignItems="center" height="100">
      <Label :text="'Selected From ' + selectedCity" />
     </FlexboxLayout>

     
     <Button :text="selectedTo == '' ? 'To' : selectedTo " @tap="selectCityTo" width="200" class=" bg-lime-200 rounded-md shadow-xl"/>
     <FlexboxLayout justifyContent="center" alignItems="center" height="100">
      <Label :text="'Selected To ' + selectedTo" textWrap="true" />
     </FlexboxLayout>
      </StackLayout>
        <FlexboxLayout flexDirection="row" paddingLeft="65">
          <Button  width="130" :text="selectedDate == null ? 'Pick a Date' : formatedOneWay.substring(0,10) " @tap="openDateModal" />
          <Button  width="130" :text="selectedReturnDate == null ? 'Return Date' : formatedReturnDate.substring(0,10) " @tap="openReturnDateSelection" />
        </FlexboxLayout>
      
      <!-- Passengers -->
      <Button :text="!selectedPassengers.adults ? 'Passengers' : `${selectedPassengers.adults.toString()} Adult`  " @tap="selectPassengers" width="200" class=" bg-lime-200 rounded-md shadow-xl"/>
     <FlexboxLayout justifyContent="center" alignItems="center" height="100">
      
     </FlexboxLayout>
      
     <!-- Search -->
      <StackLayout v-if="selectedCity && selectedTo ">
        <Button :text="'Search'" width="200" class=" bg-lime-200 rounded-md shadow-xl" @tap="searchForTrips"/>
      </StackLayout>
    </StackLayout>
    </Page>
  

</template>

<!-- <style>
/* .custom-action-bar {
  padding: 12px;
  background-color: #3f51b5;
  color: white;
  height: 56;
  vertical-align: middle;
}

.title {
  font-size: 20;
  color: white;
  margin-left: 12;
  vertical-align: center;
}

.icon {
  font-size: 20;
  color: white;
  vertical-align: center;
} */
</style> -->
