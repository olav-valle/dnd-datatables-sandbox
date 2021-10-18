/*
  See another example of how to use `customRowRender` at
  https://github.com/Skn0tt/mui-datatables-responsive-demo
  https://mui-datatables-responsive-demo.skn0tt.now.sh
*/

import React from "react";
import ReactDOM from "react-dom";
import MuiDataTable from "mui-datatables";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

  // return (
  //   <div>
  //     <h1>{name}</h1>
  //          <p>
  //            Number: {cardNumber} <br />
  //            CVC: {cvc} <br />
  //            expiry: {expiry}
  //          </p>
  //   </div>
  // );
}

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

const onDragEnd = (result: any) => {};

function DraggableTable() {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-1">
        {(provided, snapshot) => (
          <MuiDataTable
            title="Cards"
            data={creditCards}
            columns={[
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
            ]}
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
