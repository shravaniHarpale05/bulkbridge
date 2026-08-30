import "../styles/Services.css";
import react from 'react'

import { 
  FaLeaf, 
  FaHandshake, 
  FaTruck, 
  FaRupeeSign 
} from "react-icons/fa";
import { FiUsers, FiPackage } from "react-icons/fi";

export default function Services() 
{
    const services = [
    {
      icon: <FaLeaf />,
      title: "Fresh Vegetables",
      desc: "Get fresh farm produce directly from farmers."
    },

    {
      icon: <FaHandshake />,
      title: "Direct Connection",
      desc: "Connect farmers and retailers without middlemen."
    },

    {
      icon: <FaTruck />,
      title: "Easy Delivery",
      desc: "Receive your orders on time with smooth delivery."
    },

    {
      icon: <FaRupeeSign />,
      title: "Better Prices",
      desc: "Farmers get fair prices and retailers save money."
    },

    {
      icon: <FiUsers />,
      title: "For Farmers & Retailers",
      desc: "A simple platform made for both."
    },

    {
      icon: <FiPackage />,
      title: "Bulk Ordering",
      desc: "Buy vegetables and products in large quantities."
    }
  ];
  return (
    <>
    <section className="services">

            <div className="ser-tag">
                <FaLeaf />
                    <span> OUR SERVICES</span>
            </div>
             <h1>
            Everything you need,<br/>
            <span>all in one place</span>
            </h1>
            <p>
            Bulkbridge provides smart and simple solutions
            for farmers and retailers.
            </p>

      <div className="service-cards">

        {
          services.map((item,index)=>(

            <div className="service-card" key={index}>

              <div className="icon">
                {item.icon}
              </div>

              <h3>
                {item.title}
              </h3>

              <p>
                {item.desc}
              </p>

            </div>

          ))
        }

      </div>


    </section>
    </>
  )
}



        