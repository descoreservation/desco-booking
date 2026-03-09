import { supabase } from '../lib/supabase.js';
import { navigate } from '../app.js';
import { renderFooter, fetchSiteSettings } from './footer.js';

export async function renderHome(container) {
    const settings = await fetchSiteSettings();

    container.innerHTML = `
        <div class="min-h-screen flex flex-col bg-[#0E0E0E]">
            
            <!-- Hero -->
            <div class="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-10">
                
                <!-- Logo -->
                <div class="mb-10 animate-fade-in">
                    <img src="/public/logo.png" alt="DESCO" class="h-24 w-auto" onerror="this.onerror=null; this.innerHTML=''; this.parentElement.innerHTML='<h1 class=\\'font-display text-5xl tracking-tight text-[#f5f5f5]\\'>DESCO</h1>';">
                </div>

                <!-- Tagline -->
                <p class="text-[#666] text-sm tracking-[0.2em] uppercase mb-14 animate-fade-in-delay-1">
                    Restaurant &amp; Lounge
                </p>

                <!-- Booking Options -->
                <div class="w-full max-w-sm space-y-4 animate-fade-in-delay-2">
                    
                    <!-- Drink Lounge (primary, slightly bigger) -->
                    <button id="btn-walkin" class="group w-full bg-[#f5f5f5] text-[#0E0E0E] rounded-2xl px-6 py-7 text-left transition-all duration-300 hover:bg-white hover:scale-[1.02] active:scale-[0.98]">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <svg class="w-6 h-6 text-[#999] group-hover:text-[#0E0E0E] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M8 22h8"/>
                                    <path d="M12 11v11"/>
                                    <path d="M19.5 2L12 11 4.5 2h15z"/>
                                </svg>
                                <div>
                                    <h2 class="font-display text-2xl mb-1">Drink Lounge</h2>
                                    <p class="text-[#666] text-sm">Secure your spot</p>
                                </div>
                            </div>
                            <svg class="w-5 h-5 text-[#999] group-hover:text-[#0E0E0E] group-hover:translate-x-1 transition-all duration-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                            </svg>
                        </div>
                    </button>

                    <!-- Dining Table -->
                    <button id="btn-dining" class="group w-full bg-[#f5f5f5] text-[#0E0E0E] rounded-2xl px-6 py-5 text-left transition-all duration-300 hover:bg-white hover:scale-[1.02] active:scale-[0.98]">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <svg class="w-6 h-6 text-[#999] group-hover:text-[#0E0E0E] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="8"/>
                                    <path d="M3 12h1m16 0h1"/>
                                    <path d="M5 2v6a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2"/>
                                    <path d="M7 2v4"/>
                                    <path d="M15 2v8.5a2.5 2.5 0 0 0 5 0V6a1 1 0 0 0-1-1h-1"/>
                                </svg>
                                <div>
                                    <h2 class="font-display text-xl mb-1">Dining Table</h2>
                                    <p class="text-[#666] text-sm">Reserve your table</p>
                                </div>
                            </div>
                            <svg class="w-5 h-5 text-[#999] group-hover:text-[#0E0E0E] group-hover:translate-x-1 transition-all duration-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                            </svg>
                        </div>
                    </button>

                    <!-- Divider -->
                    <div class="flex items-center gap-4 py-2">
                        <div class="flex-1 h-px bg-[#2a2a2a]"></div>
                        <span class="text-xs text-[#555] tracking-widest uppercase">or</span>
                        <div class="flex-1 h-px bg-[#2a2a2a]"></div>
                    </div>

                    <!-- Manage Booking -->
                    <button id="btn-manage" class="group w-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#999] rounded-2xl p-6 text-left transition-all duration-300 hover:border-[#444] hover:text-[#ccc] hover:scale-[1.02] active:scale-[0.98]">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="font-display text-lg mb-1">Manage Booking</h2>
                                <p class="text-[#666] text-sm">Contact us via WhatsApp or call</p>
                            </div>
                            <svg class="w-5 h-5 text-[#555] group-hover:text-[#999] transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                            </svg>
                        </div>
                    </button>

                </div>
            </div>

            <!-- Footer -->
            <div id="home-footer"></div>
        </div>
    `;

    // Render footer
    renderFooter(document.getElementById('home-footer'), settings);

    // Event listeners
    document.getElementById('btn-dining').addEventListener('click', () => {
        navigate('/book', { section: 'dining' });
    });

    document.getElementById('btn-walkin').addEventListener('click', () => {
        navigate('/book', { section: 'walkin' });
    });

    document.getElementById('btn-manage').addEventListener('click', () => {
        openManageContact(settings);
    });
}

function openManageContact(settings) {
    const phone = settings?.contact_phone;
    const waNumber = settings?.whatsapp_number;
    const waMessage = settings?.whatsapp_message || "Hi, I'd like to manage my booking.";

    const sheet = document.createElement('div');
    sheet.id = 'manage-sheet';
    sheet.innerHTML = `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" id="sheet-overlay">
            <div class="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl p-6 pb-10 max-w-lg mx-auto animate-slide-up">
                <div class="w-10 h-1 bg-[#333] rounded-full mx-auto mb-6"></div>
                <h3 class="font-display text-xl text-center mb-2 text-[#f5f5f5]">Manage Your Booking</h3>
                <p class="text-[#777] text-sm text-center mb-8">Get in touch with us to modify or cancel</p>
                
                <div class="space-y-3">
                    ${waNumber ? `
                    <a href="https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}" target="_blank"
                       class="flex items-center gap-4 w-full bg-[#f5f5f5] text-[#0E0E0E] rounded-xl p-4 transition-all hover:bg-white active:scale-[0.98]">
                        <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.913.913l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.804-6.313-2.155a.75.75 0 00-.624-.14l-3.06 1.026 1.026-3.06a.75.75 0 00-.14-.624A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                        <span class="text-sm font-medium">WhatsApp</span>
                    </a>
                    ` : ''}
                    
                    ${phone ? `
                    <a href="tel:${phone}" 
                       class="flex items-center gap-4 w-full bg-[#2a2a2a] border border-[#333] text-[#ccc] rounded-xl p-4 transition-all hover:border-[#555] active:scale-[0.98]">
                        <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                        </svg>
                        <span class="text-sm font-medium">Call Us</span>
                    </a>
                    ` : ''}

                    ${!waNumber && !phone ? `
                    <p class="text-center text-[#666] text-sm py-4">Contact details not available at the moment.</p>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(sheet);

    document.getElementById('sheet-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            sheet.remove();
        }
    });
}
