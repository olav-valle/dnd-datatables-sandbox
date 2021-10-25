/*
  See another example of how to use `customRowRender` at
  https://github.com/Skn0tt/mui-datatables-responsive-demo
  https://mui-datatables-responsive-demo.skn0tt.now.sh
*/

import React, { useEffect, useState } from 'react'
import MuiDataTable from 'mui-datatables'
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd'
import { DragHandle } from '@material-ui/icons'
import DraggableTable from './DraggableTable'

function YourCustomRowComponent(props: any) {
    const { items, columns, index } = props
    return (
        <Droppable droppableId={'droppable-' + index}>
            {(provided, snapshot) => (
                <React.Fragment>
                    <MuiDataTable
                        title="Cards"
                        data={items}
                        columns={columns}
                        options={{
                            selectableRows: 'none',
                            responsive: 'standard',
                            customRowRender: (data, dataIndex) => {
                                const [name, cardNumber, cvc, expiry] = data

                                return (
                                    <tr key={dataIndex}>
                                        <td colSpan={4} style={{ paddingTop: '10px' }}>
                                            <YourCustomRowComponent
                                                name={name}
                                                cardNumber={cardNumber}
                                                cvc={cvc}
                                                expiry={expiry}
                                                index={dataIndex}
                                            />
                                        </td>
                                    </tr>
                                )
                            },
                        }}
                    />
                </React.Fragment>
            )}
        </Droppable>
    )
}

function TableParent() {

    interface IcreditCard {
        name: string,
        cardNumber: string,
        cvc: string,
        expiry: string
    }


    const creditCards1: IcreditCard[] = [
        {
            name: 'Tom Tallis',
            cardNumber: '5500005555555559',
            cvc: '582',
            expiry: '02/24',
        },
        {
            name: 'Rich Harris',
            cardNumber: '4444444444444448',
            cvc: '172',
            expiry: '03/22',
        },
        {
            name: 'Moby Test',
            cardNumber: '3566003566003566',
            cvc: '230',
            expiry: '12/25',
        },
    ]

    const creditCards2: IcreditCard[] = [
        {
            name: 'Tom Waits',
            cardNumber: '5500005555555559',
            cvc: '325',
            expiry: '03/30',
        },
        {
            name: 'Rich Gallup',
            cardNumber: '9292929113444484',
            cvc: '123',
            expiry: '03/22',
        },
        {
            name: 'Moby Richardson',
            cardNumber: '0335660356005666',
            cvc: '230',
            expiry: '12/25',
        },
    ]



    const creditCards: IcreditCard[][] = [
        creditCards1,
        creditCards2
    ]

    const [localItems, setLocalItems] = useState<IcreditCard[][] | null>(creditCards)

    const columns = [
        {
            name: '',
            label: '',
        },
        {
            name: 'name',
            label: 'Name',
        },
        {
            name: 'cardNumber',
            label: 'Card Number',
        },
        {
            name: 'cvc',
            label: 'CVC',
        },
        {
            name: 'expiry',
            label: 'Expiry',
        },
    ]

    useEffect(() => {
        if (creditCards != null) {
            setLocalItems(creditCards)
            console.log(localItems)
        }
    }, [])

    // normally one would commit/save any order changes via an api call here...
    const handleDragEnd = (result: DropResult, provided?: ResponderProvided) => {
        if (!result.destination) {
            return
        }

        if (result.destination.index === result.source.index) {
            return
        }

        setLocalItems((prev: any) => {
            const temp = [...prev]
            const d = temp[result.destination!.index]
            temp[result.destination!.index] = temp[result.source.index]
            temp[result.source.index] = d

            return temp
        })
    }
    //todo: Eval: implement onDragEnd so it works as a callback for Draggable grandchild?
    //todo: make parent (this comp) render muitable with DraggableTable comps as rows
    //todo: make parent and grandparent collapsible
    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-1">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <DraggableTable columns={columns} data={localItems![0]}/>
                        <DraggableTable columns={columns} data={localItems![1]}/>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default TableParent
