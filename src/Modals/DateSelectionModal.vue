<template>
    <StackLayout class="p-20 bg-white rounded shadow-lg" width="90%" horizontalAlignment="center">
      <Label text="Select a date:" class="mb-4 font-bold text-lg" />
      <DatePicker 
        :year="date.getFullYear()" 
        :month="date.getMonth() + 1" 
        :day="date.getDate()" 
        @dateChange="onDateChange" />
      <Button text="Confirm" class="mt-4" @tap="confirm" />
      <Button text="Cancel" class="mt-2 text-red-500" @tap="close" />
    </StackLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'nativescript-vue'
  import { $closeModal } from 'nativescript-vue'


  const props = defineProps({ selected: String })
  const date = ref(new Date())
  
  onMounted(() => {
    if (props.selected) {
      date.value = new Date(props.selected)
    }
  })
  
  function onDateChange(e) {
    date.value = e.value
  }
  
  function confirm() {
    $closeModal(date.value.toDateString())
  }
  
  function close() {
    $closeModal.close
  }
  </script>
  