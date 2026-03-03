import { getSupabase } from './_lib/supabase.js';
import { encryptBookingPII, decryptBookingPII } from './_lib/crypto.js';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = req.body;

        // Basic validation
        if (!body.service_id) return res.status(400).json({ error: 'service_id is required' });
        if (!body.section) return res.status(400).json({ error: 'section is required' });
        if (!body.booking_date) return res.status(400).json({ error: 'booking_date is required' });
        if (!body.party_size) return res.status(400).json({ error: 'party_size is required' });
        if (!body.first_name) return res.status(400).json({ error: 'first_name is required' });
        if (!body.last_name) return res.status(400).json({ error: 'last_name is required' });
        if (!body.phone_encrypted) return res.status(400).json({ error: 'phone is required' });
        if (!body.email_encrypted) return res.status(400).json({ error: 'email is required' });
        if (!body.tc_accepted) return res.status(400).json({ error: 'T&C must be accepted' });
        if (body.section === 'dining' && !body.time_slot) return res.status(400).json({ error: 'time_slot is required for dining' });

        // Build payload
        const payload = {
            service_id: body.service_id,
            section: body.section,
            booking_date: body.booking_date,
            time_slot: body.time_slot || null,
            party_size: body.party_size,
            duration_minutes: body.duration_minutes,
            first_name: body.first_name,
            last_name: body.last_name,
            phone_encrypted: body.phone_encrypted,
            email_encrypted: body.email_encrypted,
            dob_encrypted: body.dob_encrypted || null,
            tc_accepted: body.tc_accepted,
            source: 'user',
            status: 'confirmed',
        };

        // Encrypt PII
        const encrypted = encryptBookingPII(payload);

        // Insert via anon key (RLS allows public insert on bookings)
        const supabase = getSupabase();
        const { error } = await supabase
            .from('bookings')
            .insert([encrypted]);

        if (error) {
            console.error('Supabase insert error:', error);
            return res.status(500).json({ error: 'Failed to create booking' });
        }

        // Return the original data for confirmation (we can't read back with anon key)
        return res.status(201).json({
            ...payload,
            booking_date: body.booking_date,
            time_slot: body.time_slot || null,
        });

    } catch (err) {
        console.error('Booking API error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
