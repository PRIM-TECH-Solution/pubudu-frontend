import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";
import axios from "axios";

const NewArrivals = () => {
  const [responces, setResponce] = useState([]);
  const [events, setEvents] = useState([]);
  const getData = async () => {
    // Chage the API end point of retriving the recent events
    const responce = await axios.get("http://localhost:8080/eventcards/getAll");
    setResponce(responce.data);
    console.log(responces.length);
    if (responce.data != null) {
      const event = responce.data.map((e) => ({
        eventName: e.eventName,
        eventDate: e.eventDate,
        eventTime: e.eventTime,
        eventLocation: e.eventLocation,
        eventDescription: e.eventDescription,
        ticketDetails: e.ticketDetails,
        eventCategory: e.eventCategory,
        flyerLink: e.flyerLink,
      }));
      setEvents(event);
    }
  };
  useEffect(() => {
    getData();
  }, []);


  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };
  return (
    <div className="w-full pb-16">
      <Heading heading="Latest Events" />
      <Slider {...settings}>
        {events.map((event, index) => (
          <div className="px-2" key={index}>
            <Product
              _id={index}
              img={event.flyerLink}
              productName={event.eventName}
              location={event.eventLocation}
              color={event.eventCategory}
              des={event.eventDescription}
              time={event.eventTime}
              ticketDetails={event.ticketDetails}
              badge={true}

            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewArrivals;