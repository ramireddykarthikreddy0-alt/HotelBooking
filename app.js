
// HOTEL DATA
const hotels = [
    {
        id: 1,
        name: "Luxury Beach Resort",
        location: "Goa",
        price: 3500,
        guests: 4,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        description: "Beautiful beach view with swimming pool and luxury rooms."
    },
    {
        id: 2,
        name: "Mountain View Hotel",
        location: "Manali",
        price: 2800,
        guests: 3,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800",
        description: "Enjoy peaceful mountain views and comfortable rooms."
    },
    {
        id: 3,
        name: "Royal Palace Hotel",
        location: "Jaipur",
        price: 4500,
        guests: 4,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        description: "Experience royal hospitality and premium facilities."
    },
    {
        id: 4,
        name: "City Comfort Hotel",
        location: "Delhi",
        price: 2200,
        guests: 2,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
        description: "Modern rooms in a convenient city location."
    },
    {
        id: 5,
        name: "Green Valley Resort",
        location: "Ooty",
        price: 3200,
        guests: 4,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
        description: "Relax in nature surrounded by beautiful green hills."
    },
    {
        id: 6,
        name: "Ocean Pearl Hotel",
        location: "Mumbai",
        price: 4000,
        guests: 3,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        description: "Premium accommodation with elegant interiors."
    }
];

const roomContainer = document.getElementById("roomContainer");
const searchForm = document.getElementById("searchForm");

// BOOKING SEARCH DETAILS
let searchDetails = {
    destination: "",
    checkin: "",
    checkout: "",
    guests: 2
};

// DISPLAY HOTELS
function displayHotels(list) {
    roomContainer.innerHTML = "";

    if (list.length === 0) {
        roomContainer.innerHTML = `
            <p class="no-results">
                No hotels found. Try another destination.
            </p>
        `;
        return;
    }

    list.forEach(hotel => {
        const card = document.createElement("div");
        card.className = "room-card";

        card.innerHTML = `
            <img src="${hotel.image}"
                 alt="${hotel.name}"
                 class="room-image">

            <div class="room-info">
                <h3>${hotel.name}</h3>

                <p>📍 ${hotel.location}</p>

                <p>${hotel.description}</p>

                <p>⭐ ${hotel.rating} Rating</p>

                <p>👥 Up to ${hotel.guests} guests</p>

                <div class="room-price">
                    ₹${hotel.price.toLocaleString("en-IN")}
                    <small>/ night</small>
                </div>

                <button class="book-button"
                        data-hotel-id="${hotel.id}">
                    Book Now
                </button>
            </div>
        `;

        roomContainer.appendChild(card);
    });
}

// INITIAL DISPLAY
displayHotels(hotels);

// SEARCH HOTELS
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const destination = document
        .getElementById("destination")
        .value.trim();

    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const guests = Number(document.getElementById("guests").value);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkinDate = new Date(checkin + "T00:00:00");
    const checkoutDate = new Date(checkout + "T00:00:00");

    if (!checkin || !checkout) {
        alert("Please select your check-in and check-out dates.");
        return;
    }

    if (checkinDate < today) {
        alert("Check-in date cannot be in the past.");
        return;
    }

    if (checkoutDate <= checkinDate) {
        alert("Check-out must be after check-in.");
        return;
    }

    searchDetails = {
        destination,
        checkin,
        checkout,
        guests
    };

    const filteredHotels = hotels.filter(hotel => {
        const locationMatch =
            hotel.location.toLowerCase().includes(
                destination.toLowerCase()
            );

        const guestMatch = hotel.guests >= guests;

        return locationMatch && guestMatch;
    });

    displayHotels(filteredHotels);

    document.getElementById("rooms").scrollIntoView({
        behavior: "smooth"
    });
});

// BOOK HOTEL
roomContainer.addEventListener("click", function(event) {
    const button = event.target.closest(".book-button");

    if (!button) return;

    const hotelId = Number(button.dataset.hotelId);

    const hotel = hotels.find(item => item.id === hotelId);

    if (!hotel) return;

    if (!searchDetails.checkin || !searchDetails.checkout) {
        alert("Please search for a hotel and select your dates first.");
        document.querySelector(".booking-section").scrollIntoView({
            behavior: "smooth"
        });
        return;
    }

    showBookingConfirmation(hotel);
});

// BOOKING CONFIRMATION
function showBookingConfirmation(hotel) {
    const checkinDate = new Date(
        searchDetails.checkin + "T00:00:00"
    );

    const checkoutDate = new Date(
        searchDetails.checkout + "T00:00:00"
    );

    const nights = Math.round(
        (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = hotel.price * nights;

    const customerName = prompt("Enter your full name:");

    if (!customerName || !customerName.trim()) {
        alert("Please enter your name to continue.");
        return;
    }

    const customerPhone = prompt("Enter your phone number:");

    if (!customerPhone || !/^[0-9]{10}$/.test(customerPhone.trim())) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    const bookingId = "STAY" + Date.now().toString().slice(-8);

    const booking = {
        bookingId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        hotel: hotel.name,
        location: hotel.location,
        checkin: searchDetails.checkin,
        checkout: searchDetails.checkout,
        guests: searchDetails.guests,
        nights,
        totalPrice
    };

    alert(`
BOOKING CONFIRMED!

Booking ID: ${booking.bookingId}

Customer: ${booking.customerName}

Hotel: ${booking.hotel}

Location: ${booking.location}

Check-in: ${booking.checkin}

Check-out: ${booking.checkout}

Guests: ${booking.guests}

Nights: ${booking.nights}

Total Amount: ₹${booking.totalPrice.toLocaleString("en-IN")}

Thank you for choosing StayEase!
    `);

    console.log("Booking details:", booking);
}

// SET MINIMUM DATE
const todayString = new Date().toISOString().split("T")[0];

document.getElementById("checkin").min = todayString;
document.getElementById("checkout").min = todayString;

// UPDATE CHECKOUT MINIMUM DATE
document.getElementById("checkin").addEventListener("change", function() {
    document.getElementById("checkout").min = this.value;

    const checkout = document.getElementById("checkout");

    if (checkout.value && checkout.value <= this.value) {
        checkout.value = "";
    }
});

// CURRENT YEAR
console.log("StayEase Hotel Booking System loaded successfully!");
