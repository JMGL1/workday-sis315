import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './Reclutamiento.css';
import { Plus } from 'lucide-react';



const COLUMNS = [
  { id: 'postulado', title: 'Postulados' },
  { id: 'entrevista', title: 'Entrevistas' },
  { id: 'ofertado', title: 'Ofertados' },
  { id: 'contratado', title: 'Contratados' }
];

const SortableItem = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.id, data: { candidate: props.candidate } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="kanban-card">
      <h4>{props.candidate.name}</h4>
      <p>{props.candidate.role}</p>
    </div>
  );
};

export const Reclutamiento = () => {
  const [candidates, setCandidates] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const data = await apiFetch('/api/reclutamiento/candidatos');
        // Map backend fields to frontend format
        const formatted = data.map(c => ({
          id: String(c.id),
          name: c.nombre,
          role: c.puesto,
          column: c.estado
        }));
        setCandidates(formatted);
      } catch (error) {
        console.error('Error fetching candidatos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidatos();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveColumn = COLUMNS.some(c => c.id === activeId);
    const isOverColumn = COLUMNS.some(c => c.id === overId);
    
    // Si soltamos sobre otra carta
    const activeCandidateIndex = candidates.findIndex(c => c.id === activeId);
    const overCandidateIndex = candidates.findIndex(c => c.id === overId);

    if (activeCandidateIndex !== -1 && overCandidateIndex !== -1 && candidates[activeCandidateIndex].column !== candidates[overCandidateIndex].column) {
       // Moving to a different column but hovered on an item
       const newCandidates = [...candidates];
       newCandidates[activeCandidateIndex].column = candidates[overCandidateIndex].column;
       setCandidates(arrayMove(newCandidates, activeCandidateIndex, overCandidateIndex));
       // In a real app, send a PUT request to update the stage in DB here.
       return;
    }

    if (activeCandidateIndex !== -1 && isOverColumn) {
        // Moving to empty space in a column
        const newCandidates = [...candidates];
        newCandidates[activeCandidateIndex].column = overId;
        setCandidates(newCandidates);
        return;
    }
  };

  const activeCandidate = activeId ? candidates.find(c => c.id === activeId) : null;

  return (
    <div className="reclutamiento-page">
      <div className="page-header">
        <div>
          <h1>Reclutamiento</h1>
          <p>Kanban de selección de talento</p>
        </div>
        <button className="btn btn-primary flex-center gap-2">
          <Plus size={18} /> Nueva Vacante
        </button>
      </div>

      <div className="kanban-board">
        {loading ? <p style={{padding: '20px'}}>Cargando candidatos...</p> : (
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {COLUMNS.map(column => {
            const columnCandidates = candidates.filter(c => c.column === column.id);
            return (
              <div key={column.id} className="kanban-column" id={column.id}>
                <div className="kanban-column-header">
                  <h3>{column.title}</h3>
                  <span className="kanban-count">{columnCandidates.length}</span>
                </div>
                <div className="kanban-column-content">
                  <SortableContext 
                    items={columnCandidates.map(c => c.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    {columnCandidates.map(c => (
                      <SortableItem key={c.id} id={c.id} candidate={c} />
                    ))}
                  </SortableContext>
                </div>
              </div>
            );
          })}
          
          <DragOverlay>
            {activeCandidate ? (
              <div className="kanban-card dragging">
                <h4>{activeCandidate.name}</h4>
                <p>{activeCandidate.role}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        )}
      </div>
    </div>
  );
};
