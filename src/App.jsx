import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { supabase } from './supabase'
import emailjs from '@emailjs/browser'

function App() {
  const[count, setCount] = useState(1);
  const[name, setName] = useState('');
  const[phone, setPhone] = useState('');
  const[email, setEmail] = useState('');

  const hour = new Date().getHours()
  let greeting = ''
  if (hour < 12) {
    greeting = 'Good Morning!'
  } else if (hour < 18) {
    greeting = 'Good Afternoon!'
  } else {
    greeting = 'Good Evening!'
  }

  const [selectedDate, setSelectedDate] = useState();
  const today = new Date();
  const [selectedTime, setSelectedTime] = useState();

async function handleSubmit() {
  console.log("1. Button clicked");

  try {
    console.log("2. About to insert into Supabase");

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          name,
          phone,
          email,
          dozen_count: count,
          pickup_date: selectedDate.toISOString().split("T")[0],
          notes: "N/A",
          status: "PENDING",
        },
      ]);

    console.log("3. Supabase responded");

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    await emailjs.send(
      "service_xokfees",
      "template_4atpopf",
      {
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        dozen_count: count,
        pickup_date: selectedDate.toISOString().split("T")[0],
        pickup_time: selectedTime,
      },
      "tmnLQT3k5nWRv7Ps9"
    );

    console.log("4. Success!");
    alert("Order placed successfully!");

    setName("");
    setPhone("");
    setEmail("");
    setCount(1);
    setSelectedDate(undefined);
    setSelectedTime("");

  } catch (err) {
    console.error("Caught error:", err);
    alert("Something went wrong. Check the console.");
  }
}

  return (
    <>
      <section id="center">
        <div className="greeting">
          <h1>{greeting}</h1>
          <p>
            Fresh eggs, collected daily.
          </p>
        </div>
      </section>

      <div className="ordering"></div>

      <section id="next-steps">
        <form className="order-form">

          <h2>Your Information</h2>
          <label>Name </label>
          <input type="text" placeholder="Your name" 
          value={name} onChange={(e) => setName(e.target.value)}
          />
          <label>Phone Number </label>
          <input type="tel" placeholder="Your phone number" 
          value={phone} onChange={(e) => setPhone(e.target.value)}
          />
          <label>Email (Optional) </label>
          <input type="email" placeholder="Your email" 
          value={email} onChange={(e) => setEmail(e.target.value)}
          />

          <h3>How many dozen?</h3>
          <div className="dozen-counter">
            <button type="button" 
            onClick={() => setCount(Math.max(1, count - 1))}>
              -
            </button>
            <span>{count}</span>
            <button type="button" 
            onClick={() => setCount(count + 1)}>
            +
            </button>
          </div>

          <div className="pickup-container">

            <div className="calendar">
            <h3>Pickup Date</h3>
            <p>Today is {new Date().toLocaleDateString()}</p>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={[
                { before: today },
                { dayOfWeek: [1, 2, 4] }
              ]}
            />
            </div>
            <div className="time">
            <label>Pickup Time</label>
            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
              <option>10:00 AM</option>
              <option>12:00 PM</option>
              <option>2:00 PM</option>
              <option>4:00 PM</option>
            </select>
            </div>

          </div>

             {selectedDate && (
              <p>You picked {selectedDate.toLocaleDateString()} at {selectedTime}.</p>
            )}
        

        <div className="total-card">
          <h3>Order Summary</h3>
          <br></br>
          <h2>Pickup Date: {selectedDate ? selectedDate.toLocaleDateString() : 'Not selected'}</h2>
          <h2>Pickup Time: {selectedTime || 'Not selected'}</h2>
          <br></br>
          <br></br>
          <p>Total Price: ${count * 5}</p>
          <br></br>
<button
  type="button"
  className="button"
  onClick={handleSubmit}
>
  Place Order
</button>
          <br></br>
          <br></br>
          <br></br>
        </div>


      </form>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App;
