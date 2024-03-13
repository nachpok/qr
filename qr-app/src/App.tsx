import { useState } from "react";
import Button from "antd/es/button";
import QRCode from "antd/es/qr-code";
import Input from "antd/es/input";
import Space from "antd/es/space";
import Switch from "antd/es/switch";

import "./App.css";
import { createShortUrl } from "./firebase";
import { Tooltip } from "antd";
import Link from "antd/es/typography/Link";
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
    const a = document.createElement("a");
    a.download = domainName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

interface ShortUrl {
  shortCode: string;
  originalUrl: string;
}

function App() {
  const [inputText, setInputText] = useState("qr.nachli.com");
  const [shortUrl, setShortUrl] = useState<ShortUrl | null>(null);
  const [background, setBackground] = useState(true);
  const generateQR = () => {
    let shortCode = null; //TODO check if exists, if null create
    if (!shortCode) {
      shortCode = generateShortId(); //TODO find a way to not generate the same short code
      createShortUrl(shortCode, inputText);
      setShortUrl({ shortCode: shortCode, originalUrl: inputText });
    }
  };
  const copyToClipboard = (shortCode: string) => {
    navigator.clipboard.writeText(`s.nachli.com/api/${shortCode}`).then(
      () => {
        console.log("Text copied to clipboard");
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };
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
        {shortUrl ? (
          <div className="qrContainer">
            <div
              id="myQrCode"
              className="myQrCode"
              style={{
                backgroundColor: background ? "white" : "gray",
                borderRadius: "10px",
              }}
            >
              <QRCode
                value={"s.nachli.com/api/" + shortUrl.shortCode || "-"}
                size={determineSize(shortUrl.shortCode) + 13}
              />
            </div>
            <Tooltip
              trigger={["hover"]}
              title={"Click to copy to clipboard"}
              placement="topLeft"
              overlayClassName="numeric-input"
            >
              <Link onClick={() => copyToClipboard(shortUrl.shortCode)}>
                s.nachli.com/api/{shortUrl.shortCode}
              </Link>
            </Tooltip>
          </div>
        ) : (
          <></>
        )}

        <Tooltip
          trigger={["hover"]}
          title={inputText}
          placement="topLeft"
          overlayClassName="numeric-input"
        >
          <Input
            placeholder="-"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </Tooltip>

        {shortUrl ? (
          <>
            <Switch
              defaultChecked
              onChange={onChange}
              checkedChildren="With background"
              unCheckedChildren="No background"
              disabled={isIOS()}
            />
          </>
        ) : (
          <></>
        )}
        {shortUrl?.originalUrl !== inputText ? (
          <Button type="primary" onClick={() => generateQR()}>
            Generate
          </Button>
        ) : shortUrl ? (
          <Button
            type="primary"
            onClick={() => downloadQRCode(inputText, background)}
          >
            Download
          </Button>
        ) : (
          <></>
        )}
      </Space>
    </>
  );
}

export default App;

function generateShortId(length = 6) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
