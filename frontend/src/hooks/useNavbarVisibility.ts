import { useEffect, useState } from "react";

interface NavbarVisibilityOptions {
    revealZone?: number;
    topThreshold?: number;
    alwaysVisibleAtTop?: boolean;
}

export function useNavbarVisibility({
    revealZone = 80,
    topThreshold = 80,
    alwaysVisibleAtTop = true,
}: NavbarVisibilityOptions = {}) 
{
    const [visible, setVisible] = useState(true);

    const updateVisible = (next: boolean) => {
        setVisible(prev => (prev === next ? prev : next));
    };

    useEffect(() => {
        const desktop = window.matchMedia("(pointer:fine)").matches;

        //
        // Desktop
        //
        let lastMouseY = window.innerHeight;

        if (desktop) {

            const handleMouseMove = (e: MouseEvent) => {
                lastMouseY = e.clientY;

                updateVisible(
                    (alwaysVisibleAtTop && window.scrollY <= topThreshold) ||
                    lastMouseY <= revealZone
                );
            };

            setVisible(
                (alwaysVisibleAtTop && window.scrollY <= topThreshold) ||
                lastMouseY <= revealZone
            );

            window.addEventListener(
                "mousemove",
                handleMouseMove
            );

            const handleScroll = () => {
                updateVisible(
                    (alwaysVisibleAtTop && window.scrollY <= topThreshold) ||
                    lastMouseY <= revealZone
                );
            };

            window.addEventListener(
                "scroll",
                handleScroll,
                { passive: true }
            );

            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("scroll", handleScroll);
            };
        }

        //
        // Tablet / Mobile
        //
        let lastScroll = window.scrollY;

        const handleScroll = () => {

            const current = window.scrollY;

            if (current <= topThreshold) {
                updateVisible(true);
            } else {
                updateVisible(current < lastScroll);
            }

            lastScroll = current;
        };

        handleScroll();

        window.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };

    }, [revealZone, topThreshold, alwaysVisibleAtTop]);

    return visible;
}