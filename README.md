# Bus Ticket Reservation System – Mobile Application

## Description

This project represents the **mobile application** of the *Bus Ticket Reservation System*, developed as part of a **university diploma thesis**. The mobile app allows users to search for bus trips, select seats, enter passenger details, complete payments, and receive booking confirmations.

The application communicates with a Spring Boot backend through RESTful APIs and is designed to provide a simple and user-friendly booking experience on mobile devices.

---

## Technologies Used

* NativeScript-Vue 3
* TypeScript
* Tailwind CSS
* Android & iOS support
* Stripe SDK (mobile payments)

---

## Configuration

Before running the application, make sure the backend server is running and update the API base URL inside the mobile app configuration files.

Example:

```ts
const API_BASE_URL = "http://localhost:8080/api";
```

For real devices, the backend URL should be replaced with the machine’s local IP address or deployed backend URL.

---

## Running the Application

1. Install NativeScript CLI:

```bash
npm install -g @nativescript/cli
```

2. Install project dependencies:

```bash
npm install
```

3. Run the application on Android:

```bash
ns run android
```

or on iOS:

```bash
ns run ios
```

The application will start on the selected emulator or connected device.
