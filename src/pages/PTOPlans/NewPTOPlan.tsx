import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function NewPTOPlanPage() {
    // Hooks
    const { user } = useAuth()
    const navigate = useNavigate()

    // State
    const [country, setCountry] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [ptoDays, setPtoDays] = useState('')

    // Handlers
    const handleSubmit = async () => {
        // Populate supabase with the data acquired from the user
        await supabase.from('ptoplans').insert({
            user_id: user.id,
            country_code: country,
            start_date: startDate,
            end_date: endDate,
            pto_days_available: ptoDays
        })

        navigate('/ptoplans')
    }

    return (
        <div>
            <h1>Create New PTO Plan</h1>

            <select value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value='US'>United States</option>
                <option value='MX'>Mexico</option>
                <option value='TR'>Turkey</option>
            </select>

            <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <input type='number' placeholder='PTO days available ' value={ptoDays} onChange={(e) => setPtoDays(e.target.value)} />
            
            <button onClick={handleSubmit}>Save Plan</button>
       
        </div>
    )
}