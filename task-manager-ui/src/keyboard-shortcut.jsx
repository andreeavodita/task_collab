import { useCallback, useEffect } from "react";
import { useState } from "react";

const BLACKLISTED_TAGS = ["INPUT", "TEXTAREA"];

export default function useKeyboardShortcut(
    { key, ctrl = false, shift = false, alt = false, meta = false },
    callback) {

    useEffect(() => {
        function handler(e) {
            if (BLACKLISTED_TAGS.includes(e.target.tagName)) return;

            if (
                e.key.toLowerCase() !== key.toLowerCase() ||
                e.ctrlKey !== ctrl ||
                e.shiftKey !== shift || 
                e.altKey !== alt || 
                e.metaKey !== meta
            ) {
                return;
            }

            e.preventDefault();
            callback();
        }

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [key, ctrl, shift, alt, meta, callback]);

}