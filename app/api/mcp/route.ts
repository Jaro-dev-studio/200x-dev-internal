import { db } from "@/lib/db";

interface MCPToolResult {
  courses?: Array<{
    id: string;
    slug: string | null;
    title: string;
    description: string | null;
    thumbnail: string | null;
    priceInCents: number;
    published: boolean;
    type: "course";
  }>;
  digitalProducts?: Array<{
    id: string;
    slug: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    priceInCents: number;
    published: boolean;
    type: "digital";
  }>;
}

// Tool definitions
const TOOLS = [
  {
    name: "get_products",
    description:
      "Get all available products on 200x.dev. Returns both courses and digital products with their details including title, description, price, and availability status.",
    inputSchema: {
      type: "object" as const,
      properties: {
        includeUnpublished: {
          type: "boolean",
          description:
            "Whether to include unpublished products. Defaults to false.",
        },
        type: {
          type: "string",
          enum: ["all", "courses", "digital"],
          description:
            "Filter by product type. 'all' returns both courses and digital products. Defaults to 'all'.",
        },
      },
      required: [],
    },
  },
];

// Tool handlers
async function handleGetProducts(args: {
  includeUnpublished?: boolean;
  type?: "all" | "courses" | "digital";
}): Promise<MCPToolResult> {
  console.log("[MCP] Fetching products...");

  const includeUnpublished = args?.includeUnpublished ?? false;
  const type = args?.type ?? "all";

  const whereClause = includeUnpublished ? {} : { published: true };

  const results: MCPToolResult = {};

  if (type === "all" || type === "courses") {
    console.log("[MCP] Fetching courses...");
    const courses = await db.course.findMany({
      where: whereClause,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        thumbnail: true,
        priceInCents: true,
        published: true,
      },
      orderBy: { createdAt: "desc" },
    });

    results.courses = courses.map((course) => ({
      ...course,
      type: "course" as const,
    }));
    console.log(`[MCP] Found ${courses.length} courses`);
  }

  if (type === "all" || type === "digital") {
    console.log("[MCP] Fetching digital products...");
    const digitalProducts = await db.digitalProduct.findMany({
      where: whereClause,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        thumbnail: true,
        priceInCents: true,
        published: true,
      },
      orderBy: { createdAt: "desc" },
    });

    results.digitalProducts = digitalProducts.map((product) => ({
      ...product,
      type: "digital" as const,
    }));
    console.log(`[MCP] Found ${digitalProducts.length} digital products`);
  }

  return results;
}

// MCP JSON-RPC handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { method, params, id } = body;

    console.log(`[MCP] Received request: ${method}`);

    // Handle MCP protocol methods
    switch (method) {
      case "initialize":
        return Response.json({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: "200x-mcp-server",
              version: "1.0.0",
            },
          },
        });

      case "notifications/initialized":
        // Client acknowledgment - no response needed for notifications
        return Response.json({
          jsonrpc: "2.0",
          id,
          result: {},
        });

      case "tools/list":
        return Response.json({
          jsonrpc: "2.0",
          id,
          result: {
            tools: TOOLS,
          },
        });

      case "tools/call": {
        const { name, arguments: args } = params || {};

        if (name === "get_products") {
          const result = await handleGetProducts(args || {});
          return Response.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            },
          });
        }

        return Response.json({
          jsonrpc: "2.0",
          id,
          error: {
            code: -32602,
            message: `Unknown tool: ${name}`,
          },
        });
      }

      default:
        return Response.json({
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`,
          },
        });
    }
  } catch (error) {
    console.error("[MCP] Error:", error);
    return Response.json({
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : "Internal error",
      },
    });
  }
}

// Health check / info endpoint
export async function GET() {
  return Response.json({
    name: "200x-mcp-server",
    version: "1.0.0",
    description: "MCP server for 200x.dev products",
    tools: TOOLS.map((t) => t.name),
    endpoint: "/api/mcp",
    usage: {
      method: "POST",
      contentType: "application/json",
      examples: {
        initialize: {
          jsonrpc: "2.0",
          method: "initialize",
          params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: { name: "client", version: "1.0.0" },
          },
          id: 1,
        },
        listTools: {
          jsonrpc: "2.0",
          method: "tools/list",
          params: {},
          id: 2,
        },
        callTool: {
          jsonrpc: "2.0",
          method: "tools/call",
          params: {
            name: "get_products",
            arguments: { type: "all", includeUnpublished: false },
          },
          id: 3,
        },
      },
    },
  });
}
