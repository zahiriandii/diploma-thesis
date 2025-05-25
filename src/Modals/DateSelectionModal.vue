<template>
  <Page>
    <ActionBar title="Date Picker" />
    <StackLayout>
      <RadCalendar
        :selectionMode="'Single'"
        @dateSelected="onDateSelected"
      />
      <Button text="Close" @tap="$modal.close" />
    </StackLayout>
  </Page>
</template>

<script setup>
import { ref } from 'vue';



defineProps({
  selected: Date,
});

const selectedDate = ref(null);

function onDateSelected(event) {
  selectedDate.value = event.value;
}


</script>
