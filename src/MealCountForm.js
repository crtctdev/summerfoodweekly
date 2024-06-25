import React, { useState } from 'react';
import './WeeklyMealCountForm.css'; // Ensure this is the correct path to your CSS file
import SignatureField from './SignatureField';

 // Helper function to create an array filled with zeros
 const createEmptyArray = (size) => Array.from({ length: size }, () => 0);

const WeeklyMealCountForm = () => {
  const [errors, setErrors] = useState({});
  const [signature, setSignature] = useState('');
  const [comments, setComments] = useState('');
// Example list of food sites for the dropdown
const foodSites = [
  'Educational Resources for Children (ERFC) Summer Escape',
  'Welles Village',
  'Pesci Park',
  'CRT Generations',
  'Camp Noah',
  'CRT Youth Artisan Technology Center',
  'Hartford Communities That Care',
  'Kamp Unlimited',
  'Community First School',
  'Wilson Gray YMCA Youth and Family Center',
  'Our Piece of the Pie',
  'IRIS Summer Learning Program',
  'Artists Collective',
  'Charter Oak Cultural Center'
];
 // State for the site details
 const [siteDetails, setSiteDetails] = useState({
  siteName: '', // This will hold the selected site name
  supervisorSignature: '',
  address: '',
  weekOf: '',
  phone: '',
  comments: ''
});

// Handle change for the site details
const handleSiteDetailsChange = (field, value) => {
  setSiteDetails(prevDetails => ({
    ...prevDetails,
    [field]: value
  }));

};

  const [mealData, setMealData] = useState({
    breakfast: {
      "Number Received": createEmptyArray(6),
      "Meals from Previous Day": createEmptyArray(6),
      "First Meals": createEmptyArray(6),
      "Second Meals": createEmptyArray(6),
      "Program Adult Meals": createEmptyArray(6),
      "Non-Program Adult Meals": createEmptyArray(6),
      "Incomplete / damaged / spoiled meals": createEmptyArray(6),
      "Total leftover meals": createEmptyArray(6),
      "Additional Meal Requests": createEmptyArray(6),
      "Money Collected for Adult Meals": createEmptyArray(6)
    },
    lunch: {
      "Number Received": createEmptyArray(6),
      "Meals from Previous Day": createEmptyArray(6),
      "First Meals": createEmptyArray(6),
      "Second Meals": createEmptyArray(6),
      "Program Adult Meals": createEmptyArray(6),
      "Non-Program Adult Meals": createEmptyArray(6),
      "Incomplete / damaged / spoiled meals": createEmptyArray(6),
      "Total leftover meals": createEmptyArray(6),
      "Additional Meal Requests": createEmptyArray(6),
      "Money Collected for Adult Meals": createEmptyArray(6)
    },
  });

  const handleInputChange = (meal, category, index, value) => {
    setMealData((prevData) => ({
      ...prevData,
      [meal]: {
        ...prevData[meal],
        [category]: prevData[meal][category].map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
    const newData = { ...mealData };
    newData[meal][category][index] = Number(value); // Update the current index with new value
    // Calculate the sum of the first five inputs
    const sum = newData[meal][category].slice(0, 5).reduce((acc, curr) => acc + curr, 0);
    newData[meal][category][5] = sum; // Set the sum to the last element
    setMealData(newData); // Update state
    setComments()
    
  };

  const resetForm = () => {
    setSiteDetails(siteDetails);
    setComments("")
    setSignature("")
    setMealData({
      breakfast: Object.keys(mealData.breakfast).reduce((acc, category) => ({
        ...acc,
        [category]: createEmptyArray(6)
      }), {}),
      lunch: Object.keys(mealData.lunch).reduce((acc, category) => ({
        ...acc,
        [category]: createEmptyArray(6)
      }), {})
    });
  };


const submitToSharePoint = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    try {
      const response = await fetch('https://77yhjk4mke.execute-api.us-east-1.amazonaws.com/CRTSummerFood/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ siteDetails, mealData, signature }),
      });

      if (response.ok) {
        console.log('Data submitted successfully', response);
        alert('Data submitted successfully!');
        resetForm();
        window.location.reload()
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.log('Failed to submit to SharePoint', error);
      alert('Submission failed: ' + error.message);
    }
  } else {
    alert('Please fill in all required fields!');
  }
};
  const renderRow = (meal, category) => {
    return (
      <div className="row">
        <div className="inputs">
          {mealData[meal][category].map((value, index) => (
            <span key={`${meal}-${category}-${index}`}>
              <label style={{ display: index === 0 ? 'inline-block' : 'none' }} className="label">{category}:</label>
              <input
                type="number" min={0}
                value={value}
                defaultValue={0}
                className='countTextBox'
                placeholder={index === 0 ? "Monday" : index === 1 ? "Tuesday" : index === 2 ? "Wednesday" : index === 3 ? "Thursday" : index === 4 ? "Friday" : "Total"}
                onChange={(e) => handleInputChange(meal, category, index, e.target.value)}
                disabled={index === 5} // Disable input for the Total box
              />
            </span>
          ))}
        </div>
        <br></br> <br></br>
        <hr></hr>
      </div>
    );
  };
 // Helper function to render a row with day headers and a total input
 const renderDayHeaders = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return (
    <div className="day-header-row">
       <div className="day-header total-header"></div>
      {days.map((day) => (
        <div key={day} className="day-header">{day}</div>
      ))}
      <div className="day-header total-header">Total</div>
    </div>
  );
};

const validateForm = () => {
  let newErrors = {};
  // Check each field for validity
  var anError =false
  if (!siteDetails.siteName){ newErrors.siteName = 'Site name is required'; anError =true}
  if (siteDetails.address == ""){ newErrors.address = 'Address is required';anError =true}
  if (siteDetails.phone == ""){ newErrors.phone = 'Phone number is required';anError =true}
  if (siteDetails.weekOf == ""){ newErrors.weekOf = 'Week of is required';anError =true}
  if (signature == ""){ newErrors.signature = 'Signature is required';anError =true}
  if(anError)alert(JSON.stringify(newErrors))
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0; // Return true if no errors
};




  return (
    <div className="weekly-meal-count-form">
      <div className="site-details-section">
        <div className="site-details-input">
        <label htmlFor="siteName">Site Name: *</label>
        <select 
          required
          name="siteName" 
          id="siteName" 
          value={siteDetails.siteName} 
          onChange={(e) => handleSiteDetailsChange('siteName', e.target.value)}
        >
          <option value="">Select a site</option>
          {foodSites.map((site, index) => (
            <option key={index} value={site}>{site}</option>
          ))}
        </select>
        </div>
        {/* Other site details inputs */}
        
        <div className="site-details-input">
          <label>Address: *</label>
          <input 
            type="text" 
            required
            onChange={(e) => handleSiteDetailsChange('address', e.target.value)}
            //readOnly // If this should be editable, remove the readOnly attribute
          />
        </div>
        <div className="site-details-input">
          <label>Phone: *</label>
          <input 
            type="phone" 
            required
            onChange={(e) => handleSiteDetailsChange('phone', e.target.value)}
            //value={siteDetails.phone}
            //readOnly // If this should be editable, remove the readOnly attribute
          />
        </div>
        <div className="site-details-input">
          <label>Week Of: *</label>
          <input 
            type="date" 
            required
            onChange={(e) => handleSiteDetailsChange('weekOf', e.target.value)}
            //value={siteDetails.weekOf}
            //readOnly // If this should be editable, remove the readOnly attribute
          />
        </div>
      </div>

      <div className='breakfastBox'>
      <h2 className="meal-type">Breakfast</h2>
      {renderDayHeaders()}
      {Object.keys(mealData.breakfast).map((category) => renderRow('breakfast', category))}
      </div>
      <div className='lunchBox'>
      <h2 className="meal-type">Lunch</h2>
      {renderDayHeaders()}
      {Object.keys(mealData.lunch).map((category) => renderRow('lunch', category))}
      </div>
      <div className="site-details-input">
          <label>Site Supervisor Comments:</label>
          <textarea 
            required
            onChange={(e) => handleSiteDetailsChange('comments', e.target.value)}
            //value={siteDetails.weekOf}
            //readOnly // If this should be editable, remove the readOnly attribute
          />
        </div>
      <div className="site-details-input-signature">
          <label>Signature Of Site Supervisor: (Draw with mouse)</label>
          <SignatureField setSignature={setSignature} />
        </div>
      <br></br><br></br>
      <div className="buttons">
        <button onClick={resetForm}>Reset</button>
        <button onClick={submitToSharePoint}>Submit</button>
      </div>
    </div>
  );
};

export default WeeklyMealCountForm;
