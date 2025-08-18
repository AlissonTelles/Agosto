document.addEventListener('DOMContentLoaded', () => {
    const eventTitle = document.getElementById('event-title');
    const eventDescription = document.getElementById('event-description');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const selectedTimeDisplay = document.getElementById('selected-time-display');
    const seatsGrid = document.getElementById('seats-grid');
    const selectedSeatsDisplay = document.getElementById('selected-seats-display');
    const totalPriceDisplay = document.getElementById('total-price-display');

    const clearSelectionBtn = document.getElementById('clear-selection-btn');
    const reserveBtn = document.getElementById('reserve-btn');

    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');
    const closeXBtn = document.getElementById('close-x-btn');


    const seatPrice = 15.00;


    let eventsData =  {
        currentEventId: 'jazz_night',
        details: {
            'jazz_night': {
                name: 'Noite de Jazz no Centro Cultural',
                description: 'Uma experiência musical relaxante com os melhores artistas locais. Vagas limitadas!',
                slots: {}
            }
        }
    };
    const totalRows = 5;
    const totalSeatsPerRow = 8;


    function createInitialSeats() {
        const seats = [];
        for (let r = 0; r < totalRows; r++) {
            for (let c = 0; c < totalSeatsPerRow; c++) {
                const seatId = String.fromCharCode(65 + r) + (c + 1);
                seats.push({id: seatId, status: 'available'});
            }
        }
        return seats;
    }


    if (!localStorage.getItem('eventBookingData')) {
        eventsData.details.jazz_night.slots = {
            'slot_1900': { time: '19:00 - 20:30', seats: createInitialSeats() },
            'slot_2100': { time: '21:00 - 22:30', seats: createInitialSeats() }
        };
    } else {
        loadData();
    }


    let currentSelectedTimeSlotId = null;
    let selectedSeats = [];


    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }


    function hideMessage() {
        messageBox.style.display = 'none';
    }


    function saveData() {
        localStorage.setItem('eventBookingData', JSON.stringify(eventsData));
    }


    function loadData() {
        const savedData = localStorage.getItem('eventBookingData');
        if (savedData) {
            eventsData = JSON.parse(savedData);
        }
    }


    function renderEventInfo() {
        const event = eventsData.details[eventsData.currentEventId];
        eventTitle.textContent = event.name;
        eventDescription.textContent = event.description;
    }


    function renderTimeSlots() {
        timeSlotsContainer.innerHTML = '';
        const event = eventsData.details[eventsData.currentEventId];


        const sortedSlotKeys = Object.keys(event.slots).sort((a, b) => {
            const timeA = event.slots[a].time.split(' ')[0];
            const timeB = event.slots[b].time.split(' ')[0];
            return timeA.localeCompare(timeB);
        });


        sortedSlotKeys.forEach(slotId => {
            const slot = event.slots[slotId];
            const button = document.createElement('button');
            button.classList.add('time-slot-button');
            button.textContent = slot.time;
            button.dataset.slotId = slotId;


            button.addEventListener('click', () => handleTimesSlotSelection(slotId));
            timeSlotsContainer.appendChild(button);
        });
        if (!currentSelectedTimeSlotId) {
            currentSelectedTimeSlotId = sortedSlotKeys[0];
        }
        updateTimeSlotActiveState(currentSelectedTimeSlotId);
    }


    function updateTimeSlotActiveState(activeSlotId) {
        document.querySelectorAll('.time-slot-button').forEach(button => {
            button.classList.remove('active');
            if (button.dataset.slotId === activeSlotId) {
                button.classList.add('active');
            }
        });
        selectedTimeDisplay.textContent = eventsData.details[eventsData.currentEventId].slots[activeSlotId].time;
    }


    function renderSeats() {
        seatsGrid.innerHTML = '';
        const currentSlot = eventsData.details[eventsData.currentEventId].slots[currentSelectedTimeSlotId];


        seatsGrid.style.gridTemplateColumns = `repeat(${totalSeatsPerRow}, 1fr)`;


        currentSlot.seats.forEach(seat => {
            const seatDiv = document.createElement('div');
            seatDiv.classList.add('seat', seat.status);
            seatDiv.textContent = seat.id;
            seatDiv.dataset.seatId = seat.id;


            if (seat.status === 'available' || seat.status === 'selected') {
                seatDiv.addEventListener('click', () => handleSeatSelection(seat.id));
            }
            seatsGrid.appendChild(seatDiv);
        });


        updateBookingSummary();
        updateReserveButtonState();
    }


    function updateBookingSummary() {
        if (selectedSeats.length === 0) {
            selectedSeatsDisplay.textContent = 'Nenhuma';
        } else {
            selectedSeatsDisplay.textContent = selectedSeats.join(', ');
        }
        totalPriceDisplay.textContent = `R$ ${(selectedSeats.length * seatPrice).toFixed(2)}`;
    }


    function handleTimesSlotSelection(slotId) {
        if (currentSelectedTimeSlotId === slotId) return;


        if (selectedSeats.length > 0 && currentSelectedTimeSlotId) {
            const previousSlot = eventsData.details[eventsData.currentEventId].slots[currentSelectedTimeSlotId];


            selectedSeats.forEach(seatId => {
                const seat = previousSlot.seats.find(s => s.id === seatId);
                if (seat && seat.status === 'selected') {
                    seat.status = 'available';
                }
            });
            selectedSeats = [];
        }
        currentSelectedTimeSlotId = slotId;
        updateTimeSlotActiveState(slotId);
        renderSeats();
    }


    function handleSeatSelection(seatId) {
        const currentSlot = eventsData.details[eventsData.currentEventId].slots[currentSelectedTimeSlotId];
        const seat = currentSlot.seats.find(s => s.id === seatId);


        if (!seat) return;


        if (seat.status === 'available') {
            seat.status = 'selected';
            selectedSeats.push(seatId);
        } else if (seat.status === 'selected') {
            seat.status = 'available';
            selectedSeats = selectedSeats.filter(id => id !== seatId);
        }


        renderSeats();
        saveData();
    }


    function updateReserveButtonState() {
        reserveBtn.disabled = selectedSeats.length === 0;
    }


    function clearSelection() {
        if (selectedSeats.length === 0) return;


        const currentSlot = eventsData.details[eventsData.currentEventId].slots[currentSelectedTimeSlotId];


        selectedSeats.forEach(seatId => {
            const seat = currentSlot.seats.find(s => s.id === seatId);
            if (seat && seat.status === 'selected') {
                seat.status = 'available';
            }
        });


        selectedSeats = [];
        renderSeats();
        saveData();
    }


    function reserveSeats() {
        if (selectedSeats.length === 0) return;


        const currentSlot = eventsData.details[eventsData.currentEventId].slots[currentSelectedTimeSlotId];
        selectedSeats.forEach(seatId => {
            const seat = currentSlot.seats.find(s => s.id === seatId);
            if (seat && seat.status === 'selected') {
                seat.status = 'reserved';
            }
        });


        selectedSeats = [];
        renderSeats();
        saveData();
        showMessage('Reserva concluída com sucesso!');
    }


    // Eventos dos botões

    clearSelectionBtn.addEventListener('click', clearSelection);
    reserveBtn.addEventListener('click', reserveSeats);
    closeMessageBtn.addEventListener('click', hideMessage);
    if (closeXBtn) closeXBtn.addEventListener('click', hideMessage);


    // Inicialização
    renderEventInfo();
    renderTimeSlots();
    renderSeats();
});
