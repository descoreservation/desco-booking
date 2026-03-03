import { navigate, getState } from '../app.js';
import { renderFooter, fetchSiteSettings } from './footer.js';

export async function renderConfirmation(container) {
    const { booking, service, section } = getState();
    const settings = await fetchSiteSettings();

    if (!booking) {
        navigate('/');
        return;
    }

    const isDining = section === 'dining';
    const waNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '');
    const waMessage = settings?.whatsapp_message || "Hi, I have a booking (ref: " + (booking.id ? booking.id.slice(0, 8) : '') + ").";

    container.innerHTML = `
        <div class="min-h-screen flex flex-col bg-[#0E0E0E]">
            <main class="flex-1 max-w-lg mx-auto w-full px-6 py-12">
                
                <!-- Success Icon -->
                <div class="flex justify-center mb-8 animate-fade-in">
                    <div class="w-20 h-20 bg-[#f5f5f5] rounded-full flex items-center justify-center">
                        <svg class="w-9 h-9 text-[#0E0E0E] animate-check" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                        </svg>
                    </div>
                </div>

                <div class="text-center mb-10 animate-fade-in-delay-1">
                    <h1 class="font-display text-3xl mb-2 text-[#f5f5f5]">Booking Confirmed</h1>
                    <p class="text-[#777] text-sm">We look forward to seeing you</p>
                </div>

                <!-- Summary Card -->
                <div class="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] mb-6 animate-fade-in-delay-2">
                    <div class="space-y-4">
                        <div class="flex justify-between">
                            <span class="text-sm text-[#777]">Section</span>
                            <span class="text-sm font-medium text-[#f5f5f5]">${isDining ? 'Dining Table' : 'Drink Lounge'}</span>
                        </div>
                        <div class="h-px bg-[#2a2a2a]"></div>
                        <div class="flex justify-between">
                            <span class="text-sm text-[#777]">Date</span>
                            <span class="text-sm font-medium text-[#f5f5f5]">${formatDateNice(booking.booking_date)}</span>
                        </div>
                        <div class="h-px bg-[#2a2a2a]"></div>
                        <div class="flex justify-between">
                            <span class="text-sm text-[#777]">Service</span>
                            <span class="text-sm font-medium text-[#f5f5f5]">${service?.name || ''}</span>
                        </div>
                        <div class="h-px bg-[#2a2a2a]"></div>
                        <div class="flex justify-between">
                            <span class="text-sm text-[#777]">Guests</span>
                            <span class="text-sm font-medium text-[#f5f5f5]">${booking.party_size}</span>
                        </div>
                        ${booking.time_slot ? `
                        <div class="h-px bg-[#2a2a2a]"></div>
                        <div class="flex justify-between">
                            <span class="text-sm text-[#777]">${isDining ? 'Time' : 'Preferred arrival'}</span>
                            <span class="text-sm font-medium text-[#f5f5f5]">${formatTime(booking.time_slot)}</span>
                        </div>
                        ` : ''}
                        <div class="h-px bg-[#2a2a2a]"></div>
                        <div class="flex justify-between">
                            <span class="text-sm text-[#777]">Name</span>
                            <span class="text-sm font-medium text-[#f5f5f5]">${booking.first_name} ${booking.last_name}</span>
                        </div>
                    </div>
                </div>

                ${isDining ? `
                <div class="mb-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 flex items-start gap-3 animate-fade-in-delay-2">
                    <svg class="w-4 h-4 text-[#f5c542] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <p class="text-xs text-[#999] leading-relaxed">Please arrive within <span class="text-[#f5f5f5] font-medium">15 minutes</span> of your reserved time. Late arrivals may result in a shorter dining experience or table reassignment.</p>
                </div>
                ` : ''}

                <!-- Actions -->
                <div class="space-y-3 animate-fade-in-delay-2">
                    ${waNumber ? `
                    <a href="https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}" target="_blank"
                       class="flex items-center justify-center gap-2 w-full bg-[#f5f5f5] text-[#0E0E0E] rounded-xl py-4 text-sm font-medium transition-all hover:bg-white active:scale-[0.98]">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                        Manage via WhatsApp
                    </a>
                    ` : ''}

                    <button id="btn-new-booking" class="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#999] rounded-xl py-4 text-sm font-medium transition-all hover:border-[#444] hover:text-[#ccc] active:scale-[0.98]">
                        Make Another Booking
                    </button>
                </div>

            </main>

            <div id="conf-footer"></div>
        </div>
    `;

    renderFooter(document.getElementById('conf-footer'), settings);

    document.getElementById('btn-new-booking')?.addEventListener('click', () => {
        navigate('/');
    });
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
    return h12 + ':' + String(m).padStart(2, '0') + ' ' + ampm;
}
