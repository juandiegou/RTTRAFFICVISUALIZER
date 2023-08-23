import { useState, useEffect } from 'react'
import { Chart } from 'react-google-charts'
import Header from './Header';
import { requestCore } from './API/request'
import moment from 'moment';
import './App.css' 


interface DataItem {
  created_at: string;
  car_count: number
}

interface DataShowItem{
  cabecera:[string,string],
  dato:[hora:Date, vehiculos:number]
}

function  App () {
  const options = {
    title:"Cantidad de carros por minuto",    
    animation: {
      duration: 1000,
      easing: "InAndOut",
      startup: true,
    },
    curveType: "function",
    legend: { position: "in"},
    enableInteractivity: true,
  }
  const [data, setData] = useState<DataShowItem| any>([["hora","vehículos"],[new Date(),0]]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      let tempData:[[string, number]] =[[moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),0]]
      requestCore.get("/allrecord")
      .then((res)=>{
        res.data.data.map((item:DataItem)=>(
          tempData.push([moment(item.created_at).format("DD-MM-YYYY HH:mm:ss"), item.car_count])
        ))
        
      }).catch((er)=>{
        console.log(er);
      }
      
      ).finally(()=>{
        setData([["hora","vehículos"],...tempData])
        console.log("finished");
      
      })
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    <div>
      <Header />
      <Chart 
        chartType="LineChart"
        height={'80vh'}
        width={'80vw'}
        data={data}
        options={options}
        legendToggle
      />
    </div>
  )
}

export default App
