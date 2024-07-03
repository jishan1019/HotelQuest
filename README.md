# HotelQuest - Server

The HotelQuest Server is a comprehensive application designed to facilitate the efficient management of room rentals. Developed using modern technologies, it offers robust features for both users and administrators. Key functionalities include:

- Secure login and signup system.
- User management system with capabilities for creating, updating, and managing user profiles.
- Room management system that allows for adding new create new room and updating their status (available or unavailable). Unavailable room cannot - be booked.
- User room booking system to book available room.
- Admin booking management system for overseeing all bookings.
- Booking room check-in,check-out,cancelling system to handle the complete process seamlessly.
- Total cost calculation system that calculates booking costs based on check-in and check-out times, including day differences.
- Admin all room booking price management system to manage pricing effectively.
- Clean and well-structured code with comprehensive error handling for a smooth user experience.

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- Yarn (v1.22 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/jishan1019/HotelQuest.git
   cd HotelQuest
   ```

2. **Install Necessary Dependency via command**

   ```
   pnpm
   ```

3. **Run Project via below command**

   ```
   pnpm start:dev
   Project Running Port : http://localhost:4000
   ```

4. ** CREDENTIAL **

   ```
   user:

    {
    "email": "user@gmail.com",
    "password": "1234"
    }

   admin:

   {
    "email": "admin@gmail.com",
    "password": "1234"
   }

   ```

### Api Endpoints

1. **USER**

```
local base_url:http://localhost:4000
Production Base URL: https://hotel-quest.vercel.app

 1. GET ALL user (Admin) : {{base_url}}/api/v1/users/all-user || Query: email,role
 2. Get Specific user (Admin,User) : {{base_url}}/api/v1/users/single-user/_id
 3. PATCH (Update User, Admin,User)  : {{base_url}}/api/v1/users/update-user/_id
 4. Delete User (Admin) : {{base_url}}/api/v1/users/delete-user/_id
 5. Get Me By Token (Admin,User) : {{base_url}}/api/v1/users/me || BearerToken
```

2.  **AUTH**

```
1. Login User (POST) : {{base_url}}/api/v1/auth/signin
2. Signup User (POST) : {{base_url}}/api/v1/auth/signup
3. Create Refresh Token (POST) : {{base_url}}/api/v1/auth/refresh-token

```

3.  **BOOKING**

```
1. Get All Booking (GET / Admin) : {{base_url}}/api/v1/bookings/all-booking || Query: bookingStatus,totalCost,cancelledAt,checkOutAt,checkInAt,bookedAt,id || searchTerm = booking status, check in, check out

2. Get Single Booking (GET / Admin) : {{base_url}}/api/v1/bookings/single-booking/id
3. Get User Booking (GET / User) : {{base_url}}/api/v1/bookings/my-bookings || BerarToken
4. Create Booking (POST / User) : {{base_url}}/api/v1/bookings/create-bookings
5. Check In Booking (PATCH / Admin) : {{base_url}}/api/v1/rooms/check-in
6. Check Out Booking (PATCH / Admin) : {{base_url}}/api/v1/rooms/check-out
7. Cancel Booking (PATCH / User) : {{base_url}}/api/v1/rooms/cancel-booking
```

4.  **ROOM**

```
1. Get All room (GET, Admin, User) : {{base_url}}/api/v1/rooms//all-room || Query: isBooked,pricePerNight,type,roomNo || searchTerm = single
2. Get Specific room (GET, Admin, User) : {{base_url}}/api/v1/rooms/single-room/id
3. Create room (POST / Admin) : {{base_url}}/api/v1/rooms/create-room
4. Update room (PUT / Admin) : {{base_url}}/api/v1/rooms//update-room/id
5. Delete room (Delete / Admin) : {{base_url}}/api/v1/rooms/delete-room/id


```

5. **API DOC**

```
local base_url:http://localhost:4000
Production Base URL: https://hotel-quest.vercel.app

 1. Api Doc: http://localhost:4000/api-docs/
 2. Api Doc live Site: https://hotel-quest.vercel.app/api-docs/

```
