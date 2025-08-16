

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
  // Grandparents' bottom connects to parents' top
  { id: 'egp1-p1', source: 'gp1', sourceHandle: 'bottom', target: 'p1', targetHandle: 'top' },
  { id: 'egp2-p1', source: 'gp2', sourceHandle: 'bottom', target: 'p1', targetHandle: 'top' },
  { id: 'egp3-p2', source: 'gp3', sourceHandle: 'bottom', target: 'p2', targetHandle: 'top' },
  { id: 'egp4-p2', source: 'gp4', sourceHandle: 'bottom', target: 'p2', targetHandle: 'top' },
  // Parents' bottom connects to child's top
  { id: 'ep1-c1', source: 'p1', sourceHandle: 'bottom', target: 'c1', targetHandle: 'top' },
  { id: 'ep2-c1', source: 'p2', sourceHandle: 'bottom', target: 'c1', targetHandle: 'top' },

];




const SetNodesContext = createContext(null);

function EditableNode({ id, data, selected }) {
  const setNodes = useContext(SetNodesContext);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data.label);
  const onDelete = data.onDelete;
  const [hovered, setHovered] = useState(false);

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
    <div
      style={{ padding: 10, minWidth: 80, background: selected ? '#e0e7ff' : '#fff', border: '1px solid #888', borderRadius: 8, boxShadow: selected ? '0 0 0 2px #6366f1' : 'none', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => setHovered(true)}
      onMouseUp={() => setHovered(false)}
    >
      {/* Handles on all sides */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
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
      {/* Delete button only on selected or hovered node */}
      {onDelete && (selected || hovered) && (
        <button
          onClick={() => onDelete(id)}
          style={{
            textAlign: '-webkit-center',
            position: 'absolute',
            top: '1px',
            right: '2px',
            background: 'rgb(248, 113, 113)',
            color: 'rgb(255, 255, 255)',
            border: 'none',
            borderRadius: '50%',
            width: '0.8rem',
            height: '0.8rem',
            cursor: 'pointer',
            fontSize: '0.7rem',
            lineHeight: '0.2rem',
            padding: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

const nodeTypes = {
  editableNode: EditableNode,
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  // Add node
  const handleAddNode = () => {
    const newId = `n${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        id: newId,
        position: { x: 100, y: 100 },
        data: { label: 'New Node', onDelete: handleDeleteNode },
        type: 'editableNode',
      },
    ]);
  };

  // Delete node
  const handleDeleteNode = (id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNode(null);
  };

  // Add onDelete to node data for delete button
  const nodesWithDelete = nodes.map((node) => ({
    ...node,
    data: { ...node.data, onDelete: handleDeleteNode },
    selected: node.id === selectedNode,
  }));

  // Support connections from any handle (side)
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params }, eds));
  }, [setEdges]);

  // Track selected node
  const onNodeClick = (event, node) => {
    setSelectedNode(node.id);
  };

  return (
    <SetNodesContext.Provider value={setNodes}>
      <div style={{ width: '100vw', height: '100vh' }}>
        <h2 style={{ position: 'absolute', zIndex: 10, left: 20, top: 10 }}>Family Tree Visualizer</h2>
        <button onClick={handleAddNode} style={{ position: 'absolute', zIndex: 10, left: 20, top: 50,marginTop :'40px',padding: '6px 12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Add Node</button>
        <ReactFlow
          nodes={nodesWithDelete}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          onNodeClick={onNodeClick}
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
