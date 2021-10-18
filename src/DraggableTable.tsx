/*
  See another example of how to use `customRowRender` at
  https://github.com/Skn0tt/mui-datatables-responsive-demo
  https://mui-datatables-responsive-demo.skn0tt.now.sh
*/

import React, {useState} from "react";
import ReactDOM from "react-dom";
import MuiDataTable from "mui-datatables";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
  DraggableProvided,
  DroppableProvided,
  DraggableStateSnapshot
} from "react-beautiful-dnd";

function YourCustomRowComponent(props: any) {
  const { name, cardNumber, cvc, expiry } = props;
  //todo: set unique draggableID and index (from element index in creditCards..?)
  //todo: fix use of draggableProps and dragHandleProps in <div> being wrapped by <Draggable>
  return (
    <Draggable draggableId={"draggable-" + cvc} index={0}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h1>{name}</h1>
          <p>
            Number: {cardNumber} <br />
            CVC: {cvc} <br />
            expiry: {expiry}
          </p>
        </div>
      )}
    </Draggable>
  );
}



function DraggableTable() {
  const creditCards = [
    {
      name: "Tom Tallis",
      cardNumber: "5500005555555559",
      cvc: "582",
      expiry: "02/24"
    },
    {
      name: "Rich Harris",
      cardNumber: "4444444444444448",
      cvc: "172",
      expiry: "03/22"
    },
    {
      name: "Moby Test",
      cardNumber: "3566003566003566",
      cvc: "230",
      expiry: "12/25"
    }
  ];

  const [localItems, setLocalItems] = useState(creditCards)

  const columns = [
    {
      name: "name",
      label: "Name"
    },
    {
      name: "cardNumber",
      label: "Card Number"
    },
    {
      name: "cvc",
      label: "CVC"
    },
    {
      name: "expiry",
      label: "Expiry"
    }
  ]


// normally one would commit/save any order changes via an api call here...
  const handleDragEnd = (result: DropResult, provided?: ResponderProvided) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    setLocalItems((prev: any) => {
      const temp = [...prev];
      const d = temp[result.destination!.index];
      temp[result.destination!.index] = temp[result.source.index];
      temp[result.source.index] = d;

      return temp;
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable-1">
        {(provided, snapshot) => (
          <MuiDataTable
            title="Cards"
            data={creditCards}
            columns={columns}
            options={{
              selectableRows: "none",
              responsive: "standard",
              customRowRender: (data) => {
                const [name, cardNumber, cvc, expiry] = data;

                return (
                  <tr key={cardNumber}>
                    <td colSpan={4} style={{ paddingTop: "10px" }}>
                      <YourCustomRowComponent
                        name={name}
                        cardNumber={cardNumber}
                        cvc={cvc}
                        expiry={expiry}
                      />
                    </td>
                  </tr>
                );
              }
            }}
          />
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DraggableTable;
