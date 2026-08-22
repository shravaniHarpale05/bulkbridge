import React from "react";
import "../styles/Categories.css";

import { FaCarrot } from "react-icons/fa";
import { GiFruitBowl, GiPlantSeed } from "react-icons/gi";
import { MdGrass } from "react-icons/md";
import veges from "../assets/images/veges.jpeg";
import fruits from "../assets/images/fruits.png";
import seeds from "../assets/images/seeds.png";
import cereals from "../assets/images/cereals.png";
import spices from "../assets/images/spices.png";


export default function Categories(){

      const categories = [

    {
    image: veges,
    title:"Vegetables",
    desc:"Fresh vegetables directly from farmers"
    },

    {
    image: fruits,
    title:"Fruits",
    desc:"Quality fruits in bulk quantity"
    },

    {
    image: seeds,
    title:"Seeds",
    desc:"Healthy seeds for better farming"
    },

    {
    image: cereals,
    title:"Cereals",
    desc:"Premium grains and cereals"
    },
    {
    image: spices,
    title:"Spices",
    desc:"Premium spices from best location"
    }

    ];


  return(

    <section className="categories">

<div className="categories-container">
      <div className="cat-tag">
        CATEGORIES
      </div>


      <h1>
        Explore Our 
        <span> Products</span>
      </h1>


      <p>
        Choose from a wide range of fresh farm products.
      </p>


      <div className="category-cards">

        {
          categories.map((item,index)=>(

            <div className="category-card" key={index}>

              <div className="cat-image">
                <img src={item.image} />
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

        </div>
    </section>

  )
}