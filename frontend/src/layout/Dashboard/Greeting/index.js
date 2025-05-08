import React from "react";

const Greeting = ({ name }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    else if (hour < 15) return "Good Noon";
    else if (hour < 18) return "Good Afternoon";
    else return "Good Evening";
  };

  return (
    <h2>
      {getGreeting()}, {name}!
    </h2>
  );
};

export default Greeting;
