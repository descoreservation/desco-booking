import { navigate } from '../app.js';
import { renderFooter, fetchSiteSettings } from './footer.js';

export async function renderTerms(container) {
    const settings = await fetchSiteSettings();

    container.innerHTML = `
        <div class="min-h-screen flex flex-col bg-[#0E0E0E]">
            
            <!-- Header -->
            <header class="sticky top-0 z-40 bg-[#0E0E0E]/90 backdrop-blur-md border-b border-[#222]">
                <div class="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button id="btn-back" class="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
                        <svg class="w-5 h-5 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                        </svg>
                    </button>
                    <div class="text-center">
                        <p class="text-xs text-[#666] tracking-widest uppercase">Legal</p>
                    </div>
                    <div class="w-10"></div>
                </div>
            </header>

            <main class="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
                <div class="animate-fade-in">
                    <h1 class="font-display text-3xl text-[#f5f5f5] mb-2">Termini, Condizioni e Informativa Privacy</h1>
                    <p class="text-[#666] text-sm mb-10">DESCO MILANO SRL</p>

                    <div class="space-y-10 text-[#bbb] text-sm leading-relaxed" id="terms-content">

                        <p class="text-[#777]">Il presente modulo di accredito è gestito da: <strong class="text-[#f5f5f5]">DESCO MILANO SRL</strong>, Via Broletto 16, 20121 Milano (MI), P.IVA / C.F. 13631890962, Codice Univoco: M5UXCR1.</p>

                        <p class="text-[#777]">L'invio del form comporta accettazione integrale dei presenti Termini e presa visione dell'Informativa Privacy ai sensi del Regolamento UE 2016/679 (GDPR).</p>

                        <!-- Section 1 -->
                        <section>
                            <h2 class="font-display text-lg text-[#f5f5f5] mb-3">1. Natura dell'Accredito</h2>
                            <p>La compilazione del form costituisce esclusivamente una richiesta di accredito e non garantisce in alcun modo il diritto di accesso all'evento.</p>
                            <p class="mt-3">L'accredito non costituisce titolo di ingresso, non comporta pagamento online, ed è soggetto a conferma, disponibilità e valutazione discrezionale della direzione.</p>
                            <p class="mt-3">DESCO MILANO SRL si riserva il diritto insindacabile di ammissione.</p>
                        </section>

                        <!-- Section 2 -->
                        <section>
                            <h2 class="font-display text-lg text-[#f5f5f5] mb-3">2. Accesso, Sicurezza e Comportamento</h2>
                            <p>L'accesso è subordinato al rispetto della capienza autorizzata, delle normative di pubblica sicurezza e del regolamento interno del locale.</p>
                            <p class="mt-3">La direzione può rifiutare l'ingresso o disporre l'allontanamento in caso di comportamento ritenuto inidoneo, molesto o non conforme, anche in presenza di accredito confermato.</p>
                        </section>

                        <!-- Section 3 -->
                        <section>
                            <h2 class="font-display text-lg text-[#f5f5f5] mb-3">3. Modifiche, Annullamenti e Forza Maggiore</h2>
                            <p>DESCO MILANO SRL si riserva il diritto di modificare o annullare eventi, orari, programmazione artistica o modalità organizzative per esigenze tecniche, di sicurezza o cause di forza maggiore, senza che ciò generi diritti risarcitori.</p>
                        </section>

                        <!-- Section 4 -->
                        <section>
                            <h2 class="font-display text-lg text-[#f5f5f5] mb-3">4. Limitazione di Responsabilità</h2>
                            <p>DESCO MILANO SRL non è responsabile per errori o omissioni nella compilazione del form, mancata ricezione di comunicazioni per dati errati, mancato accesso per superamento capienza, eventi o disservizi non imputabili direttamente alla società.</p>
                        </section>

                        <!-- Section 5 -->
                        <section>
                            <h2 class="font-display text-lg text-[#f5f5f5] mb-3">5. Riprese Foto e Video</h2>
                            <p>Durante gli eventi possono essere effettuate riprese fotografiche e video per finalità promozionali, comunicative e commerciali.</p>
                            <p class="mt-3">Con l'accesso al locale, l'interessato autorizza l'utilizzo della propria immagine, anche ai sensi degli artt. 96 e 97 L. 633/1941, per pubblicazione su siti web, social network, materiale promozionale e comunicazione online e offline, senza limiti territoriali e senza corrispettivo economico.</p>
                            <p class="mt-3">Resta salva la possibilità di esercitare i diritti previsti dalla normativa vigente mediante richiesta scritta.</p>
                        </section>

                        <!-- Section 6 -->
                        <section>
                            <h2 class="font-display text-lg text-[#f5f5f5] mb-3">6. Titolare del Trattamento</h2>
                            <p>Titolare del trattamento è: <strong class="text-[#f5f5f5]">DESCO MILANO SRL</strong>, Via Broletto 16, 20121 Milano (MI), P.IVA 13631890962.</p>
                        </section>

                        <!-- Section 7 -->
                        <section>
                            <h2 class="font-display text-lg text-[#f5f5f5] mb-3">7. Dati Raccolti</h2>
                            <p>Possono essere raccolti dati quali: nome e cognome, numero di telefono, indirizzo email, data di nascita, profilo social (se richiesto).</p>
                        </section>

                        <!-- Section 8 -->
                        <section>
                            <h2 class="font-display text-lg text-[#f5f5f5] mb-3">8. Finalità e Base Giuridica</h2>
                            <p>I dati sono trattati per gestione della richiesta di accredito, organizzazione e sicurezza dell'evento, adempimenti amministrativi e di legge, invio di comunicazioni su eventi futuri (solo previo consenso).</p>
                            <p class="mt-3">La base giuridica è il consenso dell'interessato e il legittimo interesse organizzativo e di sicurezza del Titolare.</p>
                        </section>

                        <!-- Section 9 -->
                        <section>
                            <h2 class="font-display text-lg text-[#f5f5f5] mb-3">9. Modalità, Sicurezza e Conservazione</h2>
                            <p>Il trattamento avviene con strumenti elettronici e misure tecniche adeguate a garantire sicurezza, integrità e riservatezza.</p>
                            <p class="mt-3">I dati non sono venduti a terzi. Saranno conservati per il tempo strettamente necessario alle finalità sopra indicate e, per finalità marketing, fino a revoca del consenso.</p>
                        </section>

                        <!-- Section 10 -->
                        <section>
                            <h2 class="font-display text-lg text-[#f5f5f5] mb-3">10. Comunicazione a Terzi</h2>
                            <p>I dati potranno essere comunicati esclusivamente a collaboratori e staff organizzativo, fornitori di servizi tecnologici, autorità competenti nei casi previsti dalla legge.</p>
                        </section>

                        <!-- Section 11 -->
                        <section>
                            <h2 class="font-display text-lg text-[#f5f5f5] mb-3">11. Diritti dell'Interessato</h2>
                            <p>L'interessato può esercitare in qualsiasi momento i diritti previsti dagli artt. 15-22 GDPR (accesso, rettifica, cancellazione, limitazione, opposizione, revoca del consenso) scrivendo a: <a href="mailto:${settings?.contact_email || ''}" class="text-[#f5f5f5] underline underline-offset-4">${settings?.contact_email || '[email]'}</a>.</p>
                        </section>

                        <!-- Section 12 -->
                        <section>
                            <h2 class="font-display text-lg text-[#f5f5f5] mb-3">12. Accettazione</h2>
                            <p>L'invio del form comporta accettazione dei presenti Termini e Condizioni e presa visione dell'Informativa Privacy.</p>
                        </section>

                    </div>
                </div>
            </main>

            <div id="terms-footer"></div>
        </div>
    `;

    renderFooter(document.getElementById('terms-footer'), settings);

    document.getElementById('btn-back').addEventListener('click', () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            navigate('/');
        }
    });
}
