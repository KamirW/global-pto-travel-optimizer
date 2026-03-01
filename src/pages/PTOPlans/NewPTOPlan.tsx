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
        <div className='w-full max-w-md mx-auto space-y-4 sm:space-y-6'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold'>Create New PTO Plan</h1>

            {errorMsg && (
                <p className='text-red-600 bg-red-100 p-3 sm:p-4 rounded text-sm sm:text-base'>{errorMsg}</p>
            )}

            {/* Country */}
            <div className="space-y-2">
                <label className='font-medium text-sm sm:text-base'>Country</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className='w-full border p-2 sm:p-3 rounded text-sm sm:text-base'>
                    <option value='US'>United States</option>
                    <option value='MX'>Mexico</option>
                    <option value='TR'>Turkey</option>
                </select>
            </div>
            
            {/* Start Date */}
            <div className='space-y-2'>
                <label className='font-medium text-sm sm:text-base'>Start Date</label>
                <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} className='w-full border p-2 sm:p-3 rounded text-sm sm:text-base' />
            </div>

            {/* End Date */}
            <div className='space-y-2'>
                <label className='font-medium text-sm sm:text-base'>End Date</label>
                <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} className='w-full border p-2 sm:p-3 rounded text-sm sm:text-base'/>
            </div>

            {/* PTO Days */}
            <div className='space-y-2'>
                <label className='font-medium text-sm sm:text-base'>PTO Days Available</label>
                <input type='number' placeholder='PTO days available' value={ptoDays} onChange={(e) => setPtoDays(e.target.value)} className='w-full border p-2 sm:p-3 rounded text-sm sm:text-base'/>
            </div>

            {/* Save Button */}
            <button onClick={handleSubmit} className='w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white p-2 sm:p-3 rounded font-medium text-sm sm:text-base transition duration-200'>Save Plan</button>
            <button onClick={() => navigate('/ptoplans')} className='w-full bg-gray-300 hover:bg-gray-400 active:bg-gray-500 p-2 sm:p-3 rounded text-sm sm:text-base transition duration-200'>Cancel</button>
       
        </div>
    )
}