import {
    createContext,
    useContext,
    ReactNode,
} from "react";

import { useNavbarVisibility } from "@/hooks/useNavbarVisibility";

interface NavbarVisibilityOptions {
    alwaysVisibleAtTop?: boolean;
}

const NavbarVisibilityContext =
    createContext(true);

interface ProviderProps {
    children: ReactNode;
    options?: NavbarVisibilityOptions;
}

export function NavbarVisibilityProvider({
    children,
    options,
}: ProviderProps) {

    const visible = useNavbarVisibility(options);

    return (
        <NavbarVisibilityContext.Provider
            value={visible}
        >
            {children}
        </NavbarVisibilityContext.Provider>
    );
}

export function useSharedNavbarVisibility() {
    return useContext(NavbarVisibilityContext);
}