# Family Tree Visualizer

A simple and interactive web application to visualize and edit family trees. Built with React and React Flow, this tool allows you to add, connect, edit, and delete family members as nodes in a drag-and-drop interface.

## Features

- **Add Nodes:** Easily add new family members to the tree.
- **Edit Nodes:** Double-click a node to rename it.
- **Delete Nodes:** Click the delete (×) button on a selected or hovered node to remove it and its connections.
- **Connect Nodes:** Drag from any side of a node to another to create relationships (edges). Connections can be made from any side (top, bottom, left, right).
- **Flexible Layout:** Move nodes freely to arrange your family tree as you like.
- **Blank Canvas:** Start from scratch or use the provided template for a quick start.

## Getting Started

### Prerequisites
- Node.js (v16 or later recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Chida-singh/Family-tree-visualizer.git
   cd Family-tree-visualizer/family-tree
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173` (or the port shown in your terminal).

## Usage

- **Add a Node:** Click the "Add Node" button.
- **Edit a Node:** Double-click a node's label to rename it.
- **Delete a Node:** Select or hover over a node and click the × button.
- **Connect Nodes:** Drag from a handle (small circle) on any side of a node to another node's handle.
- **Move Nodes:** Click and drag nodes to reposition them.

## Project Structure

```
family-tree/
├── public/
│   └── ...
├── src/
│   ├── App.jsx         # Main React component
│   ├── index.jsx       # Entry point
│   └── ...
├── package.json
├── vite.config.js
└── ...
```

## Built With
- [React](https://react.dev/)
- [React Flow](https://reactflow.dev/)
- [Vite](https://vitejs.dev/)

## License

This project is open source and available under the [MIT License](LICENSE).

---

Feel free to contribute or suggest improvements!
