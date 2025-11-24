<template>
  <Frame>
    <Page>
      <!-- Top bar -->
      <ActionBar title="Leaving from" class="bg-white text-blue-800">
        <NavigationButton
          text="Back"
          android.systemIcon="ic_menu_back"
          @tap="$modal.close(null)"
        />
      </ActionBar>

      <!-- Main content -->
      <GridLayout rows="auto, *" class="bg-white">
        <!-- Search bar -->
        <StackLayout row="0" class="px-4 py-2">
          <TextField
            v-model="searchQuery"
            hint="Search"
            class="border border-gray-300 rounded-xl px-3 py-2 text-base"
          />
        </StackLayout>

        <!-- Scrollable list -->
        <ScrollView row="1">
          <StackLayout>
            <template v-for="(cities, country) in filteredAirports" :key="country">
              <!-- Country Header -->
              <Label
                :text="country"
                class="bg-gray-200 text-gray-600 font-bold px-4 py-2 text-sm"
              />

              <!-- City list -->
              <StackLayout>
                <template v-for="airport in cities" :key="airport.code">
                  <GridLayout
                    columns="*, auto"
                    class="px-4 py-3 border-b border-gray-200"
                    @tap="selectAirport(airport)"
                  >
                    <Label
                      :text="airport.city"
                      class="text-base col-0"
                      horizontalAlignment="left"
                    />
                    <Label
                      :text="airport.code"
                      class="text-gray-500 col-1 text-sm"
                      horizontalAlignment="right"
                    />
                  </GridLayout>
                </template>
              </StackLayout>
            </template>
          </StackLayout>
        </ScrollView>
      </GridLayout>
    </Page>
  </Frame>
</template>

<script setup>
import { ref, computed, $closeModal } from 'nativescript-vue'

const props = defineProps({
  closeCallback: Function
})

const searchQuery = ref("")

const airports = {
  Albania: [{ city: "Tirana", code: "TIA" }],
  Armenia: [
    { city: "Kumanova", code: "LWN" },
    { city: "Yerevan", code: "EVN" },
  ],
  Austria: [{ city: "Vienna", code: "VIE" }],
  Azerbaijan: [{ city: "Baku", code: "GYD" }],
  Belgium: [{ city: "Brussels Charleroi", code: "CRL" }],
  "Bosnia and Herzegovina": [
    { city: "Banja Luka", code: "BNX" },
    { city: "Sarajevo", code: "SJJ" },
    { city: "Tuzla", code: "TZL" },
  ],
  Bulgaria: [{ city: "Bourgas (Black Sea)", code: "BOJ" }],
}

const filteredAirports = computed(() => {
  if (!searchQuery.value.trim()) return airports

  const query = searchQuery.value.toLowerCase()
  const result = {}

  for (const [country, cityList] of Object.entries(airports)) {
    const filteredCities = cityList.filter(a =>
      a.city.toLowerCase().includes(query)
    )
    if (filteredCities.length) result[country] = filteredCities
  }

  return result
})

const selectAirport = (airport) => {
  console.log(airport.city)
  $closeModal(airport.city)// Return selected city
  
}

</script>
