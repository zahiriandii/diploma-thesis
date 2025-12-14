<template>
  <Page class="bg-white rounded-2xl p-6">
    <ScrollView>
      <StackLayout class="space-y-4">

        <!-- Header -->
        <FlexboxLayout justifyContent="space-between" alignItems="center">
          <Label text="Sign in" class="text-2xl font-bold text-blue-900" />
          <Button text="✕" @tap="$modal.close" class="text-2xl text-gray-600 bg-gray-200 rounded-full w-8 h-8" />
        </FlexboxLayout>

        <!-- E-mail -->
        <TextField v-model="email"
                   hint="E-mail"
                   keyboardType="email"
                   autocorrect="false"
                   autocapitalizationType="none"
                   class="border border-gray-300 rounded-lg px-4 py-2 text-base" />
        <Label 
          v-if="errorEmail"
          :text="errorEmail"
          class="errorText"/>

        <!-- Password -->
        <GridLayout columns="*,auto"
                    class="border border-gray-300 rounded-lg items-center px-4 py-2">
          <TextField v-model="password"
                     :secure="!showPassword"
                     hint="Password"
                     col="0" />
          <Label :text="showPassword ? '🙈' : '👁️'"
                 @tap="togglePassword"
                 col="1"
                 class="text-xl text-gray-500" />
        </GridLayout>
        <Label 
          v-if="errorPassword"
          :text="errorPassword"
          class="errorText"/>

        <!-- Forgot password -->
        <Label text="Forgot your password?"
               class="text-pink-700 text-right underline text-sm" />

        <!-- Newsletter consent -->
        <FlexboxLayout @tap="agree = !agree" class="items-start mt-2">
          <Switch  v-model="agree"/>
          <Label textWrap="true"
                 text="I agree to receive newsletters, personalized marketing, surveys and discounted offers according to the Privacy Notice. I can unsubscribe at any time."
                 class="ml-2 text-xs" 
                 style="line-height: 14; max-width: 85%;"/>
        </FlexboxLayout>

        <!-- Buttons -->
        <Button text="Sign in"
                @tap="signIn"
                class="bg-green-700 text-white rounded-lg py-3 text-base font-semibold" />
        <Button text="Cancel"
                @tap="$modal.close"
                class="bg-grey-900 text-black rounded-lg py-3 text-base font-semibold" />

        <!-- reCAPTCHA notice -->
        <Label textWrap="true"
               text="This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply."
               class="text-xs text-center text-gray-500 mt-2 border border-gray-200 rounded p-2" />

        <!-- Footer links -->
        <FlexboxLayout justifyContent="space-between" class="mt-4">
          <Label text="Register" @tap="toRegister" class="text-green-700 underline text-sm" />
          <Label text="Info" class="text-pink-700 underline text-sm" />
        </FlexboxLayout>

      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script setup lang="ts">
import { Switch,ApplicationSettings, alert } from '@nativescript/core';
import { $closeModal, $showModal, ref } from 'nativescript-vue';
import RegisterModal from './RegisterModal.vue';

const email = ref('');
const password = ref('');
const agree = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);

//error states
const errorEmail = ref("");
const errorPassword = ref("");

const base_backend_url = 'http://busapp-alb-536116599.eu-north-1.elb.amazonaws.com';

function togglePassword() {
  showPassword.value = !showPassword.value;
}

const  signIn = async () =>{
  errorEmail.value = "";
  errorPassword.value = "";
  
  let hasError = false;

  if (!email.value)
   {
    errorEmail.value = "Please fill the required field";
    hasError=true;
   }

   if(!password.value)
   {
    errorPassword.value = "Please fill the required field";
    hasError = true;
   }

   if(hasError)
   {
    return;
   }

 try {
  isLoading.value = true;

  const response = await fetch(`${base_backend_url}/auth/logIn`,
  {
    method: 'POST',
    headers: 
    {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    }),
  }
    
  );

  if (!response.ok)
  {
    const errorText = await response.text();
    console.log("Error text:" ,errorText);
    alert("LogIn failed please check the email and password!")
    return;
  }

  const data = await response.json();
  console.log("LogIn success");
  //close modal after successful logIn -> later go to home view.
  $closeModal({ success:true });

  if (data.token)
  {
    ApplicationSettings.setString("authToken", data.token);
    ApplicationSettings.setString("userId", data.userId.toString());
    ApplicationSettings.setString("userEmail", data.email);
    ApplicationSettings.setString("firstName", data.firstName);
    ApplicationSettings.setString("lastName", data.lastName);
    console.log(data.firstName)
  }

 } catch (error) {
  
  console.log("Error while logging in:",error);
  alert("Something went wrong , please try again later");
 }
 finally
 {
  isLoading.value = false;
 }

}

const toRegister = () =>
{
  $showModal(RegisterModal,{
    fullscreen: true,
    props:{

    },
    closeCallback: (result) =>
    {

    }
  })
}
</script>

<style scoped>
.errorText {
  color: #DC2626; /* red-ish */
  font-size: 10;
  margin-top: 4;
}
</style>