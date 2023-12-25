import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-slate-900">

            <div className="w-full sm:max-w-md mt-6 px-6 py-4  overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
