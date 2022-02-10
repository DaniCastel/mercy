import React, { useState } from "react";
import "antd/dist/antd.css";
import "./App.scss";

import { Upload, message, Input, Button } from "antd";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";

import PluginsTable from "./components/table/PluginsTable";
const { Dragger } = Upload;

function App() {
  const [file, setFile] = useState<string>();
  const [from, setFrom] = useState<string>("MR-3.10-MP2");
  const [to, setTo] = useState<string>("MR-3.11");

  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,

    beforeUpload: (file: any) => {
      const isTXT = file.type === "text/plain";
      if (!isTXT) {
        message.error(`${file.name} is not a txt file`);
      }
      return isTXT || Upload.LIST_IGNORE;
    },
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          setFile(e.target.result);
        };
        reader.readAsText(info.file.originFileObj);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: { dataTransfer: { files: any } }) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  type Plugin = {
    file: string;
    oldVersion: string;
    newVersion: string;
    componentId: string;
  };

  const processDiff = () => {
    if (typeof file !== "string") {
      return;
    }
    const plugins: Plugin[] = [];

    const content = file.split("\n");
    let plugin: Plugin = {
      file: "",
      oldVersion: "",
      newVersion: "",
      componentId: "",
    };
    content.forEach((line, key) => {
      if (line.startsWith("diff")) {
        if (key !== 0) {
          plugins.push(plugin);
        }
        plugin = {
          file: "",
          oldVersion: "",
          newVersion: "",
          componentId: "",
        };
        const files = line.split(" ");
        plugin.file = files[2];
        if (files[2].substring(2) !== files[2].substring(2)) {
          console.log("alert", files[2], files[3]);
        }
      }
      if (line.includes("-$plugin->version")) {
        const oldVersion = line
          .substring(line.indexOf("=") + 1, line.lastIndexOf(";"))
          .replace(/\s/g, "");
        plugin.oldVersion = oldVersion;
      }
      if (line.includes("+$plugin->version")) {
        const newVersion = line
          .substring(line.indexOf("=") + 1, line.lastIndexOf(";"))
          .replace(/\s/g, "");
        plugin.newVersion = newVersion;
      }
      // if (line.replace(/\s/g, "").startsWith("$plugin->component")) {
      if (line.includes("$plugin->component")) {
        const componentId = line
          .substring(line.indexOf("=") + 1, line.lastIndexOf(";"))
          .replace(/\s/g, "");
        plugin.componentId = componentId;
      }
    });
    plugins.push(plugin);
    console.log("plugins", plugins);
  };

  return (
    <div className="App">
      <header className="App-header">Mercy</header>
      <section className="step step_one">
        <h1>Step 1: Please select the release tags to be compared</h1>
        <div className="step fromto">
          <div>
            From
            <Input
              placeholder="Basic usage"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div>
            to
            <Input
              placeholder="Basic usage"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>
      </section>
      <section className="step">
        <h1>Step 2: Copy the following comand and ask for the exported file</h1>
        <pre>
          <code>
            {`git diff ${from}  ${to} -- "*version.php" > ~/Documents/plugins_changed.txt`}
          </code>
        </pre>
      </section>
      <section className="step">
        <h1>Step 3: Upload your file here</h1>
        <div>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Dragger>
        </div>
      </section>
      <section>
        <Button
          type="primary"
          shape="round"
          icon={<DownloadOutlined />}
          size="large"
          onClick={() => processDiff()}
        >
          Download
        </Button>
      </section>
      <section>
        <PluginsTable></PluginsTable>
      </section>
    </div>
  );
}

export default App;
