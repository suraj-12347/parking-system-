import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";


const CameraScanner = ({ onScan }) => {

  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);



  useEffect(() => {

    const scanner = new Html5Qrcode("qr-reader");

    scannerRef.current = scanner;


    let scanned = false;



    const startScanner = async () => {

      try {

        await scanner.start(

          { 
            facingMode: "environment" 
          },


          {
            fps: 30,

            qrbox: {
              width: 300,
              height: 300,
            },

          },


          (decodedText) => {


            if (scanned) return;


            scanned = true;


            console.log(
              "QR Detected:",
              decodedText
            );



            try {

              scanner.pause(true);

              console.log(
                "Scanner paused"
              );


            } catch(error) {

              console.log(
                "Pause Error:",
                error
              );

            }



            onScan(decodedText.trim());


          },


          () => {}

        );



        isRunningRef.current = true;



      } catch(error) {


        console.log(
          "Scanner Start Error:",
          error
        );


      }

    };



    startScanner();




    return () => {


      const stopScanner = async () => {


        try {


          if (!scannerRef.current) return;



          if (isRunningRef.current) {


            await scannerRef.current.stop();


            console.log(
              "Scanner stopped"
            );


          }



          await scannerRef.current.clear();



          console.log(
            "Scanner cleared"
          );



          isRunningRef.current = false;



        } catch(error) {


          console.log(
            "Scanner cleanup error:",
            error.message
          );


        }


      };



      stopScanner();


    };



  }, [onScan]);




  return (

    <div className="w-full">


      {/* Header */}

      <div className="flex items-center justify-between border-b px-6 py-4">


        <div>

          <h2 className="text-2xl font-bold text-slate-800">

            Entry Camera

          </h2>


          <p className="text-sm text-slate-500">

            Waiting for QR Code...

          </p>


        </div>



        <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">


          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500"></span>


          LIVE


        </div>



      </div>





      {/* Camera */}


      <div className="relative bg-slate-900 p-8">


        <div
          id="qr-reader"
          className="overflow-hidden rounded-2xl"
        />




        {/* Scanner Overlay */}


        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">



          <div className="relative h-80 w-80">



            <div className="absolute left-0 top-0 h-12 w-12 border-l-4 border-t-4 border-green-400 rounded-tl-xl" />


            <div className="absolute right-0 top-0 h-12 w-12 border-r-4 border-t-4 border-green-400 rounded-tr-xl" />


            <div className="absolute bottom-0 left-0 h-12 w-12 border-b-4 border-l-4 border-green-400 rounded-bl-xl" />


            <div className="absolute bottom-0 right-0 h-12 w-12 border-b-4 border-r-4 border-green-400 rounded-br-xl" />




            <div
              className="absolute left-0 right-0 h-1 bg-green-400 shadow-lg shadow-green-400"
              style={{
                animation:"scan 2s linear infinite",
              }}
            />



            <div className="flex h-full items-center justify-center">


              <div className="rounded-xl bg-black/60 px-5 py-3 text-center text-white backdrop-blur">


                <p className="font-semibold">

                  Show QR Code Here

                </p>


              </div>


            </div>



          </div>



        </div>



      </div>



    </div>

  );

};


export default CameraScanner;