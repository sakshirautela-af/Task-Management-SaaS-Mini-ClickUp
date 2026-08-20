import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { z } from "zod";

server = McpServer({
  name: "taskmanager",
  version: "1.0.0",
});

server.tool("create-tasks", {});
