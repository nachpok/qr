import { useState } from "react";
import Button from "antd/es/button";
import QRCode from "antd/es/qr-code";
import Input from "antd/es/input";
import Space from "antd/es/space";
import Switch from "antd/es/switch";

import "./App.css";
const isIOS = () => {
  const result =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  // alert("User Agent: " + navigator.userAgent + ", isIOS: " + result);
  return result;
};

const downloadQRCode = (qrText: string, background: boolean) => {
  const domainName = getDomainName(qrText) + ".png";
  const canvas = document
    .getElementById("myQrCode")
    ?.querySelector<HTMLCanvasElement>("canvas");

  if (canvas && !background) {
    const url = canvas.toDataURL();
    if (isIOS()) {
      const imgWindow = window.open("");
      if (imgWindow) {
        imgWindow.document.write(
          '<img src="' +
            url +
            '" alt="QRCode" style="max-width: 100%; height: auto;">'
        );
        imgWindow.document.title = "Tap and hold to save";
      }
    } else {
      const a = document.createElement("a");
      a.download = domainName;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
  if (canvas && background) {
    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width + 40;
    newCanvas.height = canvas.height + 40;
    const ctx = newCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#f5f5f5f5";
      ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
      ctx.drawImage(canvas, 20, 20);
    }
    const url = newCanvas.toDataURL();
    const a = document.createElement("a");
    a.download = domainName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
function getDomainName(inputUrl: string) {
  const urlWithProtocol =
    inputUrl.startsWith("http://") || inputUrl.startsWith("https://")
      ? inputUrl
      : `https://${inputUrl}`;
  try {
    const url = new URL(urlWithProtocol);
    return url.hostname;
  } catch (error) {
    console.error("Invalid URL");
    return null;
  }
}

function App() {
  const [qrText, setQrText] = useState("qr.nachli.com");
  const [background, setBackground] = useState(true);
  const onChange = (checked: boolean) => {
    setBackground(checked);
  };
  const determineSize = (url: string) => {
    const baseSize = 160;
    const increment = 10;
    const threshold = 20;
    const extraSize = Math.floor(url.length / threshold) * increment;
    return baseSize + extraSize;
  };
  return (
    <>
      <h1>QR Generator</h1>

      <Space direction="vertical" align="center">
        <div
          id="myQrCode"
          className="myQrCode"
          style={{
            backgroundColor: background ? "white" : "gray",
            borderRadius: "10px",
          }}
        >
          <QRCode value={qrText || "-"} size={determineSize(qrText)} />
        </div>

        <Input
          placeholder="-"
          value={qrText}
          onChange={(e) => setQrText(e.target.value)}
        />
        {qrText?.length > 60 ? (
          <span style={{ display: "block", whiteSpace: "pre-line" }}>
            In order to simplify the QR code
            <br />
            please shorten the URL
          </span>
        ) : (
          <></>
        )}
        <Switch
          defaultChecked
          onChange={onChange}
          checkedChildren="With background"
          unCheckedChildren="No background"
        />
        <Button
          type="primary"
          onClick={() => downloadQRCode(qrText, background)}
        >
          Download
        </Button>
      </Space>
    </>
  );
}

export default App;
