/*
  See another example of how to use `customRowRender` at
  https://github.com/Skn0tt/mui-datatables-responsive-demo
  https://mui-datatables-responsive-demo.skn0tt.now.sh
*/

import React, {useEffect, useState} from "react";
import MuiDataTable from "mui-datatables";
import {DragDropContext, Draggable, Droppable, DropResult, ResponderProvided} from "react-beautiful-dnd";
import {DragHandle} from "@material-ui/icons";
import {TableRow, TableCell} from "@material-ui/core"
import {flexbox} from "@material-ui/system";

function YourCustomRowComponent(props: any) {
    const {name, cardNumber, cvc, expiry, index, colSpan} = props;
    //todo: fix width of draggable row to match parent table
    return (
        <Draggable draggableId={"draggable-" + index} index={index}>
            {(provided, snapshot) => (
                <React.Fragment>

                    <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                    >
                        <TableCell {...provided.dragHandleProps}><DragHandle/></TableCell>
                        <TableCell>{name}</TableCell>
                        <TableCell>
                            Number: {cardNumber}
                        </TableCell>
                        <TableCell>CVC: {cvc}</TableCell>
                        <TableCell>expiry: {expiry}</TableCell>
                    </TableRow>
                </React.Fragment>
            )}
        </Draggable>
    );
}


function DraggableTable({}) {
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

    useEffect(() => {
        setLocalItems(creditCards)

    }, [])


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
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <MuiDataTable
                            title="Cards"
                            data={localItems}
                            columns={columns}
                            options={{
                                selectableRows: "none",
                                responsive: "standard",
                                customRowRender: (data, dataIndex,) => {
                                    const [name, cardNumber, cvc, expiry] = data;

                                    return (
                                        <TableRow key={dataIndex}>
                                            <TableCell colSpan={data.length+1}>
                                                <YourCustomRowComponent
                                                    name={name}
                                                    cardNumber={cardNumber}
                                                    cvc={cvc}
                                                    expiry={expiry}
                                                    index={dataIndex}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            }}
                        />
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default DraggableTable;
