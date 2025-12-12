<template>
  
  <Page>
      <ActionBar class="bg-green-600">
      <GridLayout columns="auto, *, auto" class="items-center w-full px-3 py-1">
        
        <!-- Left: logo + app name -->
        <FlexboxLayout col="0" class="items-center">
          <!-- App icon (use your logo here) -->
          <StackLayout class="bg-white rounded-full w-8 h-8 items-center justify-center mr-2">
            <Image src="~/assets/icons/bus.png" width="24" height="24" />
          </StackLayout>
          <!-- App name -->
          <Label text="Bus Ticket"
                class="font-bold text-lg text-white" />
        </FlexboxLayout>

        <!-- Center spacer -->
        <StackLayout col="1"></StackLayout>

        <!-- Right: auth area -->
        <!-- Not logged in: pill login button -->
        <Button
          v-if="!isLoggedIn"
          col="2"
          text="Login"
          @tap="toSignIn"
          class="bg-white text-white-700 font-semibold rounded-full px-4 py-1"
        />

        <!-- Logged in: avatar + greeting -->
        <FlexboxLayout
          v-else
          col="2"
          class="items-center"
          @tap="toAccountDashboard"
        >
          <!-- Small round avatar -->
          <StackLayout class="bg-white rounded-full w-8 h-8 items-center justify-center mr-2">
            <Image src="~/assets/icons/profile.png" width="24" height="24" />
          </StackLayout>
          <!-- Greeting text -->
          <Label
            :text="`Hi, ${userName.toString()}`"
            class="text-sm font-semibold text-white"
          />
        </FlexboxLayout>

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
            <Label 
              v-if="errorCityFrom"
              :text="errorCityFrom"
              class="errorText"/>
            <!-- To + swap -->
            <GridLayout columns="*,auto" marginTop="8">
               <Button :text="selectedTo == '' ? 'To' : selectedTo " @tap="selectCityTo" width="100%" class="flatButton" col="0"/>
               <Button text="⇅" @tap="swapCities" col="1" class="swapBtn" />
            </GridLayout>
            <Label 
              v-if="errorCityTo"
              :text="errorCityTo"
              class="errorText"/>

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
            <Label 
                v-if="errorDate"
                :text="errorDate"
                class="errorText"/>

            <!-- Passengers -->
            <Label text="Passengers/Bikes" class="caption" marginTop="8" />
           <Button
            :text="`${passengerLabel}`"
            @tap="selectPassengers"
            width="200"
            class="bg-lime-200 rounded-md shadow-xl"
          />
            <!-- Search -->
             <Button :text="'Search'" width="200" class=" bg-lime-200 rounded-md shadow-xl " @tap="searchForTrips"/>
          </StackLayout>
        </StackLayout>
      </ScrollView>

      <!-- Bottom navigation -->
      <GridLayout row="1" columns="*,*,*" class="bottomNav">
        <StackLayout col="0" class="navItem" @tap="selectTab('booking')">
          <Image src="~/assets/icons/search.png" width="24" height="24" />
          <Label text="Booking" :class="tab === 'booking' ? 'activeTab' : 'inactiveTab'" />
        </StackLayout>

        <StackLayout col="1" class="navItem" @tap="openTicketInfoModal">
          <Image src="~/assets/icons/travel.png" width="24" height="24" />
          <Label text="Tickets" :class="tab === 'tickets' ? 'activeTab' : 'inactiveTab'" />
        </StackLayout>

        <StackLayout col="2" class="navItem" @tap="moreInfo">
          <Image src="~/assets/icons/mark.png" width="24" height="24" />
          <Label text="More" :class="tab === 'more' ? 'activeTab' : 'inactiveTab'" />
        </StackLayout>
      </GridLayout>
    </GridLayout>
  </Page>

</template>

<script setup lang="ts">
import { $closeModal, $navigateTo, ref,computed } from 'nativescript-vue';
import { ApplicationSettings, Button, Label } from '@nativescript/core';
import { onMounted } from 'nativescript-vue';
import { $showModal } from 'nativescript-vue';
import CityModal from '~/Modals/CityModal.vue';
import CityToModal from '~/Modals/CityToModal.vue';
import DateSelectionModal from '~/Modals/DateSelectionModal.vue';
import ReturnDateSelection from '~/Modals/ReturnDateSelection.vue';
import SearchModal from '~/Modals/SearchModal.vue';
import PassengersModal from '~/Modals/PassengersModal.vue';
import SignInModal from '~/Modals/SignInModal.vue';
import AccountDashboardProfile from '~/Modals/AccountDashboardProfile.vue';
import { bookingState,totalPassengers } from '~/stores/bookingStore';
import TicketInfoModal from '~/Modals/TicketInfoModal.vue';
import MoreModal from '~/Modals/MoreModal.vue';

const tab = ref('booking');

const selectedCity = ref('');
  const selectedTo = ref('');
  const selectedDate = ref();
  const selectedReturnDate = ref();
  const selectedPassengers = ref({
    adults: 1,
    children: 0,
    infants: 0
  });
  var formatedOneWay = ref('');
  var formatedReturnDate = ref('');
  const isLoggedIn = ref(false);
  const showUserMenu = ref(false);
  const userName = ref("");

  //error states
  const errorCityFrom = ref("");
  const errorCityTo = ref("");
  const errorDate = ref("");

function swapCities() {
  const tmp = selectedCity.value;
  selectedCity.value = selectedTo.value;
  selectedTo.value = tmp;
}


onMounted( ()=>{
  //LogIn user if the token is active
  const token = ApplicationSettings.getString('authToken');
  isLoggedIn.value = !!token
  userName.value = ApplicationSettings.getString('firstName') || "";
}

);

const passengerLabel = computed(() => {
  const { adults, children, infants } = selectedPassengers.value;

  const parts = [];

  if (adults > 0) parts.push(`${adults} 👤${adults > 1 ? 's' : ''}`);
  if (children > 0) parts.push(`${children} 🧒${children > 1 ? 'ren' : ''}`);
  if (infants > 0) parts.push(`${infants} 👶${infants > 1 ? 's' : ''}`);

  // If nothing selected
  if (parts.length === 0) return "Passengers";

  return parts.join(", ");
});

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
        //using the bookingStore.ts to store data for passengers to pass to other modals.!!
        bookingState.selectedPassengers =
        {
          adults: result.adults,
          children: result.children,
          infants: result.infants
        };
        }
        else
        {
          console.log("Modal closed without selection");
        }
         
      }
    })
   }
   
   


   const formatDateForBackend = (value: any): string => {
      // ensure we have a Date object
      const d = value instanceof Date ? value : new Date(value);

      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");

      return `${year}-${month}-${day}`;   // e.g. "2025-11-25"
    };

  const searchForTrips = () =>
  {

    errorCityFrom.value = "";
    errorCityTo.value = "";
    errorDate.value = "";


    let hasError = false;

    if (!selectedCity.value)
      {
        errorCityFrom.value = "Please select a city to continue";
        hasError = true;
      }

      if (!selectedTo.value)
      {
        errorCityTo.value = "Please select a city to continue";
        hasError = true;
      }

      if (!selectedDate.value)
      {
        errorDate.value = "Please select a date to continue";
        hasError = true;
      }

      if(hasError)
      {
        return;
      }


    
    const formattedDate = formatDateForBackend(selectedDate.value);
    console.log("formted date",formattedDate);
    $navigateTo(SearchModal,{
      props:{
        cityFrom: selectedCity.value,
        cityTo: selectedTo.value,
        date: formattedDate,
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
  }
  function selectTab(name: string) {
  tab.value = name;
  console.log('Selected tab:', name);
  }



const toSignIn = () =>
{
  $showModal(SignInModal,{
    fullscreen: true,
    props:{

    },
    closeCallback: (result) =>
    {
      if (result?.success)
        {
          isLoggedIn.value = true;
          userName.value = ApplicationSettings.getString('firstName') || "";
        }
    }
  })
}


const toAccountDashboard = () =>
{
  $showModal(AccountDashboardProfile,{
    fullscreen: true,
    props:
    {

    },
    closeCallback: (result) =>
    {
      if (result?.loggedOut)
        {
          isLoggedIn.value = false;
          userName.value = "";
        }
    }
  })
};

const openTicketInfoModal = () =>
  {
    $navigateTo(TicketInfoModal,{
      props:
      {

      },
      transition:
      {
        name: 'slide',
        duration: 350
      }
    })
  }
  const moreInfo = () =>
  {
    $navigateTo(MoreModal,{
      props:
      {

      },
      transition:
      {
        name: 'slide',
        duration: 350
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
.errorText {
  color: #DC2626; /* red-ish */
  font-size: 10;
  margin-top: 4;
}
</style>
