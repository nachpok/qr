import { useState } from "react";
import { Button, Input, QRCode, Space, Switch } from "antd";
import "./App.css";

const downloadQRCode = (background: boolean) => {
  const canvas = document
    .getElementById("myqrcode")
    ?.querySelector<HTMLCanvasElement>("canvas");
  if (canvas && !background) {
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.download = "QRCode.png";
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
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
      ctx.drawImage(canvas, 20, 20);
    }
    const url = newCanvas.toDataURL();
    const a = document.createElement("a");
    a.download = "QRCode.png";
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

function App() {
  const [text, setText] = useState("qr.nachli.com");
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
        <div id="myqrcode">
          <QRCode value={text || "-"} size={determineSize(text)} />
        </div>

        <Input
          placeholder="-"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text?.length > 60 ? (
          <span style={{ display: "block", whiteSpace: "pre-line" }}>
            In order to simplify the QR code
            <br />
            please shorten the URL
          </span>
        ) : (
          <></>
        )}
        <Switch
          checkedChildren="With background"
          unCheckedChildren="No background"
          defaultChecked
          onChange={onChange}
        />
        <Button type="primary" onClick={() => downloadQRCode(background)}>
          Download
        </Button>
      </Space>
    </>
  );
}

export default App;
