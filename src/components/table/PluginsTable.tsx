import React, { useState } from "react";
import { Table, Tag, Space } from "antd";

import { PluginT } from "../../types";

type Props = {
  pluginList: PluginT[];
};

function PluginsTable({ pluginList }: Props) {
  console.log(pluginList);
  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "geekblue";
        switch (status) {
          case "new":
            color = "#73d13d";
            break;
          case "updated":
            color = "#096dd9";
            break;
          case "removed":
            color = "#fa541c";
            break;
          default:
            //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
            break;
        }
        return (
          <>
            <Tag color={color} key={status}>
              {status.toUpperCase()}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Path",
      dataIndex: "file",
      key: "file",
    },
    {
      title: "Component ID",
      dataIndex: "componentId",
      key: "componentId",
    },
    {
      title: "Old version",
      dataIndex: "oldVersion",
      key: "oldVersion",
    },
    {
      title: "New version",
      dataIndex: "newVersion",
      key: "newVersion",
    },
  ];

  return (
    <div>
      {<Table columns={columns} size="small" dataSource={pluginList} />}
    </div>
  );
}

export default PluginsTable;
