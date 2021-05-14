import React, { useState, useRef, useEffect, useMemo } from "react";
const DRAGGABLE = "DRAGGABLE";
const BAR = "BAR";

function draggable(item, id) {
  return {
    type: DRAGGABLE,
    id,
    data: item
  };
}

function insertBars(list) {
  let i = 0;
  const newBar = () => {
    return {
      type: BAR,
      id: i++
    };
  };
  return [newBar()].concat(
    ...list.map(item => {
      return [draggable(item, i++), newBar()];
    })
  );
}

// drag 是当前拖动的ID，drop 是拖动到某个点的ID
// 这里更改一下 list 的顺序，这样就能够导致一次重排
function calcChanging(list, drag, drop) {
  list = list.slice();

  const dragItem = list[drag];

  // 因为中间隔了drop，所以每次更换可以拖动的drag，都是隔两个
  const dir = drag > drop ? -2 : 2;
  // 判断当前的 dragItem 是放在 drop 的上面还是下面
  const end = dir > 0 ? drop - 1 : drop + 1;

  // 从当前拖动的item开始排序，因为判定了dir，也就是顺序，所以这里使用 i += dir
  for (let i = drag; i != end; i += dir) {
    list[i] = list[i + dir];
  }
  // 最后将拖动的item的顺序也修改一下，这样就能够得到最新的 list 顺序了
  list[end] = dragItem;

  return list;
}

export default function useDragDrop(list) {
  const [dragList, setDragList] = useState(insertBars(list));
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const heights = useMemo(() => [], []);

  return {
    dragList,
    createDropperProps: id => {
      return {
        dragging,
        dragOver,
        heights,
        eventHandlers: {
          onDragOver: e => {
            e.preventDefault();
            setDragOver(id);
          },
          onDragLeave: e => {
            e.preventDefault();
            setDragOver(null);
          },
          onDrop: e => {
            e.preventDefault();
            setDragOver(null);
            setDragList(list => {
              return calcChanging(list, dragging, id);
            });
          }
        }
      };
    },
    createDraggerProps: id => {
      return {
        id,
        dragging,
        key: id,
        updateHeight: height => {
          heights[id] = height;
        },
        eventHandlers: {
          onDragStart: () => {
            setDragging(id);
          },
          onDragEnd: () => {
            setDragging(null);
          }
        }
      };
    }
  };
}
