import React, { useState } from 'react';
import { Slider } from '../../src';

export const Home = () => {
    const [state, setState] = useState<number>(0.2);

    return (
        <div className="h-full w-full">
            <main className="h-full w-full flex flex-col justify-evenly items-center bg-neutral-900">
                <span className="text-base font-semibold text-slate-50 underline underline-offset-4">Hello Ji</span>
                <Slider value={state} onChange={(val: number) => setState(val)} onHoverFat={true} className="max-w-xl" />
            </main>
        </div>
    );
};
