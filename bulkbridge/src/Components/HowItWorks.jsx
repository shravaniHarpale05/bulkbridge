import React from "react";
import "../styles/HowItWorks.css";

import { FaUserPlus, FaLeaf, FaShoppingCart, FaTruck } from "react-icons/fa";


export default function HowItWorks() {


  const steps = [

    {
      icon:<FaUserPlus />,
      number:"01",
      title:"Register",
      desc:"Farmers and retailers create their account on Bulkbridge."
    },

    {
      icon:<FaLeaf />,
      number:"02",
      title:"Add Products",
      desc:"Farmers upload fresh vegetables, fruits and other products."
    },

    {
      icon:<FaShoppingCart />,
      number:"03",
      title:"Place Order",
      desc:"Retailers select products and order in bulk quantity."
    },

    {
      icon:<FaTruck />,
      number:"04",
      title:"Get Delivery",
      desc:"Fresh products are delivered at the right time."
    }

  ];


  return (

    <section className="how-section">


      <div className="how-container">


        <div className="how-tag">
          HOW IT WORKS
        </div>


        <h1>
          Simple Process,
          <br/>
          <span>Smarter Connection</span>
        </h1>


        <p className="how-desc">
          Bulkbridge connects farmers and retailers through
          a simple and efficient process.
        </p>



        <div className="steps-container">


          {
            steps.map((step,index)=>(

              <div className="step-card" key={index}>


                <div className="step-number">
                  {step.number}
                </div>


                <div className="step-icon">
                  {step.icon}
                </div>


                <h3>
                  {step.title}
                </h3>


                <p>
                  {step.desc}
                </p>


              </div>

            ))
          }


        </div>


      </div>


    </section>

  )
}