<template>
  <Page>
    <ActionBar title="Date Picker" />
    <StackLayout>
      <Button text="Close" @tap="$modal.close" class="close-button" />
      <RadCalendar
        :selectionMode="'Single'"
        @dateSelected="onDateSelected"
        height="400"
        :monthViewStyle="calendarMonthViewStyle"
      />
      
    </StackLayout>
  </Page>
</template>

<script setup>
import { $closeModal } from 'nativescript-vue';
import { ref, computed } from 'vue';
import { Color } from '@nativescript/core';
import { 
  CalendarMonthViewStyle, 
  DayCellStyle, 
  CellStyle, 
  CalendarFontStyle 
} from 'nativescript-ui-calendar';

const selectedDate = ref();

function onDateSelected(event) {
  selectedDate.value = event.date;
  $closeModal(selectedDate.value); // Pass the raw date value, not a ref
  console.log(selectedDate.value)
}

// Define your calendar styles
const calendarMonthViewStyle = computed(() => {
  const monthViewStyle = new CalendarMonthViewStyle();

  // Header styling (Month and Year)
  const titleCellStyle = new CellStyle();
  titleCellStyle.cellBackgroundColor = new Color("#4CAF50"); // Green background
  titleCellStyle.cellTextColor = new Color("white"); // White text
  titleCellStyle.cellTextSize = 20;
  titleCellStyle.cellPadding = 10;
  monthViewStyle.titleCellStyle = titleCellStyle;

  // Day names styling (Mon, Tue, etc.)
  const dayNameCellStyle = new CellStyle();
  dayNameCellStyle.cellBackgroundColor = new Color("#f0f0f0"); // Light gray background
  dayNameCellStyle.cellTextColor = new Color("#666666"); // Darker gray text
  dayNameCellStyle.cellTextSize = 14;
  monthViewStyle.dayNameCellStyle = dayNameCellStyle;

  // Today's cell styling
  const todayCellStyle = new DayCellStyle();
  todayCellStyle.cellBackgroundColor = new Color("#e0f7fa"); // Light blue background
  todayCellStyle.cellBorderWidth = 1;
  todayCellStyle.cellBorderColor = new Color("#00BCD4"); // Cyan border
  todayCellStyle.cellTextColor = new Color("#000000"); // Black text
  todayCellStyle.cellTextFontName = "sans-serif-medium";
  todayCellStyle.cellTextSize = 16;
  todayCellStyle.cellTextFontStyle = CalendarFontStyle.Bold;
  monthViewStyle.todayCellStyle = todayCellStyle;

  // Selected day cell styling
  const selectedCellStyle = new DayCellStyle();
  selectedCellStyle.cellBackgroundColor = new Color("#FFC107"); // Amber background
  selectedCellStyle.cellBorderWidth = 2;
  selectedCellStyle.cellBorderColor = new Color("#FFA000"); // Darker amber border
  selectedCellStyle.cellTextColor = new Color("#FFFFFF"); // White text
  selectedCellStyle.cellTextFontName = "sans-serif-bold";
  selectedCellStyle.cellTextSize = 18;
  selectedCellStyle.cellTextFontStyle = CalendarFontStyle.Bold;
  monthViewStyle.selectedDayCellStyle = selectedCellStyle;
  
  // Normal day cell styling
  const dayCellStyle = new DayCellStyle();
  dayCellStyle.cellBackgroundColor = new Color("#FFFFFF"); // White background
  dayCellStyle.cellTextColor = new Color("#333333"); // Dark gray text
  dayCellStyle.cellTextSize = 16;
  monthViewStyle.dayCellStyle = dayCellStyle;

  // Weekend day cell styling (e.g., Saturday and Sunday)
  const weekendCellStyle = new DayCellStyle();
  weekendCellStyle.cellBackgroundColor = new Color("#f8f8f8"); // Very light gray
  weekendCellStyle.cellTextColor = new Color("#FF5722"); // Deep Orange for weekends
  weekendCellStyle.cellTextSize = 16;
  monthViewStyle.weekendCellStyle = weekendCellStyle;

  // Other month days (days from previous/next month visible in the current view)
  const otherMonthCellStyle = new DayCellStyle();
  otherMonthCellStyle.cellBackgroundColor = new Color("#f0f0f0"); // Light gray
  otherMonthCellStyle.cellTextColor = new Color("#AAAAAA"); // Lighter gray for other month dates
  otherMonthCellStyle.cellTextSize = 14;
  monthViewStyle.otherMonthCellStyle = otherMonthCellStyle;


  // Overall calendar background color (behind the cells)
  monthViewStyle.backgroundColor = new Color("#E8F5E9"); // Very light green

  return monthViewStyle;
});
</script>

<style scoped>
/* You can also use global CSS or scoped CSS for general element styling */
.close-button {
  margin-top: 20;
  background-color: #F44336; /* Red */
  color: white;
  padding: 10;
  border-radius: 5;
  font-size: 18;
}

/* Example of targeting the RadCalendar directly with CSS (limited properties) */
RadCalendar {
  border-width: 1;
  border-color: lightgray;
  border-radius: 8;
  margin: 10;
}
</style>