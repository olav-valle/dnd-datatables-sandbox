/*
  See another example of how to use `customRowRender` at
  https://github.com/Skn0tt/mui-datatables-responsive-demo
  https://mui-datatables-responsive-demo.skn0tt.now.sh
*/

import React from 'react'
import MuiDataTable from 'mui-datatables'
import { Draggable } from 'react-beautiful-dnd'
import { DragHandle } from '@material-ui/icons'
import { TableRow, TableCell } from '@material-ui/core'

function YourCustomRowComponent(props: any) {
    console.log(props)
    const { drag, name, cardNumber, cvc, expiry, index} = props
    //todo: fix width of draggable row to match parent table
    return (
        <Draggable draggableId={'draggable-' + index} index={index}>
            {(provided, snapshot) => (
                <React.Fragment>
                    <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                        <TableCell colSpan={1} {...provided.dragHandleProps}>
                            <DragHandle />
                            {drag}
                        </TableCell>
                        <TableCell colSpan={1}>{name}</TableCell>
                        <TableCell colSpan={1}>{cardNumber}</TableCell>
                        <TableCell colSpan={1}>{cvc}</TableCell>
                        <TableCell colSpan={1}>{expiry}</TableCell>
                    </TableRow>
                </React.Fragment>
            )}
        </Draggable>
    )
}

function DraggableTable(props: any) {
    const { columns, data } = props


    return (
        <MuiDataTable
            title='Cards'
            data={data}
            columns={columns}
            options={{
                selectableRows: 'none',
                responsive: 'standard',
                customRowRender: (data, dataIndex) => {
                    const [drag, name, cardNumber, cvc, expiry] = data

                    return (
                        <YourCustomRowComponent
                            drag={drag}
                            name={name}
                            cardNumber={cardNumber}
                            cvc={cvc}
                            expiry={expiry}
                            index={dataIndex}
                        />
                    )
                },
            }}
        />

    )
}

export default DraggableTable
