import React, { useState } from "react";
import "antd/dist/antd.css";
import "./App.scss";

import { Upload, message, Input, Button } from "antd";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";

import PluginsTable from "./components/table/PluginsTable";
import { processDiff } from "./utils/processDiff";
import { PluginT } from "./types";
const { Dragger } = Upload;

function App() {
  const [file, setFile] = useState<string>("");
  const [from, setFrom] = useState<string>("MR-3.10-MP2");
  const [to, setTo] = useState<string>("MR-3.11");
  const [pluginList, setPluginList] = useState<PluginT[]>([]);

  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",

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
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: { dataTransfer: { files: any } }) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const processFile = (file: string) => {
    setPluginList(processDiff(file));
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
          onClick={() => processFile(file)}
        >
          Download
        </Button>
      </section>
      <section>
        <div className="plugins_table">
          <PluginsTable pluginList={pluginList}></PluginsTable>
        </div>
      </section>
    </div>
  );
}

export default App;
