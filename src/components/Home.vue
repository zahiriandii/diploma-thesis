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
