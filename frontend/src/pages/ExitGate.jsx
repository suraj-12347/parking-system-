import { useEffect, useState } from "react";

import FullScreenLayout from "../components/layout/FullScreenLayout";
import CameraScanner from "../components/scanner/CameraScanner";
import ScanResult from "../components/scanner/ScanResult";

import { completeExitSession } from "../services/exitService";


const ExitGate = () => {

  const [result, setResult] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [scannerKey, setScannerKey] = useState(0);
  const [processing, setProcessing] = useState(false);



  const handleScan = async (studentId) => {


    // Prevent duplicate scan
    if (processing || result) return;


    setProcessing(true);


    console.log(
      "EXIT SCANNED ID:",
      studentId
    );


    const response = await completeExitSession(studentId);


    console.log(
      "EXIT RESPONSE:",
      response
    );


    console.log(
      "PARKING LOGS:",
      JSON.parse(localStorage.getItem("parkingLogs"))
    );


    console.log(
      "PARKING SESSIONS:",
      JSON.parse(localStorage.getItem("parkingSessions"))
    );



    setResult(response);

    setCountdown(5);

    setProcessing(false);

  };



  useEffect(() => {


    if (!result) return;



    const timer = setInterval(() => {


      setCountdown((prev)=>{


        if(prev <= 1){


          clearInterval(timer);


          setResult(null);


          setCountdown(5);


          // Restart Scanner
          setScannerKey(
            key => key + 1
          );


          return 5;

        }


        return prev - 1;


      });


    },1000);



    return ()=>clearInterval(timer);



  },[result]);




  return (

    <FullScreenLayout>


      <div className="w-full h-full">


        {result ? (


          <ScanResult

            status={result.status}

            message={result.message}

            student={result.student}

            session={result.session}

            countdown={countdown}

          />


        ) : (


          <CameraScanner

            key={scannerKey}

            onScan={handleScan}

          />


        )}


      </div>


    </FullScreenLayout>

  );

};


export default ExitGate;