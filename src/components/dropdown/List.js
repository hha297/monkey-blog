import React from 'react';
import { useDropdown } from './dropdown-context';

const List = ({ children }) => {
    const { show } = useDropdown();
    return (
        <>
            {show && (
                <div className="mt-[2px] absolute rounded-lg top-full left-0 w-full border border-solid border-[#ccc]  bg-white shadow-sm">
                    {children}
                </div>
            )}
        </>
    );
};

export default List;
