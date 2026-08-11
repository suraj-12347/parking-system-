import { useEffect, useState } from "react";

import FullScreenLayout from "../components/layout/FullScreenLayout";
import CameraScanner from "../components/scanner/CameraScanner";
import ScanResult from "../components/scanner/ScanResult";

import { createEntrySession } from "../services/sessionServices";


const EntryGate = () => {

  const [result, setResult] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [scannerKey, setScannerKey] = useState(0);



  const handleScan = async (studentId) => {

    // Prevent multiple scans while result screen is active
    if (result) return;


    console.log("SCANNED STUDENT ID:", studentId);


    // Validation + Session Creation
    const response = await createEntrySession(studentId);


    console.log("ENTRY RESPONSE:", response);


    setResult(response);
    setCountdown(5);

  };



  useEffect(() => {

    if (!result) return;


    const timer = setInterval(() => {


      setCountdown((prev) => {


        if (prev <= 1) {


          clearInterval(timer);


          // Clear result and restart scanner
          setResult(null);


          setCountdown(5);


          setScannerKey((key) => key + 1);


          return 5;

        }


        return prev - 1;


      });


    }, 1000);



    return () => clearInterval(timer);


  }, [result]);




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


export default EntryGate;