#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/project-tracker';

let client;
let db;

async function connectToMongoDB() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const dbName = MONGODB_URI.split('/').pop().split('?')[0];
    db = client.db(dbName);
    console.error('Connected to MongoDB:', dbName);
  }
  return db;
}

const server = new Server(
  {
    name: 'mongodb-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_collections',
        description: 'List all collections in the database',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'find_documents',
        description: 'Find documents in a collection with optional filter',
        inputSchema: {
          type: 'object',
          properties: {
            collection: {
              type: 'string',
              description: 'The name of the collection',
            },
            filter: {
              type: 'object',
              description: 'MongoDB filter query (optional)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of documents to return (default: 10)',
            },
          },
          required: ['collection'],
        },
      },
      {
        name: 'insert_document',
        description: 'Insert a single document into a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection: {
              type: 'string',
              description: 'The name of the collection',
            },
            document: {
              type: 'object',
              description: 'The document to insert',
            },
          },
          required: ['collection', 'document'],
        },
      },
      {
        name: 'update_document',
        description: 'Update documents in a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection: {
              type: 'string',
              description: 'The name of the collection',
            },
            filter: {
              type: 'object',
              description: 'MongoDB filter to match documents',
            },
            update: {
              type: 'object',
              description: 'MongoDB update operations',
            },
          },
          required: ['collection', 'filter', 'update'],
        },
      },
      {
        name: 'delete_document',
        description: 'Delete documents from a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection: {
              type: 'string',
              description: 'The name of the collection',
            },
            filter: {
              type: 'object',
              description: 'MongoDB filter to match documents',
            },
          },
          required: ['collection', 'filter'],
        },
      },
      {
        name: 'aggregate',
        description: 'Run an aggregation pipeline on a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection: {
              type: 'string',
              description: 'The name of the collection',
            },
            pipeline: {
              type: 'array',
              description: 'MongoDB aggregation pipeline',
            },
          },
          required: ['collection', 'pipeline'],
        },
      },
      {
        name: 'count_documents',
        description: 'Count documents in a collection with optional filter',
        inputSchema: {
          type: 'object',
          properties: {
            collection: {
              type: 'string',
              description: 'The name of the collection',
            },
            filter: {
              type: 'object',
              description: 'MongoDB filter query (optional)',
            },
          },
          required: ['collection'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const database = await connectToMongoDB();

    switch (name) {
      case 'list_collections': {
        const collections = await database.listCollections().toArray();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(collections.map(c => c.name), null, 2),
            },
          ],
        };
      }

      case 'find_documents': {
        const { collection, filter = {}, limit = 10 } = args;
        const docs = await database
          .collection(collection)
          .find(filter)
          .limit(limit)
          .toArray();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(docs, null, 2),
            },
          ],
        };
      }

      case 'insert_document': {
        const { collection, document } = args;
        const result = await database.collection(collection).insertOne(document);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  acknowledged: result.acknowledged,
                  insertedId: result.insertedId
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'update_document': {
        const { collection, filter, update } = args;
        const result = await database.collection(collection).updateMany(filter, update);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  acknowledged: result.acknowledged,
                  matchedCount: result.matchedCount,
                  modifiedCount: result.modifiedCount,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'delete_document': {
        const { collection, filter } = args;
        const result = await database.collection(collection).deleteMany(filter);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  acknowledged: result.acknowledged,
                  deletedCount: result.deletedCount,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'aggregate': {
        const { collection, pipeline } = args;
        const docs = await database.collection(collection).aggregate(pipeline).toArray();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(docs, null, 2),
            },
          ],
        };
      }

      case 'count_documents': {
        const { collection, filter = {} } = args;
        const count = await database.collection(collection).countDocuments(filter);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ count }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MongoDB MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  if (client) {
    await client.close();
  }
  process.exit(0);
});
