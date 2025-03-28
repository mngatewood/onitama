import { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';

interface GuideTooltipProps {
	tooltip: {
		elementId: string;
		child: number[];
		position: {
			top: number | null;
			right: number | null;
			bottom: number | null;
			left: number | null;
		};
		text: string;
		arrowPosition: {
			x: string;
			y: string;
		};
	};
}

export const GuideTooltip = ({ tooltip, ...props }: GuideTooltipProps) => {
	const { elementId, child, position, text, arrowPosition } = tooltip;
	const tooltipRef = useRef<HTMLDivElement | null>(null);
	const elementRef = useRef<HTMLElement | null>(null);
	const [ arrowPositionClass, setArrowPositionClass ] = useState('')
	const [ offsetArrowX, setOffsetArrowX ] = useState<{right: string} | {left: string} | object >({})
	const [ tooltipReady, setTooltipReady ] = useState<boolean>(false);

	const updateArrowPosition = useCallback(( offset: number ) => {
		let style = {};
		if (offset > 0 && arrowPosition.x === 'right') {
			// 4px padding - 4px margin + 17px offset
			style= { right: '17px' };
		} else if (offset > 0 && arrowPosition.x === 'left') {
			// 4px padding - 4px margin + 17px offset
			style = { left: '17px' };
		} else if (offset < 0 && arrowPosition.x === 'right') {
			style = { right: (offset - 8) + 'px' };
		} else if (offset < 0 && arrowPosition.x === 'left') {
			style = { left: (offset - 8) + 'px' };
		}
		setOffsetArrowX(style)
	}, [arrowPosition.x])

	useLayoutEffect(() => {
		const observer = new MutationObserver(() => {
			if (elementId) {
				if (!child.length) {
					elementRef.current = document.getElementById(elementId);
				} else {
					let currentElement = document.getElementById(elementId);
					for (const index of child) {
						if (currentElement) {
							currentElement = currentElement.children[index] as HTMLElement;
						} else {
							break;
						}
					}
					elementRef.current = currentElement
				}
				if (elementRef.current && tooltipRef.current) {
					observer.disconnect();
					const elementRect = elementRef.current.getBoundingClientRect();
					const tooltipRect = tooltipRef.current.getBoundingClientRect();

					// fallback values
					let x = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
					let y = elementRect.top - 16;

					// TOOL TIP POSITIONING
					// above the element
					if (position.top !== null && Math.abs(position.top) > 0) {
						y = elementRect.top - tooltipRect.height - position.top;
					// below the element
					} else if (position.bottom !== null && position.bottom > 0) {
						y = elementRect.bottom + position.bottom;
					// left of the element
					} else if (position.left !== null && position.left > 0) {
						x = elementRect.left - tooltipRect.width - position.left;
					// right of the element
					} else if (position.right !== null && position.right > 0) {
						x = elementRect.right + position.right;
					}

					// VERTICAL ALIGNMENT
					// top of the element
					if (position.top === 0 && position.bottom === null) {
						y = elementRect.top;
					// bottom of the element
					} else if (position.bottom === 0 && position.top === null) {
						y = elementRect.bottom - tooltipRect.height;
					// center of the element
					} else if (position.top === 0 && position.bottom === 0) {
						y = elementRect.top + (elementRect.height - tooltipRect.height) / 2;
					}

					// HORIZONTAL ALIGNMENT
					// left of the element
					if (position.left === 0 && position.right === null) {
						x = elementRect.left - 4; // 4px padding
					// right of the element
					} else if (position.right === 0 && position.left === null) {
						x = elementRect.left + elementRect.width - tooltipRect.width + 4; // 4px padding
					// center of the element
					} else if (position.left === 0 && position.right === 0) {
						x = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
					}

					// if the tooltip is off the screen, adjust the position
					if (x < 0) {
						// offset the arrow position so it remains centered relative to element
						updateArrowPosition(Math.round(Math.abs(x)))
						x = 0;
					}
					if (x + tooltipRect.width > window.innerWidth) {
						// offset the arrow position so it remains centered relative to element
						updateArrowPosition(Math.round(x))
						x = window.innerWidth - tooltipRect.width;
					}
					if (y < 0) {
						y = 0;
					}
					if (y + tooltipRect.height > window.innerHeight) {
						y = window.innerHeight - tooltipRect.height - 56; // 56 is the height of the footer
					}
					tooltipRef.current.style.top = `${y}px`;
					tooltipRef.current.style.left = `${x}px`;
					setTooltipReady(true);
				}
			}
		});

		if (elementId) {
			observer.observe(document.body, { childList: true, subtree: true });
		};

		return () => {
			observer.disconnect();
		};
	}, [elementId, position, child, updateArrowPosition]);

	useEffect(() => {
		const { x, y } = arrowPosition

		if (x === "right" && y === "bottom") {
			setArrowPositionClass(`-bottom-2 right-2 border-x-8 border-x-transparent border-t-8 border-t-gray-500`)
		}

		if (x === "center" && y === "top") {
			setArrowPositionClass("-top-2 left-1/2 -translate-x-1/2 border-x-8 border-x-transparent border-b-8 border-b-gray-500")
		}

		if (x === "center" && y === "bottom") {
			setArrowPositionClass("-bottom-2 left-1/2 -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-gray-500")
		}

		if (x === "left" && y === "top") {
			setArrowPositionClass("-top-2 left-2 border-x-8 border-x-transparent border-b-8 border-b-gray-500")
		}

		if (x === "right" && y === "top") {
			setArrowPositionClass("-top-2 right-2 border-x-8 border-x-transparent border-b-8 border-b-gray-500")
		}

		if (x === "left" && y === "center") {
			setArrowPositionClass("-left-2 top-1/2 -translate-y-1/2 border-y-8 border-y-transparent border-r-8 border-r-gray-500")
		}

	}, [arrowPosition, offsetArrowX])

	return (
		<div ref={tooltipRef} {...props} className={`${!tooltipReady ? "opacity-0" : "opacity-1"} fixed z-50`}>
			<div className="px-4 py-2 bg-slate-500 rounded-md text-purple border-gray-500 border right-0 text-lg mx-2 relative">
				<span className={`h-0 w-0 absolute ${arrowPositionClass}`} style={offsetArrowX}></span>
				<span>{text}</span>
			</div>
		</div>
	);
 };