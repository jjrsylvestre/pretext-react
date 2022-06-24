import React from "react";
import { Button } from "reakit";
import { useAppDispatch } from "../app/hooks";
import { globalActions } from "../features/global/globalSlice";
import { navActions } from "../features/nav/navSlice";

type InternalAnchorParams = {
    href: string;
    pageId?: string;
} & React.ComponentProps<"a">;

/**
 * An anchor element for internal links. Instead of redirecting to a new page,
 * the click directs a page to be loaded from the cache.
 */
export const InternalAnchor = React.forwardRef<
    HTMLAnchorElement,
    InternalAnchorParams
>(function InternalAnchor(
    {
        href,
        pageId,
        children,
        className,
        onClick,
        ...rest
    }: InternalAnchorParams,
    ref
) {
    const dispatch = useAppDispatch();

    return (
        <Button
            as="a"
            ref={ref}
            href={href}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                // We take over navigation with cached async loading,
                // so prevent a normal click from going through
                // UNLESS the user is trying to open the link in a new tab
                // by using a different mouse button or ctrl+click/etc.
                if (
                    e.button !== 0 ||
                    e.metaKey ||
                    e.altKey ||
                    e.ctrlKey ||
                    e.shiftKey
                ) {
                    return;
                }

                e.preventDefault();
                if (pageId) {
                    dispatch(navActions.setCurrentPage(pageId));
                } else {
                    dispatch(navActions.setCurrentPageByUrl(href));
                }
                if (onClick) {
                    onClick(e);
                }
            }}
            className={className ? `${className} internal` : "internal"}
            {...rest}
        >
            {children}
        </Button>
    );
});

/**
 * An anchor element that when clicked copies a permalink URL to the clipboard.
 */
export function PermalinkAnchor({
    href,
    pageId,
    children,
    className,
    onClick,
    title,
    ...rest
}: {
    href: string;
    pageId?: string;
} & React.ComponentProps<"a">) {
    const dispatch = useAppDispatch();

    const url = "" + new URL(href, window.location.href);

    return (
        <Button
            as="a"
            href={url}
            title={`Copy permalink to clipboard for ${title}`}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                // We take over navigation with cached async loading,
                // so prevent a normal click from going through.
                e.preventDefault();
                dispatch(globalActions.copyToClipboard({title: title, url: url}));
            }}
            className={className}
            {...rest}
        >
            {children}
        </Button>
    );
}
