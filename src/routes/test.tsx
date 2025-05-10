import { createFileRoute } from '@tanstack/react-router'
import { machine } from '../machines/machine'
import { useMachine } from '@xstate/react';
import { inspector } from '../App';

export const Route = createFileRoute('/test')({
    component: RouteComponent,
})

function RouteComponent() {
    const [state, send] = useMachine(machine, {
        inspect: inspector.inspect
    });

    return (
        <div className="h-[calc(100vh-96px)] flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold mb-2 text-green-400 tracking-wide">Toggle Machine</h1>
                <p className="text-lg mb-4">
                    Current state:{" "}
                    <strong className={state.value === 'active' ? "text-green-400" : "text-red-400"}>
                        {state.value}
                    </strong>
                </p>
                <label className="flex items-center gap-4 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={state.value === 'active'}
                        onChange={() => send({ type: 'toggle' })}
                        className="sr-only"
                    />
                    <span
                        className={`relative inline-block w-14 h-8 transition-colors duration-300 rounded-full
                            ${state.value === 'active' ? 'bg-green-400' : 'bg-gray-500'}`}
                    >
                        <span
                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300
                                ${state.value === 'active' ? 'translate-x-6' : ''}`}
                        />
                    </span>
                    <span className={`ml-2 text-lg font-semibold ${state.value === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                        {state.value === 'active' ? 'Active' : 'Inactive'}
                    </span>
                </label>
            </div>
        </div>
    );
}
