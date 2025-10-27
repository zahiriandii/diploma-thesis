<template>
  <Frame>
  <Page>
    <ActionBar class="bg-green-600 text-white">
      <GridLayout columns="auto, *, auto" class="items-center w-full px-2">
        <!-- Left: Logo -->
        <FlexboxLayout col="0" class="items-center space-x-2">
          <Image src="" height="40" width="40" />
          <Label text="Bus Ticket" class="font-bold text-lg text-blue-800" />
        </FlexboxLayout>

        <!-- Center (spacer, optional for symmetry) -->
        <StackLayout col="1"></StackLayout>

        <!-- Right: Login Button -->
        <Button 
          col="2"
          text="Login"
          @tap="toSignIn"
          class="bg-white font-semibold text-green-700 "
        />
      </GridLayout>
    </ActionBar>

    <GridLayout rows="*,auto" backgroundColor="#F3F4F6">
      <!-- Main content -->
      <ScrollView row="0">
        <StackLayout>
          <!-- Header image -->
          <Image src="" stretch="aspectFill" height="180" />

          <!-- Card -->
          <StackLayout class="card">
            <!-- From -->
            <Label text="From" class="caption" />
            <Button  :text="selectedCity == null || selectedCity == '' ? 'From' : selectedCity " @tap="selectCity" width="100%" class="flatButton"/>

            <!-- To + swap -->
            <GridLayout columns="*,auto" marginTop="8">
               <Button :text="selectedTo == '' ? 'To' : selectedTo " @tap="selectCityTo" width="100%" class="flatButton" col="0"/>
               <Button text="⇅" @tap="swapCities" col="1" class="swapBtn" />
            </GridLayout>

            <!-- Dates -->
            <GridLayout columns="*,*" marginTop="8">
              <StackLayout col="0">
                <Label text="Departing" class="caption" />
                <Button  width="100%" :text="selectedDate == null ? 'Pick a Date' : formatedOneWay.substring(0,10) " @tap="openDateModal" class="flatButton"/>
              </StackLayout>
              <StackLayout col="1" marginLeft="8">
                <Label text="Return" class="caption" />
                <Button  width="100%" :text="selectedReturnDate == null ? 'Return Date' : formatedReturnDate.substring(0,10) " @tap="openReturnDateSelection" class="flatButton"/>
              </StackLayout>
            </GridLayout>

            <!-- Passengers -->
            <Label text="Passengers/Bikes" class="caption" marginTop="8" />
            <Button :text="!selectedPassengers.adults ? 'Passengers' : `${selectedPassengers.adults.toString()} Adult`  " @tap="selectPassengers" width="200" class=" bg-lime-200 rounded-md shadow-xl"/>

            <!-- Search -->
             <Button :text="'Search'" width="200" class=" bg-lime-200 rounded-md shadow-xl " @tap="searchForTrips"/>
          </StackLayout>
        </StackLayout>
      </ScrollView>

      <!-- Bottom navigation -->
      <GridLayout row="1" columns="*,*,*" class="bottomNav">
        <StackLayout col="0" class="navItem" @tap="selectTab('booking')">
          <Label text="🔍" />
          <Label text="Booking" :class="tab === 'booking' ? 'activeTab' : 'inactiveTab'" />
        </StackLayout>

        <StackLayout col="1" class="navItem" @tap="selectTab('tickets')">
          <Label text="🎟️" />
          <Label text="Tickets" :class="tab === 'tickets' ? 'activeTab' : 'inactiveTab'" />
        </StackLayout>

        <StackLayout col="2" class="navItem" @tap="selectTab('more')">
          <Label text="ℹ️" />
          <Label text="More" :class="tab === 'more' ? 'activeTab' : 'inactiveTab'" />
        </StackLayout>
      </GridLayout>
    </GridLayout>
  </Page>
  </Frame>
</template>

<script setup lang="ts">
import { $navigateTo, ref } from 'nativescript-vue';
import { $showModal } from 'nativescript-vue';
import CityModal from '~/Modals/CityModal.vue';
import CityToModal from '~/Modals/CityToModal.vue';
import DateSelectionModal from '~/Modals/DateSelectionModal.vue';
import ReturnDateSelection from '~/Modals/ReturnDateSelection.vue';
import SearchModal from '~/Modals/SearchModal.vue';
import PassengersModal from '~/Modals/PassengersModal.vue';
import SignInModal from '~/Modals/SignInModal.vue';

const tab = ref('booking');

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

function swapCities() {
  const tmp = selectedCity.value;
  selectedCity.value = selectedTo.value;
  selectedTo.value = tmp;
}

const selectCity = () =>
{
 $showModal(CityModal, {
      fullscreen: true,
      props: {
        
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
        
      },
      closeCallback: (selected) => 
      {
        selectedTo.value = selected;
      }
     })
   }

    const openDateModal = () =>
   {
    $showModal(DateSelectionModal,{
      fullscreen: true,
      props: {
         //selected: selectedDate.value
      },
      closeCallback : (result) => 
      {
         // Solved the exception when clicking the back navigation button from the departure date selection (DateSelectionModal)
        selectedDate.value = result
        if (selectedDate.value == null)
          {
            return;
          }
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
        // Solved the exception when clicking the back navigation button from the departure date selection (ReturnDateSelectionModal)
        selectedReturnDate.value = result;
        if(selectedReturnDate.value == null)
          {
            return;
          }
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
    $navigateTo(SearchModal,{
      props:{
        citys: [selectedCity.value, selectedTo.value]
      },
      transition:
      {
        name: 'slide',
        duration: 350
      }
    })
  //   $showModal(SearchModal,{
  //     fullscreen: true,
  //     props:{
  //       citys: [selectedCity.value,selectedTo.value] //error only on VsCode
  //     },
  //     closeCallback: (result) =>
  //     {

  //     }
  //   })
  // }
  // function selectTab(name: string) {
  // tab.value = name;
  // console.log('Selected tab:', name);
}

const toSignIn = () =>
{
  $showModal(SignInModal,{
    fullscreen: true,
    props:{

    },
    closeCallback: (result) =>
    {
      
    }
  })
}

</script>

<style scoped>
.card {
  margin: 16;
  margin-top: -24;
  padding: 16;
  background-color: #fff;
  border-radius: 16;
  elevation: 4;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 8;
  shadow-offset: 0 2;
}
.caption {
  color: #6B7280;
  font-size: 12;
  margin-bottom: 4;
}
.flatButton {
  border-width: 1;
  border-color: #D1D5DB;
  border-radius: 8;
  padding: 12;
  font-size: 16;
  color: #000;
  background-color: #fff;
  text-align: left;       /* Makes the text align like an input */
  elevation: 0;           /* Removes Android shadow */
  shadow-color: transparent;
}
.input {
  border-width: 1;
  border-color: #D1D5DB;
  border-radius: 8;
  padding: 12;
  font-size: 16;
}
.swapBtn {
  width: 44;
  height: 44;
  margin-left: 8;
  background-color: #E5E7EB;
  border-radius: 22;
  font-weight: bold;
}
.primaryBtn {
  background-color: #B9E100;
  color: #000;
  padding: 12;
  border-radius: 8;
  font-weight: bold;
}
.bottomNav {
  height: 60;
  background-color: #fff;
  border-top-width: 1;
  border-top-color: #D1D5DB;
}
.navItem {
  vertical-align: middle;
  horizontal-align: center;
}
.activeTab {
  color: #B9E100;
}
.inactiveTab {
  color: #6B7280;
}
</style>
