# ForkFast — Food Delivery Mobile App

A cross-platform food delivery mobile app built with **React Native (Expo)** and **TypeScript**.

## Features

- **Onboarding & Auth** — onboarding screen, email/password login and signup (mock auth, persisted locally)
- **Home** — greeting header, category filters, and a browsable list of restaurants
- **Search** — search restaurants, cuisines, or specific dishes
- **Restaurant details** — menu grouped by popularity, add/remove items with quantity steppers
- **Cart** — persisted across app restarts, per-restaurant cart with subtotal/fees/total breakdown
- **Checkout** — delivery address, payment method selection, order summary
- **Order tracking** — live-updating order status timeline (placed → confirmed → preparing → out for delivery → delivered)
- **Order history** — list of past and in-progress orders
- **Profile** — user info and account menu with logout

## Tech Stack

- [Expo](https://expo.dev) (SDK 51) + React Native 0.74
- TypeScript
- [React Navigation](https://reactnavigation.org) (native stack + bottom tabs)
- React Context for state (auth, cart, orders)
- `@react-native-async-storage/async-storage` for local persistence
- `@expo/vector-icons` for iconography

No backend is required — restaurant and menu data is mocked in `src/data`, and auth/orders are simulated locally so the app is fully runnable out of the box.

## Project Structure

```
App.tsx                     App entry: providers + navigation container
src/
  components/                Reusable UI pieces (RestaurantCard, MenuItemRow, ...)
  context/                    AuthContext, CartContext, OrdersContext
  data/                        Mock restaurants, menus, and categories
  navigation/                 RootNavigator (stack) + MainTabNavigator (tabs) + types
  screens/                    All app screens
  theme/                       Colors, spacing, typography tokens
  types/                       Shared TypeScript types
```

## Getting Started

```bash
npm install
npm start
```

This opens the Expo developer tools. From there you can:

- Press `i` to launch the iOS simulator (macOS only)
- Press `a` to launch an Android emulator
- Press `w` to run in a web browser
- Scan the QR code with the **Expo Go** app on your phone

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run ios` | Start and open in iOS simulator |
| `npm run android` | Start and open in Android emulator |
| `npm run web` | Start and open in a browser |
| `npm run typecheck` | Run the TypeScript compiler with no output |

## Notes

- Auth and order placement are simulated client-side (no real backend/network calls), so you can sign up with any name/email/password combination.
- Order status advances automatically every few seconds to demonstrate the tracking flow.
- Menu/restaurant images are placeholder images served from picsum.photos.
