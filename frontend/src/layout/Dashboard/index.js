import React, { useEffect } from "react";
import Heatmap from "./Heatmap";


function Dashboard() {

  const userId = localStorage.getItem("userId");
  return (
    <div>
      <Heatmap userId={userId}/>
    </div>
  );
}

export default Dashboard;
