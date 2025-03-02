import React from 'react';


const RequestTimeOffForm = ({ handleInputChange, handleSubmitTimeOff }) => (
    <div className="form-background">
        <form onSubmit={handleSubmitTimeOff} className="space-y-4 form">
            <input type="text" name="reason" placeholder="Reason for Time Off" onChange={handleInputChange} required className="w-full p-2 border rounded" />
            <input type="date" name="startDate" placeholder="Start Date" onChange={handleInputChange} required className="w-full p-2 border rounded" />
            <input type="date" name="endDate" placeholder="End Date" onChange={handleInputChange} required className="w-full p-2 border rounded" />
            <button type="submit" className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700">Request Time Off</button>
        </form>
    </div>
);

export default RequestTimeOffForm;
