/*
  See another example of how to use `customRowRender` at
  https://github.com/Skn0tt/mui-datatables-responsive-demo
  https://mui-datatables-responsive-demo.skn0tt.now.sh
*/

import React, { Reducer, useEffect, useReducer, useState } from 'react'
import MuiDataTable from 'mui-datatables'
import { DragDropContext, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd'
import DraggableTable from './DraggableTable'

function TableParent() {


    // these objects would be generated from queried data
    const creditCards1: CardListModel = {
        listId: 1,
        cards: [
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
        ],
    }

    const creditCards2: CardListModel = {
        listId: 2,
        cards: [
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
            }
            ,
            {
                name: 'Moby Richardson',
                cardNumber: '0335660356005666',
                cvc: '230',
                expiry: '12/25',
            },
        ],
    }


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

    // remodel this to fit useState objects used in ZoneTable
    type StateModel = {
        lists: CardListModel[]
    }

    const creditCardsInitial: StateModel = {
        lists: [
            creditCards1,
            creditCards2,
        ],
    }

    enum ActionEnum {
        MoveItem = 'MoveItem',
        ReorderItem = 'ReorderItem'
    }

    // Type of action that our reducer takes
    type ActionType = {
        type: ActionEnum,
        payload: DropResult
    }

    const moveAction = (payload: DropResult): ActionType => {
        return {
            type: ActionEnum.MoveItem,
            payload: payload,
        }
    }

    const reorderAction = (payload: DropResult): ActionType => {
        return {
            type: ActionEnum.ReorderItem,
            payload: payload,
        }
    }

// Reducer for handling reordering and moving of state data.
    const reducer = (state: StateModel, action: ActionType) => {
        //todo: action enum MOVE, REORDER, NONE,
        const { type, payload } = action

        switch (type) {
            case ActionEnum.ReorderItem:
                return state
            default:
                return state
        }
    }

    const reorderList = () => {

    }

    const moveItemBetweenLists = () => {

    }

    // use this to build zone-sensor lists from fetch?
    const init = (creditCards: any) => {
        return creditCards
    }

    const [state, dispatch] = useReducer<typeof reducer, StateModel>(reducer, creditCardsInitial, init)

    //todo: use action dispatch in handleDragEnd

    // Figures out what happened during the drag-and-drop (moved to new list, reordered, ...)
    // normally one would commit/save any order changes via an api call here...
    const handleDragEnd = (result: DropResult, provided?: ResponderProvided) => {

        // not moved at all, or moved outside context
        if (!result.destination) {
            return
        }
        // dragged inside same list
        if (result.source.droppableId === result.destination?.droppableId) {
            if (result.destination.index === result.source.index) {
                return
            } else {
                //reorder
                dispatch(reorderAction(result))
                //todo: dispatch REORDER
                // todo: refactor to reorderList function
            }
        } else {
            // dragged to different list than source
            dispatch(moveAction(result))
            //todo dispatch MOVE
            return
        }

    }



//todo: Eval: implement onDragEnd so it works as a callback for Draggable grandchild?
//todo: make parent (this comp) render muitable with DraggableTable comps as rows
//todo: make parent and grandparent collapsible
    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            {((state as StateModel).lists.map((list, index) =>
                <Droppable droppableId={`${index}`}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            <DraggableTable columns={columns} data={list.cards} />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>,
            ))}
        </DragDropContext>
    )
}

export type CardListModel = {
    listId: number,
    cards: CardModel[]
}

export type CardModel = {
    name: string,
    cardNumber: string,
    cvc: string,
    expiry: string
}

export default TableParent
