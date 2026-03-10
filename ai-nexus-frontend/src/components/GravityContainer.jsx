import React, { useEffect, useRef, useState } from 'react';

export default function GravityContainer({ messages }) {
    const containerRef = useRef(null);
    const bubblesRef = useRef([]);
    const requestRef = useRef();

    const [physicsState, setPhysicsState] = useState([]);

    useEffect(() => {
        setPhysicsState(prev => {
            const newState = [...prev];
            messages.forEach(msg => {
                if (!newState.find(p => p.id === msg.id)) {
                    newState.push({
                        id: msg.id,
                        role: msg.role || 'user',
                        text: msg.text,
                        type: msg.type,
                        x: Math.random() * 200 + 100,
                        y: -100,
                        vx: (Math.random() - 0.5) * 5,
                        vy: 0,
                        isDragging: false,
                        w: 0,
                        h: 0
                    });
                }
            });
            return newState;
        });
    }, [messages]);

    useEffect(() => {
        const gravity = 0.5;
        const bounce = -0.6;
        const friction = 0.98;

        const animate = () => {
            if (!containerRef.current) {
                requestRef.current = requestAnimationFrame(animate);
                return;
            }

            const containerBounds = containerRef.current.getBoundingClientRect();

            setPhysicsState(prev => prev.map((p, i) => {
                if (p.isDragging) return p;

                const domEl = bubblesRef.current[i];
                if (domEl && p.w === 0) {
                    p.w = domEl.offsetWidth;
                    p.h = domEl.offsetHeight;
                }

                let { x, y, vx, vy, w, h } = p;

                if (w === 0 || h === 0) return p;

                vy += gravity;
                vx *= friction;
                vy *= friction;

                x += vx;
                y += vy;

                if (y + h > containerBounds.height) {
                    y = containerBounds.height - h;
                    vy *= bounce;
                    vx *= 0.8;
                }

                if (y < 0) {
                    y = 0;
                    vy *= bounce;
                }

                if (x < 0) {
                    x = 0;
                    vx *= bounce;
                }

                if (x + w > containerBounds.width) {
                    x = containerBounds.width - w;
                    vx *= bounce;
                }

                return { ...p, x, y, vx, vy };
            }));

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    const handlePointerDown = (e, index) => {
        e.target.setPointerCapture(e.pointerId);
        setPhysicsState(prev => {
            const nw = [...prev];
            if (nw[index]) {
                nw[index].isDragging = true;
                nw[index].vx = 0;
                nw[index].vy = 0;
            }
            return nw;
        });
    };

    const handlePointerMove = (e, index) => {
        setPhysicsState(prev => {
            if (!prev[index]?.isDragging) return prev;
            const nw = [...prev];
            const containerBounds = containerRef.current.getBoundingClientRect();
            let newX = e.clientX - containerBounds.left - nw[index].w / 2;
            let newY = e.clientY - containerBounds.top - nw[index].h / 2;

            nw[index].x = newX;
            nw[index].y = newY;

            nw[index].vx = e.movementX * 0.5;
            nw[index].vy = e.movementY * 0.5;
            return nw;
        });
    };

    const handlePointerUp = (e, index) => {
        e.target.releasePointerCapture(e.pointerId);
        setPhysicsState(prev => {
            const nw = [...prev];
            if (nw[index]) nw[index].isDragging = false;
            return nw;
        });
    };

    return (
        <div className="GravityContainer" ref={containerRef}>
            {physicsState.map((bubble, i) => (
                <div
                    key={bubble.id}
                    ref={el => bubblesRef.current[i] = el}
                    className={`chat-bubble ${bubble.type}`}
                    style={{
                        transform: `translate(${bubble.x}px, ${bubble.y}px)`,
                        zIndex: bubble.isDragging ? 10 : 1
                    }}
                    onPointerDown={e => handlePointerDown(e, i)}
                    onPointerMove={e => handlePointerMove(e, i)}
                    onPointerUp={e => handlePointerUp(e, i)}
                    onPointerCancel={e => handlePointerUp(e, i)}
                >
                    {bubble.type === 'ai' && <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '4px' }}>AI - {bubble.role.toUpperCase()}</div>}
                    {bubble.text}
                </div>
            ))}
        </div>
    );
}
