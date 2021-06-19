import React, { useEffect, useReducer } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MiniMatch } from './Match';

const includesByKey = (arr, value) => arr.map((elem) => elem.id).includes(value.id);

export default ({ matches, onUpdate, onDeselect }) => {
  const [rankedMatches, updateRankedMatches] = useReducer((matches, { action, data }) => {
    if (action === 'update') {
      const result = matches.slice();
      data.filter((match) => !includesByKey(result, match)).forEach((match) => result.push(match)); // Insert additions
      return result.filter((match) => includesByKey(data, match)); // Remove deletions
    }

    if (action === 'drag') {
      const result = matches.slice();
      const [removed] = result.splice(data.start, 1); // Remove elem from current location
      result.splice(data.end, 0, removed); // Add elem to new location
      return result;
    }
  }, []);

  useEffect(() => {
    updateRankedMatches({ action: 'update', data: matches });
  }, [matches]);

  useEffect(() => {
    onUpdate && onUpdate(rankedMatches);
  }, [rankedMatches]);

  return (
    <DragDropContext
      onDragEnd={
        ({ source, destination }) => {
          if (destination === null) return rankedMatches;
          return updateRankedMatches({ action: 'drag', data: { start: source.index, end: destination.index }});
        }
      }
    >
      <Droppable droppableId="matches">
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {rankedMatches.map((match, index) => (
            <Draggable key={match.id} draggableId={match.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <MiniMatch
                    match={match}
                    index={index}
                    onDeselect={onDeselect} />
                </div>
              )}
            </Draggable>
          ))}
        </div>
      )}
      </Droppable>
    </DragDropContext>
  )
}
