# MongoDB MCP Server

An MCP (Model Context Protocol) server that provides access to your MongoDB database.

## Features

This MCP server provides the following tools:

- **list_collections**: List all collections in the database
- **find_documents**: Find documents in a collection with optional filter
- **insert_document**: Insert a single document into a collection
- **update_document**: Update documents in a collection
- **delete_document**: Delete documents from a collection
- **aggregate**: Run an aggregation pipeline on a collection
- **count_documents**: Count documents in a collection with optional filter

## Configuration

The server connects to MongoDB using the connection string in the `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/project-tracker
```

## Usage with Claude Code

To use this MCP server with Claude Code, add the following configuration to your Claude Code MCP settings:

For Windows (using PowerShell or CMD), add to your Claude Code config:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "node",
      "args": ["C:\\Webdev\\upp\\mcp-mongodb-server\\index.js"]
    }
  }
}
```

Or if you prefer, you can install it globally and reference it:

```bash
npm install -g .
```

Then configure:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "mcp-mongodb-server"
    }
  }
}
```

## Testing

You can test the server by running:

```bash
npm start
```

## Example Usage in Claude Code

Once configured, you can ask Claude to:

- "List all collections in my MongoDB database"
- "Find all documents in the users collection"
- "Insert a new document into the projects collection"
- "Count how many documents are in the tasks collection"
