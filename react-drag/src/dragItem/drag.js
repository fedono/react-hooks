import React, { useEffect, useRef } from "react";
import useDragDrop from "./useDrag";

const list = [
  {
    label: "Item 1"
  },
  {
      label: "Item 2"
  },
  {
      label: "Item 3"
  }
];

export default function App() {
  return <DraggableList list={list} Card={Card} />;
}

function cls(def, ...conditions) {
  const list = [def];
  conditions.forEach(cond => {
    if (cond[0]) {
      list.push(cond[1]);
    }
  });
  return list.join(" ");
}

function Card({ label }) {
  return (
    <div className="item">
        {label}
    </div>
  );
}

export function DraggableList({ list, Card }) {
  const { dragList, createDropperProps, createDraggerProps } = useDragDrop(
    list
  );

  return (
    <div>
      {dragList.map((item, i) => {
        if (item.type === "BAR") {
          return <Bar id={i} {...createDropperProps(i)} key={item.id} />;
        } else {
          return (
            <Draggable {...createDraggerProps(i)}>
              <Card {...item.data} />
            </Draggable>
          );
        }
      })}
    </div>
  );
}

const Draggable = React.memo(
  ({ id, eventHandlers, dragging, children, updateHeight }) => {
    const divRef = useRef(null);

    useEffect(() => {
      updateHeight(divRef.current.clientHeight);
    }, []);

    return (
      <div
        ref={divRef}
        {...eventHandlers}
        className={cls("draggable", [id === dragging, "dragging"])}
        draggable={true}
      >
        {children}
      </div>
    );
  },
  (prev, next) => prev.dragging === next.dragging
);

function Bar({ id, dragging, heights, dragOver, eventHandlers }) {
  if (id === dragging + 1) {
    return null;
  }
  return (
    <div
      {...eventHandlers}
      className={cls("draggable--bar", [dragOver === id, "dragover"])}
    >
      <div
        className="inner"
        style={{
          // 有点没明白的是，这里为什么要将 heights[dragging] 设置到 bar 中来？
          // 明白了，其实就是一个样式，当把dragitem放到这里来的时候，设置了 class dragover，
          // 但是 height无法通过 class 来设置，所以这里使用style 的 height 来设置
          height: id === dragOver ? heights[dragging] : 0 + "px"
        }}
      />
    </div>
  );
}
