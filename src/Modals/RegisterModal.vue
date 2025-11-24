<template>
  <Page class="bg-white rounded-2xl p-6">
    <ScrollView>
      <StackLayout class="space-y-4">

        <!-- Header -->
        <FlexboxLayout justifyContent="space-between" alignItems="center">
          <Label text="Register" class="text-2xl font-bold text-blue-900" />
          <Button text="✕" @tap="$modal.close" class="text-2xl text-gray-600 bg-gray-200 rounded-full w-8 h-8" />
        </FlexboxLayout>

        <!-- First / Last Name -->
        <GridLayout columns="*,*" class="gap-2">
          <TextField v-model="firstName" hint="First name" class="border border-gray-300 rounded-lg px-4 py-2 text-base" col="0" />
          <TextField v-model="lastName" hint="Last name" class="border border-gray-300 rounded-lg px-4 py-2 text-base" col="1" />
        </GridLayout>

        <!-- Date of Birth -->
        <TextField v-model="birthDate" hint="Date of birth" class="border border-gray-300 rounded-lg px-4 py-2 text-base" />

        <!-- Gender Selection -->
        <GridLayout columns="*,*" class="border border-gray-300 rounded-lg overflow-hidden">
          <Button
            col="0"
            text="👩‍🦰 Female"
            @tap="selectGender('female')"
            :class="[
              'py-2 text-base',
              gender === 'female'
                ? 'bg-blue-100 text-blue-900 font-bold'
                : 'text-gray-600'
            ]"
          />
          <Button
            col="1"
            text="👨‍🦱 Male"
            @tap="selectGender('male')"
            :class="[
              'py-2 text-base',
              gender === 'male'
                ? 'bg-blue-100 text-blue-900 font-bold'
                : 'text-gray-600'
            ]"
          />
        </GridLayout>

        <!-- Country Code -->
        <TextField v-model="countryCode" hint="Country code" class="border border-gray-300 rounded-lg px-4 py-2 text-base" />

        <!-- Mobile Phone -->
        <TextField v-model="phoneNumber" hint="Mobile Phone number" keyboardType="phone" class="border border-gray-300 rounded-lg px-4 py-2 text-base" />

        <!-- E-mail -->
        <TextField v-model="email" hint="E-mail" keyboardType="email" autocorrect="false" autocapitalizationType="none" class="border border-gray-300 rounded-lg px-4 py-2 text-base" />

        <!-- Password -->
        <GridLayout columns="*,auto" class="border border-gray-300 rounded-lg items-center px-4 py-2">
          <TextField v-model="password" :secure="!showPassword" hint="Password" col="0" />
          <Label :text="showPassword ? '🙈' : '👁️'" @tap="togglePassword" col="1" class="text-xl text-gray-500" />
        </GridLayout>

        <!-- Country / Region -->
        <TextField v-model="country" hint="Country/Region" class="border border-gray-300 rounded-lg px-4 py-2 text-base" />

        <!-- Buttons -->
        <Button text="Register" @tap="register" class="bg-green-700 text-white rounded-lg py-3 text-base font-semibold" />
        <Button text="Cancel" @tap="$modal.close" class="bg-grey-900 text-black rounded-lg py-3 text-base font-semibold" />

      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script setup lang="ts">
import { alert, ApplicationSettings,exitEvent } from '@nativescript/core';
import { $closeModal, ref } from 'nativescript-vue';
import { json } from 'stream/consumers';

const firstName = ref('');
const lastName = ref('');
const birthDate = ref('');
const gender = ref('');
const countryCode = ref('');
const phoneNumber = ref('');
const email = ref('');
const password = ref('');
const country = ref('');
const showPassword = ref(false);
const isLoading = ref(false);

const base_backend_url = 'http://10.0.2.2:8080';

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function selectGender(value: string) {
  gender.value = value;
}

const register =  async () => {
  
  if (!firstName.value || !lastName.value || !birthDate.value || !gender.value || !countryCode.value || !phoneNumber.value || !email.value || !password.value || !country.value )
    {
      alert("Please fill the required fields in order to continue to register.");
      return;
    }

    try {
      isLoading.value = true;

      const response = await fetch(`${base_backend_url}/auth/register`,
        {
          method: 'POST',
          headers:
          {
            'Content-type' : 'application/json'
          },
          body: JSON.stringify({
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
            phoneNumber: phoneNumber.value,
            gender: gender.value.toUpperCase(),
            birthDate: birthDate.value,
            country: country.value
          }),
          
        }
      );

        if (!response.ok)
        {
          const errotText = await response.text();
          console.log("Error text: ",errotText);
          alert("Registration failed , please try again later!");
          return;
        }
        

        const data = await response.json();
        console.log("Registration is successful");
        if (data.token)
        {
          ApplicationSettings.setString("authToken", data.token);
          ApplicationSettings.setString("userId", data.userId.toString());
          ApplicationSettings.setString("userEmail", data.email);
          ApplicationSettings.setString("firstName", data.firstName);
          ApplicationSettings.setString("lastName", data.lastName);
          console.log(data.firstName)

          $closeModal({success : true});
        } 
        //closeModal after successful registration
        $closeModal();

      
    } catch (error) {
      
      console.log("Error while registering ,", error);
      alert("Something went wrong , please try again later");
    }
    finally
    {
      isLoading.value=false;
    }


}

function close() {
  console.log('Closed');
  // If used as a modal:
  // this.$modal.close()
}
</script>
