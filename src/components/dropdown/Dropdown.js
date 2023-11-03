import React from 'react';
import { DropdownProvider } from './dropdown-context';

const Dropdown = ({ children, ...props }) => {
    return (
        <DropdownProvider {...props}>
            <div className="relative inline-block w-full rounded-lg border-solid border-[#ccc] border">{children}</div>
        </DropdownProvider>
    );
};

export default Dropdown;
