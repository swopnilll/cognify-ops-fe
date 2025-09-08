import { setup, createActor, assign } from 'xstate';



export const machine = setup({
}).createMachine({
    id: "toggle",
    initial: "active",
    states: {
        active: {
            on: {
                toggle: { target: "inactive" }
            },
        },
        inactive: {
            on: {
                toggle: { target: "active" }
            },
        },
    }
})

