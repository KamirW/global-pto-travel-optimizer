import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function NewPTOPlanPage() {
    // Hooks
    const { user } = useAuth()
    const navigate = useNavigate()

    // State
    const [country, setCountry] = useState('US')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [ptoDays, setPtoDays] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    // Handlers
    const handleSubmit = async () => {
        setErrorMsg("")

        if(!startDate || !endDate || !ptoDays) {
            setErrorMsg("Please fill out all fields")
            return
        }
        // Populate supabase with the data acquired from the user
        const {error} =await supabase.from('ptoplans').insert({
            user_id: user.id,
            country_code: country,
            start_date: startDate,
            end_date: endDate,
            pto_days_available: ptoDays
        })

        if(error) {
            setErrorMsg(error.message || "Failed to create PTO plan. Please try again.")
            return
        }

        navigate('/ptoplans')
    }

    return (
        <div className='max-w-md mx-auto mt-10 space-y-6'>
            <h1 className='text-2xl font-bold'>Create New PTO Plan</h1>

            {errorMsg && (
                <p className='text-red-600 bg-red-100 p-2 rounded'>{errorMsg}</p>
            )}

            {/* Country */}
            <div className="space-y-1">
                <label className='font-medium'>Country</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className='w-full border p-2 rounded'>
                    <option value='US'>United States</option>
                    <option value='MX'>Mexico</option>
                    <option value='TR'>Turkey</option>
                </select>
            </div>
            
            {/* Start Date */}
            <div className='space-y-1'>
                <label className='font-medium'>Start Date</label>
                <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} className='w-full border p-2 rounded' />
            </div>

            {/* End Date */}
            <div className='space-y-1'>
                <label className='font-medium'>End Date</label>
                <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} className='w-full border p-2 rounded'/>
            </div>

            {/* PTO Days */}
            <div className='space-y-1'>
                <label className='font-medium'>Pto Days Available </label>
                <input type='number' placeholder='PTO days available ' value={ptoDays} onChange={(e) => setPtoDays(e.target.value)}  className='w-full border p-2 rounded'/>
            </div>

            {/* Save Button */}
            <button onClick={handleSubmit} className='w-full bg-green-600 text-white p-2 rounded hover:bg-green-700'>Save Plan</button>
            <button onClick={() => navigate('/ptoplans')} className='w-full bg-gray-300 p-2 rounded hover:bg-gray-400'>Cancel</button>
       
        </div>
    )
}