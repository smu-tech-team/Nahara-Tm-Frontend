// import {QRCode} from "qrcode.react";

const QRReferral = ({ referralCode }) => {
  const referralUrl = `https://yourapp.com/register?referralCode=${referralCode}`;

  return (
    <div className="p-4 rounded bg-white dark:bg-gray-900 shadow">
      <h3 className="font-bold text-lg mb-2">Invite via QR Code</h3>
      <p className="mb-2">Share this QR code to invite others:</p>
      {/* <QRCode value={referralUrl} size={180} /> */}
      <p className="mt-2 text-sm break-words">{referralUrl}</p>
    </div>
  );
};

export default QRReferral;
