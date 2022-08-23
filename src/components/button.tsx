import React, { useState } from 'react';

export interface ButtonProps {}

export const Button = ({}: ButtonProps): JSX.Element => {
    const [state, setState] = useState<boolean>(false);

    return (
        <button onClick={() => setState((t) => !t)} className="hover:text-pink-500 bg-yellow-600 border border-slate-800 p-1 rounded">
            {state ? 'yo' : 'bye bye'}
        </button>
    );
};
