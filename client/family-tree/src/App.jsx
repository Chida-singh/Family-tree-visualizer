

import React, { useCallback, useState, createContext, useContext } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';


// Default: two parents, four grandparents, one child
const initialNodes = [
  // Grandparents (top row)
  { id: 'gp1', position: { x: 50, y: 10 }, data: { label: 'Grandparent 1' }, type: 'editableNode' },
  { id: 'gp2', position: { x: 200, y: 10 }, data: { label: 'Grandparent 2' }, type: 'editableNode' },
  { id: 'gp3', position: { x: 350, y: 10 }, data: { label: 'Grandparent 3' }, type: 'editableNode' },
  { id: 'gp4', position: { x: 500, y: 10 }, data: { label: 'Grandparent 4' }, type: 'editableNode' },
  // Parents (middle row)
  { id: 'p1', position: { x: 125, y: 120 }, data: { label: 'Parent 1' }, type: 'editableNode' },
  { id: 'p2', position: { x: 425, y: 120 }, data: { label: 'Parent 2' }, type: 'editableNode' },
  // Child (bottom row)
  { id: 'c1', position: { x: 275, y: 230 }, data: { label: 'Child' }, type: 'editableNode' },
];

const initialEdges = [
  // Grandparents to parents
  { id: 'egp1-p1', source: 'gp1', target: 'p1' },
  { id: 'egp2-p1', source: 'gp2', target: 'p1' },
  { id: 'egp3-p2', source: 'gp3', target: 'p2' },
  { id: 'egp4-p2', source: 'gp4', target: 'p2' },
  // Parents to child
  { id: 'ep1-c1', source: 'p1', target: 'c1' },
  { id: 'ep2-c1', source: 'p2', target: 'c1' },
];



// Context to provide setNodes to custom nodes
const SetNodesContext = createContext(null);

function EditableNode({ id, data, selected }) {
  const setNodes = useContext(SetNodesContext);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data.label);

  const handleDoubleClick = () => setEditing(true);
  const handleChange = (e) => setValue(e.target.value);
  const handleBlur = () => {
    setEditing(false);
    setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, label: value } } : node));
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div style={{ padding: 10, minWidth: 80, background: selected ? '#e0e7ff' : '#fff', border: '1px solid #888', borderRadius: 8, boxShadow: selected ? '0 0 0 2px #6366f1' : 'none' }}>
      <Handle type="target" position={Position.Top} />
      {editing ? (
        <input
          autoFocus
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{ fontSize: 16, width: '100%', border: 'none', outline: 'none', background: '#f3f4f6', borderRadius: 4 }}
        />
      ) : (
        <div className="editable-label" onDoubleClick={handleDoubleClick} style={{ cursor: 'pointer', fontSize: 16 }}>{value}</div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  editableNode: EditableNode,
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <SetNodesContext.Provider value={setNodes}>
      <div style={{ width: '100vw', height: '100vh' }}>
        <h2 style={{ position: 'absolute', zIndex: 10, left: 20, top: 10 }}>Family Tree Visualizer</h2>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </SetNodesContext.Provider>
  );
}

export default App;
