import React, { Reducer } from 'react'
import { DragDropContext, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd'
import DraggableTable from './DraggableTable'
import { Draft, Immutable } from 'immer'
import { useImmerReducer } from 'use-immer'
import MuiDataTable from 'mui-datatables'



    // these objects would be generated from queried data
    const creditCards1: CardListModel = {
        listId: 0,
        cards: [
            {
                name: 'Tom Tallis',
                cardNumber: '1111111111111111',
                cvc: '582',
                expiry: '02/24',
            },
            {
                name: 'Rich Harris',
                cardNumber: '2222222222222222',
                cvc: '172',
                expiry: '03/22',
            },
            {
                name: 'Moby Test',
                cardNumber: '3333333333333333',
                cvc: '230',
                expiry: '12/25',
            },
        ],
    }

    const creditCards2: CardListModel = {
        listId: 1,
        cards: [
            {
                name: 'Tom Waits',
                cardNumber: '4444444444444444',
                cvc: '325',
                expiry: '03/30',
            },
            {
                name: 'Rich Gallup',
                cardNumber: '5555555555555555',
                cvc: '123',
                expiry: '03/22',
            }
            ,
            {
                name: 'Moby Richardson',
                cardNumber: '6666666666666666',
                cvc: '630',
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
        {
            name: 'index',
            label: 'dragIndex'
        }
    ]

function TableParent() {

    // remodel this to fit useState objects used in ZoneTable
    type StateModel = {
        lists: CardListModel[]
    }

    // immer recommends setting all types as readonly,
    // or wrapping in Immutable..?
    type ReadOnlyStateModel = Immutable<StateModel>


    const creditCardsInitial: ReadOnlyStateModel = {
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
    const reducer: Reducer<Draft<any>, ActionType> = (draft: Draft<StateModel>, action: ActionType) => {
        const { type, payload } = action

        switch (type) {
            case ActionEnum.MoveItem:
                moveItemBetweenLists(draft, payload)
                return
            case ActionEnum.ReorderItem:
                reorderList(draft, payload)
                return
            default:
                return
        }
    }

    // Moves an element around inside its list
    const reorderList = (draft: Draft<StateModel>, payload: DropResult) => {
        const fromList = Number.parseInt(payload.source!.droppableId)
        const toIdx = payload.destination?.index!
        const fromIdx = payload.source?.index
        const [removed] = draft.lists[fromList].cards.splice(fromIdx, 1)
        draft.lists[fromList].cards.splice(toIdx, 0, removed)
    }

    // Moves an element between two lists
    const moveItemBetweenLists = (draft: Draft<StateModel>, payload: DropResult) => {
        const toList = Number.parseInt(payload.destination!.droppableId)
        const fromList = Number.parseInt(payload.source!.droppableId)
        const toIdx = payload.destination?.index!
        const fromIdx = payload.source?.index
        const [removed] = draft.lists[fromList].cards.splice(fromIdx, 1)
        draft.lists[toList].cards.splice(toIdx, 0, removed)
    }

    // use this to build zone-sensor lists from fetch?
    const init = (creditCards: any) => {
        return creditCards
    }

    const [state, dispatch] = useImmerReducer<ReadOnlyStateModel>(reducer, creditCardsInitial, init)

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
            }
        } else {
            // dragged to different list than source
            dispatch(moveAction(result))
            // dispatch(reorderAction(result))

            return
        }

    }

//todo: make parent and grandparent collapsible
    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            {/*<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>*/}
            {((state as StateModel)?.lists?.map((list, index) =>
                <Droppable key = {list.listId} droppableId={`${list.listId}`}>
                    {/*<Droppable droppableId={`${index}`}>*/}
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            <DraggableTable columns={columns} data={list.cards} />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>,
            ))}
            {/*</div>*/}
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
