import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const CameraScanner = ({ onScan }) => {
  // ==========================================
  // REFS
  // ==========================================
  const scannerRef = useRef(null);

  const isRunningRef = useRef(false);

  const camerasRef = useRef([]);

  const currentCameraIndexRef = useRef(0);

  const scannedRef = useRef(false);

  const switchingRef = useRef(false);

  // ==========================================
  // STATE
  // ==========================================
  const [cameraName, setCameraName] =
    useState("Back Camera");

  // ==========================================
  // CAMERA NAME
  // ==========================================
  const getCameraName = (label = "") => {
    const name = label.toLowerCase();

    if (
      name.includes("front") ||
      name.includes("user")
    ) {
      return "Front Camera";
    }

    if (
      name.includes("back") ||
      name.includes("rear") ||
      name.includes("environment")
    ) {
      return "Back Camera";
    }

    return "Camera";
  };

  // ==========================================
  // START CAMERA
  // ==========================================
  const startCamera = async (
    cameraId,
    cameraLabel = ""
  ) => {
    const scanner = scannerRef.current;

    if (!scanner) {
      return;
    }

    try {
      // Reset scan lock
      scannedRef.current = false;

      console.log(
        "Starting camera:",
        cameraId
      );

      await scanner.start(
        cameraId,

        {
          fps: 30,

          qrbox: {
            width: 300,
            height: 300,
          },

          aspectRatio: 1,
        },

        // ======================================
        // QR SUCCESS
        // ======================================
        (decodedText) => {
          if (scannedRef.current) {
            return;
          }

          scannedRef.current = true;

          console.log(
            "QR Detected:",
            decodedText
          );

          // Pause scanner
          try {
            if (isRunningRef.current) {
              scanner.pause(true);

              console.log(
                "Scanner paused"
              );
            }
          } catch (error) {
            console.log(
              "Pause Error:",
              error
            );
          }

          // Send QR value to parent
          onScan(decodedText.trim());
        },

        // ======================================
        // QR SCAN ERROR
        // ======================================
        () => {}
      );

      isRunningRef.current = true;

      // Update camera name
      setCameraName(
        getCameraName(cameraLabel)
      );

      console.log(
        "Camera started successfully"
      );
    } catch (error) {
      console.error(
        "Camera Start Error:",
        error
      );

      isRunningRef.current = false;
    }
  };

  // ==========================================
  // STOP CURRENT CAMERA
  // ==========================================
  const stopCurrentCamera = async () => {
    const scanner = scannerRef.current;

    if (!scanner) {
      return;
    }

    if (!isRunningRef.current) {
      return;
    }

    try {
      await scanner.stop();

      console.log(
        "Current camera stopped"
      );
    } catch (error) {
      console.log(
        "Camera stop error:",
        error
      );
    }

    isRunningRef.current = false;
  };

  // ==========================================
  // SWITCH CAMERA
  // ==========================================
  const switchCamera = async () => {
    // Prevent double clicking
    if (switchingRef.current) {
      return;
    }

    const scanner = scannerRef.current;

    if (!scanner) {
      console.log(
        "Scanner not initialized"
      );

      return;
    }

    // ==========================================
    // CHECK AVAILABLE CAMERAS
    // ==========================================
    const cameras = camerasRef.current;

    console.log(
      "Cameras available for switching:",
      cameras
    );

    if (!cameras || cameras.length < 2) {
      console.log(
        "Less than 2 cameras available."
      );

      return;
    }

    try {
      switchingRef.current = true;

      console.log(
        "================================="
      );

      console.log(
        "SWITCHING CAMERA"
      );

      console.log(
        "Current index:",
        currentCameraIndexRef.current
      );

      // ========================================
      // STOP CURRENT CAMERA
      // ========================================
      await stopCurrentCamera();

      // ========================================
      // CALCULATE NEXT CAMERA
      // ========================================
      const nextIndex =
        (currentCameraIndexRef.current + 1) %
        cameras.length;

      currentCameraIndexRef.current =
        nextIndex;

      const nextCamera =
        cameras[nextIndex];

      console.log(
        "Next camera:",
        nextCamera
      );

      // ========================================
      // START NEXT CAMERA
      // ========================================
      await startCamera(
        nextCamera.id,
        nextCamera.label
      );

      console.log(
        "Camera switched successfully"
      );

      console.log(
        "================================="
      );
    } catch (error) {
      console.error(
        "Camera Switch Error:",
        error
      );
    } finally {
      switchingRef.current = false;
    }
  };

  // ==========================================
  // INITIALIZE CAMERA
  // ==========================================
  useEffect(() => {
    let mounted = true;

    const scanner =
      new Html5Qrcode("qr-reader");

    scannerRef.current = scanner;

    const initializeCamera = async () => {
      try {
        // ======================================
        // GET CAMERAS
        // ======================================
        const cameras =
          await Html5Qrcode.getCameras();

        if (!mounted) {
          return;
        }

        // ======================================
        // CAMERA DEBUG
        // ======================================
        console.log(
          "================================="
        );

        console.log(
          "AVAILABLE CAMERAS:"
        );

        console.log(
          "Camera count:",
          cameras.length
        );

        console.log(
          cameras
        );

        console.log(
          "================================="
        );

        // ======================================
        // NO CAMERA
        // ======================================
        if (
          !cameras ||
          cameras.length === 0
        ) {
          console.log(
            "No camera found."
          );

          return;
        }

        // ======================================
        // SAVE CAMERAS
        // ======================================
        camerasRef.current =
          cameras;

        // ======================================
        // FIND BACK CAMERA
        // ======================================
        let backCameraIndex =
          cameras.findIndex(
            (camera) => {
              const label =
                camera.label
                  ?.toLowerCase() || "";

              return (
                label.includes("back") ||
                label.includes("rear") ||
                label.includes(
                  "environment"
                )
              );
            }
          );

        // ======================================
        // IF BACK CAMERA NOT FOUND
        // ======================================
        if (backCameraIndex === -1) {
          backCameraIndex = 0;
        }

        // ======================================
        // SAVE CURRENT CAMERA INDEX
        // ======================================
        currentCameraIndexRef.current =
          backCameraIndex;

        // ======================================
        // SELECT CAMERA
        // ======================================
        const selectedCamera =
          cameras[
            backCameraIndex
          ];

        console.log(
          "Selected camera:",
          selectedCamera
        );

        // ======================================
        // CAMERA NAME
        // ======================================
        setCameraName(
          getCameraName(
            selectedCamera.label
          )
        );

        // ======================================
        // START CAMERA
        // ======================================
        await startCamera(
          selectedCamera.id,
          selectedCamera.label
        );
      } catch (error) {
        console.error(
          "Camera Initialization Error:",
          error
        );
      }
    };

    initializeCamera();

    // ==========================================
    // CLEANUP
    // ==========================================
    return () => {
      mounted = false;

      const cleanup = async () => {
        try {
          if (!scannerRef.current) {
            return;
          }

          // ======================================
          // STOP CAMERA
          // ======================================
          if (
            isRunningRef.current
          ) {
            try {
              await scannerRef.current.stop();

              console.log(
                "Scanner stopped"
              );
            } catch (error) {
              console.log(
                "Scanner stop cleanup error:",
                error
              );
            }

            isRunningRef.current =
              false;
          }

          // ======================================
          // CLEAR
          // ======================================
          try {
            await scannerRef.current.clear();

            console.log(
              "Scanner cleared"
            );
          } catch (error) {
            console.log(
              "Scanner clear cleanup error:",
              error
            );
          }

          scannerRef.current = null;
        } catch (error) {
          console.log(
            "Scanner cleanup error:",
            error
          );
        }
      };

      cleanup();
    };

    // IMPORTANT:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="w-full">

      {/* ==========================================
          HEADER
      ========================================== */}
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          px-6
          py-4
        "
      >

        {/* LEFT */}
        <div>
          <h2
            className="
              text-2xl
              font-bold
              text-slate-800
            "
          >
            Entry Camera
          </h2>

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Waiting for QR Code...
          </p>
        </div>

        {/* RIGHT */}
        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {/* ======================================
              SWITCH CAMERA BUTTON
          ====================================== */}
          <button
            type="button"
            onClick={switchCamera}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-slate-100
              px-4
              py-2
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:bg-slate-200
              active:scale-95
            "
          >

            {/* CAMERA ICON */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="
                  M4 7
                  h3
                  l2-2
                  h6
                  l2 2
                  h3
                  a2 2 0 0 1 2 2
                  v9
                  a2 2 0 0 1-2 2
                  H4
                  a2 2 0 0 1-2-2
                  V9
                  a2 2 0 0 1 2-2
                  z
                "
              />

              <circle
                cx="12"
                cy="13"
                r="3"
              />
            </svg>

            Switch Camera
          </button>

          {/* ======================================
              LIVE
          ====================================== */}
          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              bg-green-100
              px-4
              py-2
              font-semibold
              text-green-700
            "
          >
            <span
              className="
                h-2.5
                w-2.5
                animate-pulse
                rounded-full
                bg-green-500
              "
            />

            LIVE
          </div>

        </div>
      </div>

      {/* ==========================================
          CAMERA
      ========================================== */}
      <div
        className="
          relative
          bg-slate-900
          p-8
        "
      >

        {/* HTML5 QR CAMERA */}
        <div
          id="qr-reader"
          className="
            overflow-hidden
            rounded-2xl
          "
        />

        {/* ==========================================
            SCANNER OVERLAY
        ========================================== */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            flex
            items-center
            justify-center
          "
        >

          <div
            className="
              relative
              h-80
              w-80
            "
          >

            {/* TOP LEFT */}
            <div
              className="
                absolute
                left-0
                top-0
                h-12
                w-12
                rounded-tl-xl
                border-l-4
                border-t-4
                border-green-400
              "
            />

            {/* TOP RIGHT */}
            <div
              className="
                absolute
                right-0
                top-0
                h-12
                w-12
                rounded-tr-xl
                border-r-4
                border-t-4
                border-green-400
              "
            />

            {/* BOTTOM LEFT */}
            <div
              className="
                absolute
                bottom-0
                left-0
                h-12
                w-12
                rounded-bl-xl
                border-b-4
                border-l-4
                border-green-400
              "
            />

            {/* BOTTOM RIGHT */}
            <div
              className="
                absolute
                bottom-0
                right-0
                h-12
                w-12
                rounded-br-xl
                border-b-4
                border-r-4
                border-green-400
              "
            />

            {/* SCAN LINE */}
            <div
              className="
                absolute
                left-0
                right-0
                h-1
                bg-green-400
                shadow-lg
                shadow-green-400
              "
              style={{
                animation:
                  "scan 2s linear infinite",
              }}
            />

            {/* CENTER TEXT */}
            <div
              className="
                flex
                h-full
                items-center
                justify-center
              "
            >
              <div
                className="
                  rounded-xl
                  bg-black/60
                  px-5
                  py-3
                  text-center
                  text-white
                  backdrop-blur
                "
              >
                <p className="font-semibold">
                  Show QR Code Here
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-300
                  "
                >
                  {cameraName}
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