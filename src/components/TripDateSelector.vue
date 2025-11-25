<template>
  <StackLayout>
    <!-- Date selector row -->
    <ScrollView orientation="horizontal" class="bg-lime-500 py-2">
      <FlexboxLayout class="space-x-3 px-3">
        <Button
          v-for="(date, index) in availableDates"
          :key="index"
          :text="formatDate(date)"
          :class="[
            'rounded-full px-4 py-2 font-medium',
            selectedDate === date
              ? 'bg-white text-lime-600 border border-lime-600'
              : 'bg-lime-500 text-white'
          ]"
          @tap="selectDate(date)"
        />
      </FlexboxLayout>
    </ScrollView>
  </StackLayout>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'nativescript-vue'

const emit = defineEmits(['dateChanged'])

const today = new Date()

// Generate next 5 days (including today)
const availableDates = Array.from({ length: 3 }, (_, i) => {
  const d = new Date(today)
  d.setDate(today.getDate() + i)
  return d
})

const selectedDate = ref(today)

const formatDateForBackend = (d: Date): string => {
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`; // "2025-11-25"
};

const selectDate = (date: Date) => {
  selectedDate.value = date;
  const iso = formatDateForBackend(date);
  emit('dateChanged', iso);  // send "YYYY-MM-DD"
};

// Format date like “Sun, 19 Oct”
const formatDate = (date: Date): string => {
 const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  }

  // Format the date (e.g. "Sun, 19 Oct 2025" on some locales)
  let formatted = date.toLocaleDateString('en-GB', options)

  // Remove any year if the locale adds it automatically
  formatted = formatted.replace(/\b\d{4}\b/, '').trim()

  // Also remove any leftover commas or extra spaces
  formatted = formatted.replace(/,|\s{2,}/g, ' ').trim()

  return formatted
}
</script>

<style scoped>
.space-x-3 > * + * {
  margin-left: 12;
}
</style>
