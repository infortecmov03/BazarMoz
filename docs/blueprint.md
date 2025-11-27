# **App Name**: Bazar Moçambique

## Core Features:

- Product Catalog: Dynamically load and display products from a `products.js` file in individual cards with image, name, price, and 'Add to Cart' button.
- Shopping Cart Management: Persist shopping cart state in local storage, ensuring items are saved even after page reload or browser closure. Display item count on a cart icon in the header.
- Anonymous Authentication: Automatically log in users as anonymous upon entering the site, allowing them to add items to the cart before registration.  Optionally link to other authentication schemes via 'linkWithCredential' after the user authenticates using phone or email. Uses a Firebase tool.
- Email Authentication: Implement email registration with mandatory verification. Send verification email upon registration, sign out the user, and display a message. Verify `user.emailVerified` property on login attempts.
- Phone Authentication: Utilize Firebase's invisible RecaptchaVerifier and `signInWithPhoneNumber` to send SMS codes. After anonymous registration, link phone credential to the existing anonymous account using `auth.currentUser.linkWithCredential()`.
- Dynamic Header Interface: Use `onAuthStateChanged` to dynamically update the header interface, showing 'Hello, [user]' and 'Logout' when logged in, or 'Login / Register' when anonymous.
- Firestore Order Processing: Ensure checkout form can only be submitted by logged in and verified users. Save order data (cart items, customer details, user ID, status) as a new document in the 'orders' collection in Firestore. Clear local storage cart and display confirmation page upon success.

## Style Guidelines:

- Primary color: Deep blue (#0056b3), inspired by a sense of trust, stability and professionalism. It anchors the overall aesthetic, suggesting reliability and security in financial transactions.
- Background color: Very light blue-gray (#f8f9fa) that provides a clean backdrop and makes other elements pop.
- Accent color: Sky blue (#ADD8E6) is analogous to the primary color, with more brightness for interactive elements and highlights without distracting from the main focus.
- Body and headline font: 'Inter', a grotesque-style sans-serif, for a modern, machined look. 'Inter' is used throughout the application for a consistent feel.
- Simple, clean icons to represent various actions and categories within the e-commerce site.
- Minimalist layout with clear sections for product display, cart, and checkout, optimized for both mobile and desktop devices.
- Subtle transitions and animations to enhance user experience, such as item added to cart or loading indicators.