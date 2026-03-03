import { supabase } from '../lib/supabase.js';
import { navigate, getState } from '../app.js';
import { renderFooter, fetchSiteSettings } from './footer.js';

// ── State ──────────────────────────────────────────
let bookingState = {
    section: null,        // 'dining' | 'walkin'
    date: null,           // 'YYYY-MM-DD'
    service: null,        // full service object
    partySize: null,      // number
    timeSlot: null,       // 'HH:MM' (dining) or optional (walkin)
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    tcAccepted: false,
};

let step = 0; // 0=date, 1=service, 2=partySize, 3=timeSlot, 4=details, 5=review
let settings = null;
let availableServices = [];
let slotOccupancy = [];
let walkinHeadcount = 0;

// ── Main Render ────────────────────────────────────
export async function renderBooking(container) {
    const appState = getState();
    bookingState.section = appState.section || 'dining';
    step = 0;
    settings = await fetchSiteSettings();

    renderStep(container);
}

function renderStep(container) {
    const sectionLabel = bookingState.section === 'dining' ? 'Dining Table' : 'Walk-in Lounge';
    const totalSteps = bookingState.section === 'dining' ? 6 : 6;
    const progress = ((step + 1) / totalSteps) * 100;

    container.innerHTML = `
        <div class="min-h-screen flex flex-col bg-[#f5f5f3]">
            
            <!-- Header -->
            <header class="sticky top-0 z-40 bg-[#f5f5f3]/90 backdrop-blur-md border-b border-[#e8e8e6]">
                <div class="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
                    <button id="btn-back" class="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                        </svg>
                    </button>
                    <div class="text-center">
                        <p class="text-xs text-[#999] tracking-widest uppercase">${sectionLabel}</p>
                    </div>
                    <div class="w-10"></div>
                </div>
                <!-- Progress bar -->
                <div class="h-[2px] bg-[#e8e8e6]">
                    <div class="h-full bg-[#1a1a1a] transition-all duration-500 ease-out" style="width: ${progress}%"></div>
                </div>
            </header>

            <!-- Content -->
            <main class="flex-1 max-w-lg mx-auto w-full px-6 py-8" id="step-content">
                <!-- Step content injected here -->
            </main>

        </div>
    `;

    const content = document.getElementById('step-content');

    switch (step) {
        case 0: renderDateStep(content); break;
        case 1: renderServiceStep(content); break;
        case 2: renderPartySizeStep(content); break;
        case 3: renderTimeSlotStep(content); break;
        case 4: renderDetailsStep(content); break;
        case 5: renderReviewStep(content); break;
    }

    // Back button
    document.getElementById('btn-back').addEventListener('click', () => {
        if (step === 0) {
            navigate('/');
        } else {
            step--;
            renderStep(container);
        }
    });
}

// ── Step 0: Date ───────────────────────────────────
function renderDateStep(content) {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);

    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDow = (firstDay.getDay() + 6) % 7; // Monday first
        const daysInMonth = lastDay.getDate();
        const monthName = firstDay.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

        const todayStr = formatDate(today);
        const maxStr = formatDate(maxDate);
        const selectedStr = bookingState.date;

        let days = '';
        for (let i = 0; i < startDow; i++) {
            days += `<div></div>`;
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const dt = new Date(currentYear, currentMonth, d);
            const dtStr = formatDate(dt);
            const isPast = dtStr < todayStr;
            const isFuture = dtStr > maxStr;
            const isDisabled = isPast || isFuture;
            const isSelected = dtStr === selectedStr;
            const isToday = dtStr === todayStr;

            let cls = 'w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm transition-all duration-200 ';
            if (isDisabled) {
                cls += 'text-[#ccc] cursor-not-allowed';
            } else if (isSelected) {
                cls += 'bg-[#1a1a1a] text-white font-medium';
            } else if (isToday) {
                cls += 'border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white cursor-pointer';
            } else {
                cls += 'text-[#1a1a1a] hover:bg-[#e8e8e6] cursor-pointer';
            }

            days += `<div><button class="${cls}" ${isDisabled ? 'disabled' : ''} data-date="${dtStr}">${d}</button></div>`;
        }

        const canPrev = currentYear > today.getFullYear() || (currentYear === today.getFullYear() && currentMonth > today.getMonth());
        const canNext = currentYear < maxDate.getFullYear() || (currentYear === maxDate.getFullYear() && currentMonth < maxDate.getMonth());

        return `
            <div class="flex items-center justify-between mb-6">
                <button id="prev-month" class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors ${!canPrev ? 'opacity-30 pointer-events-none' : ''}">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
                </button>
                <h3 class="font-display text-lg">${monthName}</h3>
                <button id="next-month" class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors ${!canNext ? 'opacity-30 pointer-events-none' : ''}">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
                </button>
            </div>
            <div class="grid grid-cols-7 mb-2">
                ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => `<div class="text-center text-xs text-[#999] font-medium py-2">${d}</div>`).join('')}
            </div>
            <div class="grid grid-cols-7 gap-y-1">
                ${days}
            </div>
        `;
    }

    content.innerHTML = `
        <div class="animate-fade-in">
            <h2 class="font-display text-2xl mb-2">Pick a date</h2>
            <p class="text-[#888] text-sm mb-8">Select your preferred date</p>
            <div class="bg-white rounded-2xl p-5 shadow-sm" id="calendar-wrapper">
                ${renderCalendar()}
            </div>
        </div>
    `;

    function bindCalendar() {
        const wrapper = document.getElementById('calendar-wrapper');

        wrapper.querySelectorAll('[data-date]').forEach(btn => {
            btn.addEventListener('click', () => {
                bookingState.date = btn.dataset.date;
                step = 1;
                renderStep(document.getElementById('app'));
            });
        });

        document.getElementById('prev-month')?.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            wrapper.innerHTML = renderCalendar();
            bindCalendar();
        });

        document.getElementById('next-month')?.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            wrapper.innerHTML = renderCalendar();
            bindCalendar();
        });
    }

    bindCalendar();
}

// ── Step 1: Service ────────────────────────────────
async function renderServiceStep(content) {
    content.innerHTML = `
        <div class="animate-fade-in">
            <h2 class="font-display text-2xl mb-2">Choose a service</h2>
            <p class="text-[#888] text-sm mb-8">${formatDateNice(bookingState.date)}</p>
            <div class="flex items-center justify-center py-16">
                <div class="w-6 h-6 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    `;

    // Fetch available services for date
    const { data, error } = await supabase.rpc('get_available_services', { p_date: bookingState.date });

    if (error || !data) {
        content.innerHTML = `
            <div class="animate-fade-in text-center py-16">
                <p class="text-[#999]">Unable to load services. Please try again.</p>
                <button id="retry-services" class="mt-4 text-sm underline">Retry</button>
            </div>
        `;
        document.getElementById('retry-services')?.addEventListener('click', () => renderServiceStep(content));
        return;
    }

    // Filter by section
    const enabledKey = bookingState.section === 'dining' ? 'dining_enabled' : 'walkin_enabled';
    availableServices = data.filter(s => s[enabledKey]);

    if (!availableServices.length) {
        content.innerHTML = `
            <div class="animate-fade-in">
                <h2 class="font-display text-2xl mb-2">Choose a service</h2>
                <p class="text-[#888] text-sm mb-8">${formatDateNice(bookingState.date)}</p>
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-[#e8e8e6] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-7 h-7 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                        </svg>
                    </div>
                    <p class="text-[#888] text-sm">No ${bookingState.section === 'dining' ? 'dining' : 'walk-in'} services available on this date.</p>
                    <button id="btn-change-date" class="mt-4 text-sm font-medium underline underline-offset-4">Pick another date</button>
                </div>
            </div>
        `;
        document.getElementById('btn-change-date')?.addEventListener('click', () => {
            step = 0;
            renderStep(document.getElementById('app'));
        });
        return;
    }

    content.innerHTML = `
        <div class="animate-fade-in">
            <h2 class="font-display text-2xl mb-2">Choose a service</h2>
            <p class="text-[#888] text-sm mb-8">${formatDateNice(bookingState.date)}</p>
            <div class="space-y-3" id="service-list">
                ${availableServices.map(s => `
                    <button data-service-id="${s.service_id}" 
                            class="group w-full bg-white rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-md active:scale-[0.98] border border-transparent hover:border-[#e0e0e0]">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="font-display text-lg">${s.name}</h3>
                                <p class="text-[#888] text-sm mt-1">${formatTime(s.start_time)} – ${formatTime(s.end_time)}</p>
                            </div>
                            <svg class="w-5 h-5 text-[#ccc] group-hover:text-[#1a1a1a] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                            </svg>
                        </div>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    document.querySelectorAll('[data-service-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            bookingState.service = availableServices.find(s => s.service_id === btn.dataset.serviceId);
            step = 2;
            renderStep(document.getElementById('app'));
        });
    });
}

// ── Step 2: Party Size ─────────────────────────────
function renderPartySizeStep(content) {
    const sizes = [1, 2, 3, 4, 5, 6];

    content.innerHTML = `
        <div class="animate-fade-in">
            <h2 class="font-display text-2xl mb-2">How many guests?</h2>
            <p class="text-[#888] text-sm mb-8">${formatDateNice(bookingState.date)} · ${bookingState.service.name}</p>
            
            <div class="grid grid-cols-3 gap-3 mb-6" id="size-grid">
                ${sizes.map(n => `
                    <button data-size="${n}" 
                            class="h-16 bg-white rounded-2xl text-lg font-medium transition-all duration-200 hover:shadow-md active:scale-[0.96] border-2 border-transparent hover:border-[#1a1a1a] flex items-center justify-center">
                        ${n}
                    </button>
                `).join('')}
            </div>

            <!-- 7+ Large Party -->
            <button id="btn-large-party" class="w-full bg-white rounded-2xl p-5 text-left border border-[#e8e8e6] transition-all hover:border-[#ccc]">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-sm">7+ guests</p>
                        <p class="text-[#999] text-xs mt-1">Contact us directly for large parties</p>
                    </div>
                    <svg class="w-5 h-5 text-[#ccc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                    </svg>
                </div>
            </button>
        </div>
    `;

    document.querySelectorAll('[data-size]').forEach(btn => {
        btn.addEventListener('click', () => {
            bookingState.partySize = parseInt(btn.dataset.size);
            step = 3;
            renderStep(document.getElementById('app'));
        });
    });

    document.getElementById('btn-large-party').addEventListener('click', () => {
        openWhatsApp(settings, "Hi, I'd like to book for a large party (7+ guests).");
    });
}

// ── Step 3: Time Slot ──────────────────────────────
async function renderTimeSlotStep(content) {
    const svc = bookingState.service;

    if (bookingState.section === 'walkin') {
        // Walk-in: check capacity then go to details
        content.innerHTML = `
            <div class="animate-fade-in">
                <h2 class="font-display text-2xl mb-2">Checking availability</h2>
                <div class="flex items-center justify-center py-16">
                    <div class="w-6 h-6 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        `;

        const { data } = await supabase.rpc('get_walkin_headcount', {
            p_date: bookingState.date,
            p_service_id: svc.service_id
        });

        walkinHeadcount = data?.[0]?.total_covers || 0;
        const remaining = svc.walkin_capacity - walkinHeadcount;

        if (remaining < bookingState.partySize) {
            content.innerHTML = `
                <div class="animate-fade-in text-center py-12">
                    <div class="w-16 h-16 bg-[#e8e8e6] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-7 h-7 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                        </svg>
                    </div>
                    <h2 class="font-display text-xl mb-2">Fully Booked</h2>
                    <p class="text-[#888] text-sm mb-6">This service doesn't have enough capacity for your party.</p>
                    <button id="btn-try-other" class="bg-[#1a1a1a] text-white rounded-xl px-6 py-3 text-sm font-medium transition-all hover:bg-black active:scale-[0.98]">Try another service</button>
                </div>
            `;
            document.getElementById('btn-try-other')?.addEventListener('click', () => {
                step = 1;
                renderStep(document.getElementById('app'));
            });
            return;
        }

        // Walk-in: optional preferred time
        renderWalkinTimePreference(content, svc);
        return;
    }

    // Dining: fetch slot occupancy
    content.innerHTML = `
        <div class="animate-fade-in">
            <h2 class="font-display text-2xl mb-2">Pick a time</h2>
            <p class="text-[#888] text-sm mb-8">${formatDateNice(bookingState.date)} · ${svc.name} · ${bookingState.partySize} ${bookingState.partySize === 1 ? 'guest' : 'guests'}</p>
            <div class="flex items-center justify-center py-16">
                <div class="w-6 h-6 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    `;

    const { data } = await supabase.rpc('get_dining_slot_occupancy', {
        p_date: bookingState.date,
        p_service_id: svc.service_id
    });

    slotOccupancy = data || [];

    // Generate all slots
    const slots = generateTimeSlots(svc.start_time, svc.end_time, svc.slot_interval_minutes || 30);
    const duration = svc.booking_duration_minutes || 120;
    const slotsNeeded = Math.ceil(duration / (svc.slot_interval_minutes || 30));

    // Calculate availability for each slot
    const slotAvailability = slots.map(slot => {
        // For this slot, booking would occupy: slot, slot+30, slot+60, slot+90 (for 2hr)
        const occupiedSlots = [];
        for (let i = 0; i < slotsNeeded; i++) {
            occupiedSlots.push(addMinutes(slot, i * (svc.slot_interval_minutes || 30)));
        }

        // Slot must be within service window (end_time = last seating, not departure)
        if (slot >= svc.end_time) return { slot, available: false, reason: 'exceeds' };

        // Check capacity for each occupied slot
        for (const os of occupiedSlots) {
            const occ = slotOccupancy.find(o => o.time_slot === os);
            const used = occ ? occ.total_covers : 0;
            if (used + bookingState.partySize > svc.dining_capacity) {
                return { slot, available: false, reason: 'full' };
            }
        }

        return { slot, available: true };
    });

    content.innerHTML = `
        <div class="animate-fade-in">
            <h2 class="font-display text-2xl mb-2">Pick a time</h2>
            <p class="text-[#888] text-sm mb-8">${formatDateNice(bookingState.date)} · ${svc.name} · ${bookingState.partySize} ${bookingState.partySize === 1 ? 'guest' : 'guests'}</p>
            
            ${slotAvailability.every(s => !s.available) ? `
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-[#e8e8e6] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-7 h-7 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <p class="text-[#888] text-sm mb-4">No available slots for ${bookingState.partySize} guests.</p>
                    <button id="btn-try-smaller" class="text-sm font-medium underline underline-offset-4">Try a different party size</button>
                </div>
            ` : `
                <div class="grid grid-cols-3 gap-3" id="slot-grid">
                    ${slotAvailability.map(({ slot, available }) => `
                        <button data-slot="${slot}" 
                                ${!available ? 'disabled' : ''}
                                class="h-14 rounded-xl text-sm font-medium transition-all duration-200
                                    ${available 
                                        ? 'bg-white hover:shadow-md active:scale-[0.96] border-2 border-transparent hover:border-[#1a1a1a]' 
                                        : 'bg-[#f0f0ee] text-[#ccc] cursor-not-allowed'}">
                            ${formatTime(slot)}
                        </button>
                    `).join('')}
                </div>
                <p class="text-xs text-[#aaa] mt-4 text-center">Duration: ${formatDuration(duration)}</p>
            `}
        </div>
    `;

    document.querySelectorAll('[data-slot]').forEach(btn => {
        btn.addEventListener('click', () => {
            bookingState.timeSlot = btn.dataset.slot;
            bookingState.durationMinutes = duration;
            step = 4;
            renderStep(document.getElementById('app'));
        });
    });

    document.getElementById('btn-try-smaller')?.addEventListener('click', () => {
        step = 2;
        renderStep(document.getElementById('app'));
    });
}

function renderWalkinTimePreference(content, svc) {
    console.log('Walk-in service data:', JSON.stringify(svc));
    const interval = svc.slot_interval_minutes || svc.slot_interval || 30;
    const slots = generateTimeSlots(svc.start_time, svc.end_time, interval);
    console.log('Generated slots:', slots);

    content.innerHTML = `
        <div class="animate-fade-in">
            <h2 class="font-display text-2xl mb-2">Preferred arrival time</h2>
            <p class="text-[#888] text-sm mb-8">Optional — helps us prepare for you</p>

            <div class="grid grid-cols-3 gap-3 mb-6" id="walkin-slots">
                ${slots.map(slot => `
                    <button data-slot="${slot}" 
                            class="h-14 bg-white rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-[0.96] border-2 border-transparent hover:border-[#1a1a1a]">
                        ${formatTime(slot)}
                    </button>
                `).join('')}
            </div>

            <button id="btn-skip-time" class="w-full py-4 text-sm text-[#888] hover:text-[#1a1a1a] transition-colors underline underline-offset-4">
                Skip — no preference
            </button>
        </div>
    `;

    document.querySelectorAll('#walkin-slots [data-slot]').forEach(btn => {
        btn.addEventListener('click', () => {
            bookingState.timeSlot = btn.dataset.slot;
            bookingState.durationMinutes = svc.booking_duration_minutes || 120;
            step = 4;
            renderStep(document.getElementById('app'));
        });
    });

    document.getElementById('btn-skip-time').addEventListener('click', () => {
        bookingState.timeSlot = null;
        bookingState.durationMinutes = svc.booking_duration_minutes || 120;
        step = 4;
        renderStep(document.getElementById('app'));
    });
}

// ── Step 4: Personal Details ───────────────────────
function renderDetailsStep(content) {
    content.innerHTML = `
        <div class="animate-fade-in">
            <h2 class="font-display text-2xl mb-2">Your details</h2>
            <p class="text-[#888] text-sm mb-8">We'll use these to confirm your booking</p>

            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs text-[#888] mb-1.5 ml-1">First name</label>
                        <input type="text" id="inp-fname" value="${bookingState.firstName}" placeholder="John"
                               class="w-full bg-white rounded-xl px-4 py-3.5 text-sm border border-[#e8e8e6] focus:border-[#1a1a1a] focus:outline-none transition-colors">
                    </div>
                    <div>
                        <label class="block text-xs text-[#888] mb-1.5 ml-1">Last name</label>
                        <input type="text" id="inp-lname" value="${bookingState.lastName}" placeholder="Doe"
                               class="w-full bg-white rounded-xl px-4 py-3.5 text-sm border border-[#e8e8e6] focus:border-[#1a1a1a] focus:outline-none transition-colors">
                    </div>
                </div>

                <div>
                    <label class="block text-xs text-[#888] mb-1.5 ml-1">Phone number</label>
                    <input type="tel" id="inp-phone" value="${bookingState.phone}" placeholder="+44 7700 900000"
                           class="w-full bg-white rounded-xl px-4 py-3.5 text-sm border border-[#e8e8e6] focus:border-[#1a1a1a] focus:outline-none transition-colors">
                </div>

                <div>
                    <label class="block text-xs text-[#888] mb-1.5 ml-1">Email</label>
                    <input type="email" id="inp-email" value="${bookingState.email}" placeholder="john@example.com"
                           class="w-full bg-white rounded-xl px-4 py-3.5 text-sm border border-[#e8e8e6] focus:border-[#1a1a1a] focus:outline-none transition-colors">
                </div>

                <div>
                    <label class="block text-xs text-[#888] mb-1.5 ml-1">Date of birth</label>
                    <input type="date" id="inp-dob" value="${bookingState.dob}"
                           class="w-full bg-white rounded-xl px-4 py-3.5 text-sm border border-[#e8e8e6] focus:border-[#1a1a1a] focus:outline-none transition-colors">
                </div>

                <!-- T&C -->
                <label class="flex items-start gap-3 cursor-pointer py-2">
                    <input type="checkbox" id="inp-tc" ${bookingState.tcAccepted ? 'checked' : ''}
                           class="w-5 h-5 rounded border-[#ddd] text-[#1a1a1a] mt-0.5 accent-[#1a1a1a]">
                    <span class="text-sm text-[#888] leading-relaxed">
                        I agree to the 
                        <a href="${settings?.terms_conditions_url || '#'}" target="_blank" class="underline text-[#1a1a1a]">Terms & Conditions</a>
                    </span>
                </label>
            </div>

            <!-- Error -->
            <p id="details-error" class="text-red-500 text-xs mt-3 hidden"></p>

            <!-- Continue -->
            <button id="btn-continue" class="w-full bg-[#1a1a1a] text-white rounded-xl py-4 mt-8 text-sm font-medium transition-all hover:bg-black active:scale-[0.98]">
                Review Booking
            </button>
        </div>
    `;

    document.getElementById('btn-continue').addEventListener('click', () => {
        const firstName = document.getElementById('inp-fname').value.trim();
        const lastName = document.getElementById('inp-lname').value.trim();
        const phone = document.getElementById('inp-phone').value.trim();
        const email = document.getElementById('inp-email').value.trim();
        const dob = document.getElementById('inp-dob').value;
        const tc = document.getElementById('inp-tc').checked;

        // Validate
        const errors = [];
        if (!firstName) errors.push('First name is required');
        if (!lastName) errors.push('Last name is required');
        if (!phone) errors.push('Phone number is required');
        if (!email || !email.includes('@')) errors.push('Valid email is required');
        if (!dob) errors.push('Date of birth is required');
        if (!tc) errors.push('Please accept the Terms & Conditions');

        if (errors.length) {
            const errEl = document.getElementById('details-error');
            errEl.textContent = errors[0];
            errEl.classList.remove('hidden');
            return;
        }

        Object.assign(bookingState, { firstName, lastName, phone, email, dob, tcAccepted: tc });
        step = 5;
        renderStep(document.getElementById('app'));
    });
}

// ── Step 5: Review ─────────────────────────────────
function renderReviewStep(content) {
    const svc = bookingState.service;
    const isDining = bookingState.section === 'dining';

    content.innerHTML = `
        <div class="animate-fade-in">
            <h2 class="font-display text-2xl mb-8">Review your booking</h2>

            <div class="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <div class="space-y-4">
                    <div class="flex justify-between">
                        <span class="text-sm text-[#888]">Section</span>
                        <span class="text-sm font-medium">${isDining ? 'Dining Table' : 'Walk-in Lounge'}</span>
                    </div>
                    <div class="h-px bg-[#f0f0ee]"></div>
                    <div class="flex justify-between">
                        <span class="text-sm text-[#888]">Date</span>
                        <span class="text-sm font-medium">${formatDateNice(bookingState.date)}</span>
                    </div>
                    <div class="h-px bg-[#f0f0ee]"></div>
                    <div class="flex justify-between">
                        <span class="text-sm text-[#888]">Service</span>
                        <span class="text-sm font-medium">${svc.name}</span>
                    </div>
                    <div class="h-px bg-[#f0f0ee]"></div>
                    <div class="flex justify-between">
                        <span class="text-sm text-[#888]">Guests</span>
                        <span class="text-sm font-medium">${bookingState.partySize}</span>
                    </div>
                    ${bookingState.timeSlot ? `
                    <div class="h-px bg-[#f0f0ee]"></div>
                    <div class="flex justify-between">
                        <span class="text-sm text-[#888]">${isDining ? 'Time' : 'Preferred arrival'}</span>
                        <span class="text-sm font-medium">${formatTime(bookingState.timeSlot)}</span>
                    </div>
                    ` : ''}
                    ${isDining ? `
                    <div class="h-px bg-[#f0f0ee]"></div>
                    <div class="flex justify-between">
                        <span class="text-sm text-[#888]">Duration</span>
                        <span class="text-sm font-medium">${formatDuration(bookingState.durationMinutes)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-sm mb-8">
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-sm text-[#888]">Name</span>
                        <span class="text-sm font-medium">${bookingState.firstName} ${bookingState.lastName}</span>
                    </div>
                    <div class="h-px bg-[#f0f0ee]"></div>
                    <div class="flex justify-between">
                        <span class="text-sm text-[#888]">Phone</span>
                        <span class="text-sm font-medium">${bookingState.phone}</span>
                    </div>
                    <div class="h-px bg-[#f0f0ee]"></div>
                    <div class="flex justify-between">
                        <span class="text-sm text-[#888]">Email</span>
                        <span class="text-sm font-medium">${bookingState.email}</span>
                    </div>
                </div>
            </div>

            <!-- Error -->
            <p id="submit-error" class="text-red-500 text-xs mb-3 hidden"></p>

            <button id="btn-confirm" class="w-full bg-[#1a1a1a] text-white rounded-xl py-4 text-sm font-medium transition-all hover:bg-black active:scale-[0.98]">
                Confirm Booking
            </button>

            <p class="text-center text-xs text-[#aaa] mt-4">By confirming, you agree to our Terms & Conditions</p>
        </div>
    `;

    document.getElementById('btn-confirm').addEventListener('click', () => submitBooking(content));
}

async function submitBooking(content) {
    const btn = document.getElementById('btn-confirm');
    btn.disabled = true;
    btn.innerHTML = `
        <div class="flex items-center justify-center gap-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Confirming...
        </div>
    `;

    const payload = {
        service_id: bookingState.service.service_id,
        section: bookingState.section,
        booking_date: bookingState.date,
        time_slot: bookingState.timeSlot || null,
        party_size: bookingState.partySize,
        duration_minutes: bookingState.durationMinutes,
        first_name: bookingState.firstName,
        last_name: bookingState.lastName,
        phone_encrypted: bookingState.phone,
        email_encrypted: bookingState.email,
        dob_encrypted: bookingState.dob,
        tc_accepted: true,
        source: 'user',
        status: 'confirmed',
    };

    try {
        const resp = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.error || 'Booking failed');
        }

        const data = await resp.json();

        // Navigate to confirmation
        navigate('/confirmation', {
            booking: data,
            service: bookingState.service,
            section: bookingState.section,
        });

    } catch (err) {
        const errEl = document.getElementById('submit-error');
        errEl.textContent = err.message || 'Something went wrong. Please try again.';
        errEl.classList.remove('hidden');
        btn.disabled = false;
        btn.textContent = 'Confirm Booking';
        console.error('Booking error:', err);
    }
}

// ── Helpers ────────────────────────────────────────
function formatDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateNice(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatDuration(min) {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
}

function generateTimeSlots(startTime, endTime, intervalMin) {
    const slots = [];
    let [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const endMins = eh * 60 + em;

    while (sh * 60 + sm < endMins) {
        slots.push(`${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`);
        sm += intervalMin;
        if (sm >= 60) { sh += Math.floor(sm / 60); sm = sm % 60; }
    }
    return slots;
}

function addMinutes(timeStr, mins) {
    let [h, m] = timeStr.split(':').map(Number);
    m += mins;
    h += Math.floor(m / 60);
    m = m % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function openWhatsApp(settings, message) {
    const waNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '');
    if (waNumber) {
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
}
