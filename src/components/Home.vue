<script lang="ts" setup>

  import { $showModal, ref } from 'nativescript-vue';
import CityModal from '~/Modals/CityModal.vue';
import CityToModal from '~/Modals/CityToModal.vue';

  const selectedCity = ref('');
  const selectedTo = ref('');

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

</script>

<template>
  
  <Page>
    <StackLayout>
      <!-- Custom "ActionBar" -->
      <GridLayout columns="auto, *" rows="auto" class="custom-action-bar">
        <Label text="🏠" col="0" class="icon" />
        <Label text="Home Component" col="1" class="title" />
      </GridLayout>

      <!-- Page content -->
      <StackLayout>
        <Label text="From" />
        <Button text="Select a City" @tap="selectCity" />
        <Label :text="'Selected From ' + selectedCity" />
        <Label text="To" textWrap="true" />
        <Button text="Select a city" @tap="selectCityTo"/>
        <Label :text="'Selected To ' + selectedTo " textWrap="true" />
        
        
      </StackLayout>
    </StackLayout>
  </Page>

</template>

<style>
.custom-action-bar {
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
}
</style>
