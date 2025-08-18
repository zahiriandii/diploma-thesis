<script setup lang="ts">
import { $closeModal, ref } from "nativescript-vue";

const adults = ref(1);
const children = ref(0);
const infants = ref(0);

const emit = defineEmits(["close"]);

const increment = (type: "adult" | "child" | "infant") => {
  if (type === "adult") adults.value++;
  if (type === "child") children.value++;
  if (type === "infant") infants.value++;
};

const decrement = (type: "adult" | "child" | "infant") => {
  if (type === "adult" && adults.value > 0) adults.value--;
  if (type === "child" && children.value > 0) children.value--;
  if (type === "infant" && infants.value > 0) infants.value--;
};

const done = () => {
  emit("close", {
    adults: adults.value,
    children: children.value,
    infants: infants.value,
  });
  $closeModal();
};
</script>

<template>
  <Page>
    <ActionBar title="Add passengers">
      <NavigationButton
        text="Close"
        android.systemIcon="ic_menu_close_clear_cancel"
        @tap="$emit('close', null)"
      />
    </ActionBar>

    <StackLayout class="p-4">

      <!-- Adult -->
      <GridLayout columns="*,40,40,40" rows="auto" class="py-3 items-center">
        <StackLayout col="0">
          <Label text="Adult" class="font-bold text-lg" />
          <Label text="14+ years" class="text-gray-500 text-sm" />
        </StackLayout>
        <Button text="-" :isEnabled="adults > 0" class="counter-btn" @tap="decrement('adult')" col="1"/>
        <Label :text="adults" class="counter-label" col="2"/>
        <Button text="+" :isEnalbed="adults < 10" class="counter-btn" @tap="increment('adult')" col="3"/>
      </GridLayout>

      <!-- Child -->
      <GridLayout columns="*,40,40,40" rows="auto" class="py-3 items-center">
        <StackLayout col="0">
          <Label text="Child" class="font-bold text-lg" />
          <Label text="2-14 years" class="text-gray-500 text-sm" />
        </StackLayout>
        <Button text="-" :isEnabled="children > 0"  class="counter-btn" @tap="decrement('child')" col="1"/>
        <Label :text="children" class="counter-label" col="2"/>
        <Button text="+" :isEnabled="children < 10" class="counter-btn" @tap="increment('child')" col="3"/>
      </GridLayout>

      <!-- Infant -->
      <GridLayout columns="*,40,40,40" rows="auto" class="py-3 items-center">
        <StackLayout col="0">
          <Label text="Infant" class="font-bold text-lg" />
          <Label text="0-2 years" class="text-gray-500 text-sm" />
        </StackLayout>
        <Button text="-" :isEnabled="infants > 0" class="counter-btn" @tap="decrement('infant')" col="1"/>
        <Label :text="infants" class="counter-label" col="2"/>
        <Button text="+" :isEnabled="infants < adults" class="counter-btn" @tap="increment('infant')" col="3"/>
      </GridLayout>

      <Label
        text="To book for more than 10 passengers, please visit our website at andizahiri.com"
        textWrap="true"
        class="mt-4 text-gray-600 text-sm"
      />

      <Button text="DONE" class="mt-6 bg-pink-600 text-white rounded-lg" @tap="done"/>
    </StackLayout>
  </Page>
</template>

<style scoped>
.counter-btn {
  border-radius: 20;
  border-width: 1;
  border-color: #e91e63;
  color: #e91e63;
  width: 36;
  height: 36;
  font-size: 18;
}
.counter-label {
  text-align: center;
  vertical-align: middle;
  font-size: 18;
}
.bg-pink-600 {
  background-color: #e91e63;
}
.text-white {
  color: white;
}
.rounded-lg {
  border-radius: 10;
}
.text-gray-600 {
  color: #666;
}
</style>
