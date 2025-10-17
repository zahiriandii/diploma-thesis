<template>
  <Frame>
  <Page>
    <ActionBar title="Ticket Info" class="bg-white text-blue-800">
        <NavigationButton
          text="Back"
          android.systemIcon="ic_menu_back"
          @tap="$modal.close"
        />
      </ActionBar>
    <ScrollView>
      <StackLayout class="p-4 space-y-3">

        <!-- Trip Card -->
        <StackLayout class="bg-white rounded-2xl shadow border border-gray-200 p-4 m-5  space-y-3">

          <!-- Date -->
          <Label text="Tue, 30 Sep" class="text-base font-semibold text-gray-800" />

          <!-- Operator -->
          <FlexboxLayout class="items-center">
            <Label text="FlixBus" class="bg-lime-200 text-green-700 font-semibold rounded-xl px-3 py-0.5 text-sm" />
          </FlexboxLayout>

          <!-- Route -->
          <StackLayout class="mt-2 space-y-3">
            <FlexboxLayout class="justify-between items-center">
              <Label text="Berlin Südkreuz train station" class="text-gray-700 text-base w-4/5" />
              <Label text="00:15" class="text-gray-800 font-semibold text-base" />
            </FlexboxLayout>

            <FlexboxLayout class="justify-between items-center">
              <Label text="Vienna Erdberg (Busterminal VIB)" class="text-gray-700 text-base w-4/5" />
              <Label text="09:10" class="text-gray-800 font-semibold text-base" />
            </FlexboxLayout>
          </StackLayout>

          <!-- Direct Trip -->
          <Label text="DIRECT TRIP" class="text-green-700 font-bold text-sm" />

        </StackLayout>

        <!-- Total Section -->
        <StackLayout class="bg-white rounded-2xl shadow border border-gray-200 p-5 m-5 space-y-2">

          <FlexboxLayout class="justify-between items-center">
            <Label text="Total (incl. VAT)" class="font-semibold text-base" />
            <Label text="50,98 €" class="font-bold text-base" />
          </FlexboxLayout>

          <StackLayout class="border-t border-gray-300 mt-1 pt-1 space-y-1">
            <FlexboxLayout class="justify-between">
              <Label text="1 Adult" class="text-gray-600" />
              <Label text="49,99 €" class="text-gray-700" />
            </FlexboxLayout>

            <FlexboxLayout class="justify-between">
              <FlexboxLayout class="items-center space-x-1">
                <Label text="Service Fee" class="text-gray-600" />
                <Label text="ℹ️" class="text-gray-400 text-sm" />
              </FlexboxLayout>
              <Label text="0,99 €" class="text-gray-700" />
            </FlexboxLayout>
          </StackLayout>

        </StackLayout>

        <!-- Payment Selection Section -->
    <StackLayout class="bg-white rounded-2xl shadow border border-gray-200 p-5 space-y-2">
          <Label text="5 Payment" class="text-lg font-bold text-green-600" />
          <Label text="Please choose a payment method" class="text-sm text-gray-600" />

          <!-- Card Option -->
          <StackLayout
            orientation="horizontal"
            @tap="selectOption('cards')"
            :class="[
              'flex-row items-center justify-between border rounded-xl p-3',
              selected === 'cards' ? 'border-green-500 bg-green-50' : 'border-gray-300'
            ]">
            <StackLayout orientation="horizontal" class="items-center space-x-3">
              <Label :text="selected === 'cards' ? '🔘' : '⚪️'" class="text-xl" />
              <Label text="💳 Card" class="font-semibold text-base" />
            </StackLayout>
          </StackLayout>

          <!-- Cash Option -->
          <StackLayout
            orientation="horizontal"
            @tap="selectOption('cash')"
            :class="[
              'flex-row items-center justify-between border rounded-xl p-3',
              selected === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-300'
            ]">
            <StackLayout orientation="horizontal" class="items-center space-x-3">
              <Label :text="selected === 'cash' ? '🔘' : '⚪️'" class="text-xl" />
              <Label text="💵 Cash" class="font-semibold text-base" />
            </StackLayout>
          </StackLayout>

          <!-- Card Info Section -->
          <StackLayout
            v-if="showCardInfo"
            class="mt-3 bg-gray-50 rounded-xl p-4 space-y-3 border border-green-100">
            <TextField hint="Cardholder Name" v-model="CardHolderName"/>
            <TextField hint="Card Number" v-model="CardNumber" keyboardType="number" />
            <StackLayout orientation="horizontal" class="space-x-2">
              <TextField hint="MM/YY" v-model="CardMonthAndYearExpirity" width="45%" />
              <TextField hint="CVV" width="45%" v-model="CardCVV" keyboardType="number" />
            </StackLayout>
          </StackLayout>
        </StackLayout>

      <StackLayout >
        <Button text="Pay" class="bg-lime-500 rounded-2xl shadow border border-gray-200 p-5 m-5 space-y-2"/>
      </StackLayout>
     
      </StackLayout>
    </ScrollView>
  </Page>
  </Frame>
</template>

<script setup lang="ts">
import { StackLayout } from '@nativescript/core';
import { ref } from 'nativescript-vue';

const selected = ref("");
const showCardInfo = ref(false);
const CardHolderName = ref("");
const CardNumber = ref();
const CardMonthAndYearExpirity = ref('');
const CardCVV = ref();
const selectOption = async (method: string) =>
{
  selected.value = method;

  if (method === 'cards')
    {
      showCardInfo.value = true;
    }
    else
    {
      showCardInfo.value = false;
    }
}
</script>
