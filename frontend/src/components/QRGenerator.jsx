import { QRCodeCanvas } from "qrcode.react";

export default function TestQR() {
  return (
    <div className="p-10">
      <QRCodeCanvas
        value="IPS2024004"
        size={250}
      />
    </div>
  );
}

