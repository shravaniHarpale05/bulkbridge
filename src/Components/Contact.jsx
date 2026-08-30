import React, { useState } from "react";
import api from "../services/api";
import "../styles/Contact.css";

import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";


export default function Contact(){
   const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/api/contact/send",
        formData
      );

      setSuccess(response.data.message);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setSuccess("Failed to send message. Please try again.");
    }
  };
  return(

    <section className="contact-section">


      <div className="contact-container">


        <div className="contact-left">


          <div className="contact-tag">
            CONTACT US
          </div>


          <h1>
            Let's Grow
            <br/>
            <span>Together</span>
          </h1>


          <p>
            Have questions about Bulkbridge?
            Connect with us and we will help you.
          </p>



          <div className="contact-info">


            <div className="info-box">

              <FaPhone/>

              <div>
                <h3>Phone</h3>
                <p>+91 9876543210</p>
              </div>

            </div>



            <div className="info-box">

              <FaEnvelope/>

              <div>
                <h3>Email</h3>
                <p>support@bulkbridge.com</p>
              </div>

            </div>




            <div className="info-box">

              <FaMapMarkerAlt/>

              <div>
                <h3>Location</h3>
                <p>Maharashtra, India</p>
              </div>

            </div>



          </div>


        </div>




        <div className="contact-form">


          <h2>
            Send Message
          </h2>


          <input
  type="text"
  name="name"
  placeholder="Your Name"
  value={formData.name}
  onChange={handleChange}
/>


         <input
  type="email"
  name="email"
  placeholder="Your Email"
  value={formData.email}
  onChange={handleChange}
/>


          <input
  type="text"
  name="subject"
  placeholder="Subject"
  value={formData.subject}
  onChange={handleChange}
/>


         <textarea
  name="message"
  placeholder="Your Message"
  value={formData.message}
  onChange={handleChange}
></textarea>

{success && <p>{success}</p>}

         <button onClick={handleSubmit}>
  Send Message
</button>



        </div>



      </div>


    </section>

  )

}